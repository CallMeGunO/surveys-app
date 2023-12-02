import React, { useEffect, useState } from 'react'
import useSurveyStore from '../../core/stores/surveyStore'
import useAppRouteStore, { AppRoute } from '../../core/stores/appRouteStore'
import { QuestionType, SurveyStatus } from '../../core/types/Surveys'
import surveyStoreHelper from '../../core/helpers/surveyStoreHelper'
import SurveysApi from '../../core/api/surveysApi'
import messageHelper from '../../core/helpers/messageHelper'
import surveyHelper from '../../core/helpers/surveyHelper'
import { ApiResponse } from '../../core/types/Common'
import PageHeader from '../../components/PageHeader/PageHeader'
import ButtonWithIcon from '../../components/ButtonWithIcon/ButtonWithIcon'
import { AcceptIcon, CancelIcon, EditIcon, SaveIcon } from '@fluentui/react-icons-mdl2'
import { Input } from 'rsuite'
import QuestionGroupPicker from '../../components/QuestionGroupPicker/QuestionGroupPicker'
import QuestionGroup from '../../components/QuestionGroup/QuestionGroup'
import defaultImage from '../../assets/placeholder-image.jpg'

import styles from './SurveyPage.css'
import './SurveyPageStaticStyles.css'

const SurveyPage: React.FC = () => {
    const [surveyTitle, setSurveyTitle] = useState<string>('Заголовок опроса')
    const [surveyDescription, setSurveyDescription] = useState<string>('')
    const [isTitleEdit, setIsTitleEdit] = useState<boolean>(false)

    const { setStore: setSurveyStore, questionGroups, questions } = useSurveyStore()
    const { appRoute, setRoute, surveyId } = useAppRouteStore()

    const [currentQuestionGroupId, setCurrentQuestionGroupId] = useState<string>()

    useEffect(() => {
        const fetchSurvey = async () => {
            if (appRoute === AppRoute.New) {
                setSurveyStore({
                    id: surveyId,
                    title: '',
                    description: '',
                    questionGroups: [],
                    questions: {},
                    status: SurveyStatus.Draft,
                    created: new Date().getDate(),
                    modified: new Date().getDate(),
                })

                const initialQuestionGroupId = crypto.randomUUID()
                surveyStoreHelper.addQuestionGroup({
                    id: initialQuestionGroupId,
                    questions: [],
                    title: 'Название группы',
                })
                surveyStoreHelper.addQuestion(
                    {
                        id: crypto.randomUUID(),
                        isFreeAnswer: false,
                        isNecessarily: false,
                        title: '',
                        type: QuestionType.SingleOption,
                    },
                    initialQuestionGroupId
                )
                setCurrentQuestionGroupId(initialQuestionGroupId)
            } else if (appRoute === AppRoute.Edit) {
                const surveyDataResponse = await SurveysApi.getSurveyById(surveyId)
                if (!surveyDataResponse.success) {
                    messageHelper.pushMessage(surveyDataResponse.error, 'error')
                    return
                }
                const survey = surveyHelper.parseRequestSurveyData(surveyDataResponse.data)

                setSurveyTitle(survey.title)
                setSurveyDescription(survey.description)
                setCurrentQuestionGroupId(survey.data.content.questionGroups[0].id)

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
            }
        }

        fetchSurvey()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const saveSurvey = async (status: SurveyStatus) => {
        let response: ApiResponse<boolean>
        if (appRoute === AppRoute.Edit) {
            response = await surveyHelper.updateSurvey(
                {
                    id: surveyId,
                    title: surveyTitle,
                    description: surveyDescription,
                    created: new Date().getTime(),
                    modified: new Date().getTime(),
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
                status
            )
        } else {
            response = await surveyHelper.createSurvey(
                {
                    id: crypto.randomUUID(),
                    title: surveyTitle,
                    description: surveyDescription,
                    created: new Date().getTime(),
                    modified: new Date().getTime(),
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
                status
            )
        }
        if (response.success) {
            messageHelper.pushMessage('Опрос сохранен', 'success')
            handleGoToMainPage()
        } else {
            messageHelper.pushMessage(response.error, 'error')
        }
    }

    const handleGoToMainPage = () => {
        setSurveyStore({
            id: '',
            title: '',
            description: '',
            questionGroups: [],
            questions: {},
            status: SurveyStatus.Draft,
            created: 0,
            modified: 0,
        })
        setRoute(AppRoute.Main)
    }

    const handleSaveToDraft = () => {
        saveSurvey(SurveyStatus.Draft)
    }

    const handleSaveAndPublish = () => {
        saveSurvey(SurveyStatus.Active)
    }

    return (
        <div className={styles.container}>
            <PageHeader>
                <ButtonWithIcon icon={<CancelIcon />} onClick={handleGoToMainPage}>
                    Отменить
                </ButtonWithIcon>
                <ButtonWithIcon icon={<SaveIcon />} onClick={handleSaveToDraft}>
                    Сохранить без публикации
                </ButtonWithIcon>
                <ButtonWithIcon icon={<AcceptIcon />} onClick={handleSaveAndPublish}>
                    Опубликовать
                </ButtonWithIcon>
            </PageHeader>
            <div className={styles.surveyContainer}>
                <div
                    className={styles.title}
                    onClick={() => {
                        setIsTitleEdit(true)
                    }}
                >
                    <Input
                        placeholder="Заголовок опроса"
                        value={surveyTitle}
                        plaintext={!isTitleEdit}
                        classPrefix="survey-title"
                        autoFocus={true}
                        onChange={setSurveyTitle}
                        onBlur={() => {
                            setIsTitleEdit(false)
                        }}
                    />
                    {!isTitleEdit && <EditIcon />}
                </div>
                <div className={styles.surveyData}>
                    <div className={styles.image}>
                        <img src={defaultImage} />
                    </div>
                    <div className={styles.inputs}>
                        <div className={styles.description}>
                            <span className={styles.label}>Описание опроса:</span>
                            <Input as="textarea" rows={9} value={surveyDescription} onChange={setSurveyDescription} />
                        </div>
                    </div>
                </div>
                <div className={styles.surveyContent}>
                    <QuestionGroupPicker
                        currentQuestionGroupId={currentQuestionGroupId}
                        setCurrentQuestionGroupId={setCurrentQuestionGroupId}
                        editable={true}
                    />
                    {currentQuestionGroupId && <QuestionGroup groupId={currentQuestionGroupId} />}
                </div>
            </div>
        </div>
    )
}

export default SurveyPage
