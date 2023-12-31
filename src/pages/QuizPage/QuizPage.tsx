import React, { useEffect, useState } from 'react'
import useAppRouteStore, { AppRoute } from '../../core/stores/appRouteStore'
import useSurveyStore from '../../core/stores/surveyStore'
import { Question, QuestionType, QuestionWithRating, SurveyStatus } from '../../core/types/Surveys'
import useResultsStore from '../../core/stores/resultsStore'
import { Answer } from '../../core/types/Result'
import SurveysApi from '../../core/api/surveysApi'
import messageHelper from '../../core/helpers/messageHelper'
import surveyHelper from '../../core/helpers/surveyHelper'
import ResultsApi from '../../core/api/resultsApi'
import resultHelper from '../../core/helpers/resultHelper'
import { Button, Popover } from 'rsuite'
import defaultImage from '../../assets/placeholder-image.jpg'
import QuestionGroupPicker from '../../components/QuestionGroupPicker/QuestionGroupPicker'
import QuizQuestionGroup from '../../components/QuizQuestionGroup/QuizQuestionGroup'

import styles from './QuizPage.css'

const QuizPage: React.FC = () => {
    const { surveyId, setRoute } = useAppRouteStore()
    const {
        title: surveyTitle,
        description: surveyDescription,
        questionGroups,
        questions,
        status,
        setStore: setSurveyStore,
        created,
        modified,
    } = useSurveyStore()

    const [isDataLoading, setIsDataLoading] = useState<boolean>(true)
    const [surveyStatus, setSurveyStatus] = useState<SurveyStatus>(SurveyStatus.Draft)
    const [currentQuestionGroupId, setCurrentQuestionGroupId] = useState<string>()

    const { id: resultId, resultData, setStore: setResultsStore } = useResultsStore()

    useEffect(() => {
        const initialAnswers = (questions: Record<string, Question>): Answer[] => {
            const resultAnswers: Answer[] = []
            Object.values(questions).forEach((question) => {
                switch (question.type) {
                    case QuestionType.SingleOption:
                    case QuestionType.MultipleOptions:
                    case QuestionType.SingleLineText:
                    case QuestionType.MultipleLineText:
                        resultAnswers.push({ questionId: question.id, answer: '' })
                        break
                    case QuestionType.NumberValue:
                        resultAnswers.push({ questionId: question.id, answer: '0' })
                        break
                    case QuestionType.DateValue:
                        resultAnswers.push({ questionId: question.id, answer: new Date().getTime().toString() })
                        break
                    case QuestionType.Rating:
                        const questionWithRating = question as QuestionWithRating
                        resultAnswers.push({ questionId: question.id, answer: `1 из ${questionWithRating.maxValue}` })
                        break
                }
            })
            return resultAnswers
        }

        const fetchSurvey = async () => {
            setIsDataLoading(true)
            const surveyDataResponse = await SurveysApi.getSurveyById(surveyId)
            if (!surveyDataResponse.success) {
                messageHelper.pushMessage(surveyDataResponse.error, 'error')
                return
            }
            const survey = surveyHelper.parseRequestSurveyData(surveyDataResponse.data)

            setSurveyStore({
                id: surveyId,
                title: survey.title,
                description: survey.description,
                questionGroups: survey.data.content.questionGroups,
                questions: survey.data.content.questions,
                status: survey.data.settings.status,
                created: survey.created,
                modified: survey.modified,
            })

            const resultDataResponse = await ResultsApi.getResults()
            if (!resultDataResponse.success) {
                messageHelper.pushMessage(resultDataResponse.error, 'error')
                return
            }

            const unfinfishedResult = resultDataResponse.data
                .map((resultData) => resultHelper.parseRequestResultData(resultData))
                .find((result) => !result.data.isFinished)

            if (unfinfishedResult) {
                setResultsStore({
                    id: unfinfishedResult.id,
                    surveyId: surveyId,
                    resultData: unfinfishedResult.data,
                })
            } else {
                setResultsStore({
                    id: 'new',
                    surveyId: surveyId,
                    resultData: {
                        isFinished: false,
                        answers: initialAnswers(survey.data.content.questions),
                    },
                })
            }

            if (survey.data.content.questionGroups.length > 0) {
                setCurrentQuestionGroupId(survey.data.content.questionGroups[0].id)
            }
            setSurveyStatus(survey.data.settings.status)
            setIsDataLoading(false)
        }

        fetchSurvey()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const callFunctionAfterQuestionCheck = (callback: () => void, checkAll?: boolean) => {
        let currentQuestionsIds: string[] = []
        if (checkAll) {
            currentQuestionsIds = Object.keys(questions)
        } else {
            currentQuestionsIds =
                questionGroups?.find((questionGroup) => questionGroup.id === currentQuestionGroupId)?.questions || []
        }
        if (currentQuestionsIds.length > 0) {
            for (const questionId of currentQuestionsIds) {
                if (
                    questions[questionId].isNecessarily &&
                    resultData.answers.find((answer) => answer.questionId === questionId)?.answer === ''
                ) {
                    messageHelper.pushMessage('Ответьте на все обязательные вопросы', 'warning')
                    return
                }
            }
            callback()
        }
    }

    const handleFinishSurvey = () => {
        callFunctionAfterQuestionCheck(() => saveResultWithFinishedFlag(true), true)
    }

    const handleSaveAndExit = () => {
        saveResultWithFinishedFlag(false)
    }

    const handleExit = () => {
        setRoute(AppRoute.Main)
    }

    const exitButtonPopover = (
        <Popover title="Внимание" className="custom-popover">
            <div>Сохранить результаты прохождения опроса?</div>
            <div className={styles.popoverButtons}>
                <Button onClick={handleSaveAndExit} appearance="primary">
                    Да
                </Button>
                <Button onClick={handleExit}>Нет</Button>
            </div>
        </Popover>
    )

    const saveResultWithFinishedFlag = async (isFinished: boolean) => {
        if (surveyStatus === SurveyStatus.Draft) {
            setRoute(AppRoute.Main)
            return
        }

        let updateResultResponse
        if (resultId === 'new') {
            updateResultResponse = await resultHelper.createResult({
                id: crypto.randomUUID(),
                surveyId: surveyId,
                data: {
                    ...resultData,
                    isFinished: isFinished,
                },
            })
        } else {
            updateResultResponse = await resultHelper.updateResult({
                id: resultId,
                surveyId: surveyId,
                data: {
                    ...resultData,
                    isFinished: isFinished,
                },
            })
        }

        if (!updateResultResponse.success) {
            messageHelper.pushMessage('Ошибка при сохранении результата', 'error')
            return
        }

        const updateSurveyResponse = await surveyHelper.updateSurvey(
            {
                id: surveyId,
                title: surveyTitle,
                description: surveyDescription,
                created: created,
                modified: modified,
                data: {
                    content: {
                        questionGroups: questionGroups,
                        questions: questions,
                    },
                    settings: {
                        status: status,
                    },
                },
            },
            SurveyStatus.Active
        )

        if (updateSurveyResponse.success) {
            setRoute(AppRoute.Main)
        }
    }

    return isDataLoading ? (
        <div>Загрузка опроса</div>
    ) : (
        <div className={styles.container}>
            <div className={styles.quizContainer}>
                <div className={styles.quizInfo}>
                    <div className={styles.title}>{surveyTitle}</div>
                    <div className={styles.data}>
                        <img className={styles.image} src={defaultImage} />
                        <div className={styles.description}>
                            <div>{surveyDescription}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.quizContent}>
                    <QuestionGroupPicker
                        currentQuestionGroupId={currentQuestionGroupId}
                        setCurrentQuestionGroupId={setCurrentQuestionGroupId}
                        checkQuestionsFunction={callFunctionAfterQuestionCheck}
                    />
                    {currentQuestionGroupId && (
                        <QuizQuestionGroup
                            groupId={currentQuestionGroupId}
                            exitButtonPopover={exitButtonPopover}
                            handleExit={handleExit}
                            handleFinishSurvey={handleFinishSurvey}
                            isDraft={status === SurveyStatus.Draft}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuizPage
