import React, { useState } from 'react'
import { Input } from 'rsuite'
import QuestionRating from '../../../QuestionRating/QuestionRating'
import surveyStoreHelper from '../../../../core/helpers/surveyStoreHelper'
import { QuestionWithRating as QuestionWithRatingType } from '../../../../core/types/Surveys'
import useSurveyStore from '../../../../core/stores/surveyStore'

import styles from './QuestionWithRating.css'

interface QuestionWithRatingProps {
    questionId: string
}

const QuestionWithRating: React.FC<QuestionWithRatingProps> = ({ questionId }) => {
    const { questions } = useSurveyStore()

    const [question, _] = useState<QuestionWithRatingType>(questions[questionId] as QuestionWithRatingType)

    const handleLeftBorderValueChange = (value: string) => {
        surveyStoreHelper.changeQuestionWithRatingLeftBorder(value, questionId)
    }

    const handleRightBorderValueChange = (value: string) => {
        surveyStoreHelper.changeQuestionWithRatingRightBorder(value, questionId)
    }

    const handleMaxRatingValueChange = (value: number) => {
        surveyStoreHelper.changeQuestionWithRatingMaxValue(value, questionId)
    }

    return (
        <div className={styles.container}>
            <div className={styles.borderInputs}>
                <Input placeholder="Левая граница" defaultValue={question?.leftBorder} onChange={handleLeftBorderValueChange} />
                <Input
                    placeholder="Правая граница"
                    defaultValue={question?.rightBorder}
                    onChange={handleRightBorderValueChange}
                />
            </div>
            <QuestionRating maxValue={10} defaultValue={question?.maxValue || 5} setValue={handleMaxRatingValueChange} />
        </div>
    )
}

export default QuestionWithRating
