import React, { useCallback, useState } from 'react'
import surveyStoreHelper from '../../../../core/helpers/surveyStoreHelper'
import useSurveyStore from '../../../../core/stores/surveyStore'
import { AnswerVariant, QuestionWithAnswers as QuestionWithAnswersType } from '../../../../core/types/Surveys'
import PlusIcon from '@rsuite/icons/Plus'
import QuestionAnswer from './QuestionAnswer'
import { Checkbox, CheckboxGroup } from 'rsuite'

import styles from './QuestionWithAnswers.css'

interface QuestionWithAnswersProps {
    questionId: string
}

const QuestionWithAnswers: React.FC<QuestionWithAnswersProps> = ({ questionId }) => {
    const { questions } = useSurveyStore()

    const [question, setQuestion] = useState<QuestionWithAnswersType>(questions[questionId] as QuestionWithAnswersType)

    const handleAddAnswer = () => {
        surveyStoreHelper.addAnswerToQuestion({ id: crypto.randomUUID(), title: '' }, questionId)
        const newQuestion = structuredClone(questions[questionId]) as QuestionWithAnswersType
        setQuestion(newQuestion)
    }

    const handleChangeAnswerTitle = (newTitle: string, answerId: string) => {
        surveyStoreHelper.changeAnswerTitle(newTitle, answerId, questionId)
    }

    const handleDeleteAnswer = (answerId: string) => {
        surveyStoreHelper.deleteAnswerFromQuestion(answerId, questionId)
        const newQuestion = structuredClone(questions[questionId]) as QuestionWithAnswersType
        setQuestion(newQuestion)
    }

    const mapAnswers = useCallback(
        (answers: AnswerVariant[]) => {
            return answers?.map((answer) => {
                return (
                    <QuestionAnswer
                        key={answer.id}
                        value={answer.title}
                        onChange={(value: string) => {
                            handleChangeAnswerTitle(value, answer.id)
                        }}
                        onDelete={() => {
                            handleDeleteAnswer(answer.id)
                        }}
                    />
                )
            })
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [question]
    )

    return (
        <div>
            <div className={styles.container}>
                <div>Варианты ответа</div>
                <CheckboxGroup
                    onChange={(value) => {
                        const newIsFreeAnswer = value.includes('isFreeAnswer')
                        surveyStoreHelper.changeQuestionIsFreeAnswer(newIsFreeAnswer, questionId)
                    }}
                    defaultValue={questions[questionId].isFreeAnswer ? ['isFreeAnswer'] : undefined}
                >
                    <Checkbox value="isFreeAnswer">Свободный ответ</Checkbox>
                </CheckboxGroup>
            </div>
            {mapAnswers(question?.answerVariants)}
            <div onClick={handleAddAnswer} style={{ cursor: 'pointer' }}>
                <PlusIcon /> Добавить ответ
            </div>
        </div>
    )
}

export default QuestionWithAnswers
