import React, { useEffect, useState } from 'react'
import { Question } from '../../../core/types/Surveys'
import resultStoreHelper from '../../../core/helpers/resultStoreHelper'
import { InputNumber } from 'rsuite'
import useResultsStore from '../../../core/stores/resultsStore'

interface NumberQuizQuestionProps {
    question: Question
}

const NumberQuizQuestion: React.FC<NumberQuizQuestionProps> = ({ question }) => {
    const [answerValue, setAnswerValue] = useState<number>(0)

    const { resultData } = useResultsStore()

    useEffect(() => {
        const currentAnswer = resultData.answers.find((answer) => answer.questionId === question.id)
        if (currentAnswer) {
            setAnswerValue(Number(currentAnswer.answer))
        }
    }, [])

    return (
        <InputNumber
            defaultValue={undefined}
            value={answerValue}
            onChange={(value) => {
                setAnswerValue(value as number)
                resultStoreHelper.changeAnswerValue(value.toString(), question.id)
            }}
        />
    )
}

export default NumberQuizQuestion
