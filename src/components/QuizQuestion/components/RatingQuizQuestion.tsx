import React, { useEffect, useState } from 'react'
import { QuestionWithRating } from '../../../core/types/Surveys'
import resultStoreHelper from '../../../core/helpers/resultStoreHelper'
import useResultsStore from '../../../core/stores/resultsStore'
import QuestionRating from '../../QuestionRating/QuestionRating'

interface RatingQuizQuestionProps {
    question: QuestionWithRating
}

const RatingQuizQuestion: React.FC<RatingQuizQuestionProps> = ({ question }) => {
    const [answerValue, setAnswerValue] = useState<number>(1)

    const { resultData } = useResultsStore()

    useEffect(() => {
        const currentAnswer = resultData.answers.find((answer) => answer.questionId === question.id)
        if (currentAnswer) {
            const numberAnswer = Number(currentAnswer.answer.split(' из ').at(0))
            setAnswerValue(numberAnswer)
        }
    }, [])

    const handleQuestionRatingValueChange = (value: number) => {
        resultStoreHelper.changeAnswerValue(`${value} из ${question.maxValue}`, question.id)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
            <span style={{ whiteSpace: 'nowrap' }}>{question?.leftBorder}</span>
            <QuestionRating maxValue={question.maxValue} defaultValue={answerValue} setValue={handleQuestionRatingValueChange} />
            <span style={{ whiteSpace: 'nowrap' }}>{question?.rightBorder}</span>
        </div>
    )
}

export default RatingQuizQuestion
