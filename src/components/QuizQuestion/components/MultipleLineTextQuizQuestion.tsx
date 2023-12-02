import React, { useEffect, useState } from 'react'
import { Question } from '../../../core/types/Surveys'
import resultStoreHelper from '../../../core/helpers/resultStoreHelper'
import { Input } from 'rsuite'
import useResultsStore from '../../../core/stores/resultsStore'

interface MultipleLineTextQuizQuestionProps {
    question: Question
}

const MultipleLineTextQuizQuestion: React.FC<MultipleLineTextQuizQuestionProps> = ({ question }) => {
    const [answerValue, setAnswerValue] = useState<string>('')

    const { resultData } = useResultsStore()

    useEffect(() => {
        const currentAnswer = resultData.answers.find((answer) => answer.questionId === question.id)
        if (currentAnswer) {
            setAnswerValue(currentAnswer.answer)
        }
    }, [])

    return (
        <Input
            as="textarea"
            rows={3}
            value={answerValue}
            onChange={(value) => {
                setAnswerValue(value)
                resultStoreHelper.changeAnswerValue(value, question.id)
            }}
        />
    )
}

export default MultipleLineTextQuizQuestion
