import React, { useEffect, useState } from 'react'
import { Question } from '../../../core/types/Surveys'
import resultStoreHelper from '../../../core/helpers/resultStoreHelper'
import { DatePicker } from 'rsuite'
import useResultsStore from '../../../core/stores/resultsStore'

interface DateQuizQuestionProps {
    question: Question
}

const DateQuizQuestion: React.FC<DateQuizQuestionProps> = ({ question }) => {
    const [answerValue, setAnswerValue] = useState<Date>()

    const { resultData } = useResultsStore()

    useEffect(() => {
        const currentAnswer = resultData.answers.find((answer) => answer.questionId === question.id)
        if (currentAnswer) {
            setAnswerValue(new Date(Number(currentAnswer.answer)))
        }
    }, [])

    return (
        <DatePicker
            defaultValue={null}
            isoWeek={true}
            format="dd.MM.yyyy"
            placeholder="дд.мм.гггг"
            value={answerValue}
            onChange={(value) => {
                if (value) {
                    setAnswerValue(value)
                    resultStoreHelper.changeAnswerValue(value.getTime().toString(), question.id)
                }
            }}
            menuClassName="custom-picker"
        />
    )
}

export default DateQuizQuestion
