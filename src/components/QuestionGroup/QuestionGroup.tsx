import React, { useState } from 'react'
import useSurveyStore from '../../core/stores/surveyStore'
import Question from '../Question/Question'
import { QuestionType } from '../../core/types/Surveys'
import surveyStoreHelper from '../../core/helpers/surveyStoreHelper'
import { AddIcon } from '@fluentui/react-icons-mdl2'

import styles from './QuestionGroup.css'
import './QuestionGroupStaticStyles.css'

interface QuestionGroupProps {
    groupId: string
}

const QuestionGroup: React.FC<QuestionGroupProps> = ({ groupId }) => {
    const [selectedQuestionId, setSelectedQuestionId] = useState<string>('')
    const { questionGroups } = useSurveyStore()

    const mapQuestions = () => {
        const group = questionGroups.find((questionGroup) => questionGroup.id === groupId)
        return group?.questions.map((questionId, index) => {
            const handleQuestionClick = () => {
                setSelectedQuestionId(questionId)
            }
            return (
                <div onClick={handleQuestionClick} key={questionId}>
                    <Question
                        groupId={groupId}
                        questionId={questionId}
                        title={`Вопрос ${index + 1}`}
                        selectedQuestionId={selectedQuestionId}
                    />
                </div>
            )
        })
    }

    const handleAddQuestion = () => {
        surveyStoreHelper.addQuestion(
            {
                id: crypto.randomUUID(),
                title: '',
                type: QuestionType.SingleOption,
                isNecessarily: false,
                isFreeAnswer: false,
            },
            groupId
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.questions}>{mapQuestions()}</div>
            <div className={styles.addQuestionButton} onClick={handleAddQuestion}>
                <AddIcon /> Добавить вопрос
            </div>
        </div>
    )
}

export default QuestionGroup
