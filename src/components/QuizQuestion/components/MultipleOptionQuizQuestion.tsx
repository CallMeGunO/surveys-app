import React, { useEffect, useState } from 'react'
import { QuestionWithAnswers } from '../../../core/types/Surveys'
import { Checkbox, CheckboxGroup, Input } from 'rsuite'
import resultStoreHelper from '../../../core/helpers/resultStoreHelper'
import useResultsStore from '../../../core/stores/resultsStore'

interface MultipleOptionQuizQuestionProps {
    question: QuestionWithAnswers
}

const MultipleOptionQuizQuestion: React.FC<MultipleOptionQuizQuestionProps> = ({ question }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
    const [freeAnswerValue, setFreeAnswerValue] = useState<string>('')

    const { resultData } = useResultsStore()

    useEffect(() => {
        const currentAnswer = resultData.answers.find((answer) => answer.questionId === question.id)
        if (currentAnswer) {
            const answers = currentAnswer.answer.split(';').filter((answer) => answer !== '')
            setSelectedAnswers(answers)
            const answerVariantsIds = question?.answerVariants?.map((answerVariant) => answerVariant.id)
            const freeAnswer = answers.find((answer) => !answerVariantsIds?.includes(answer))
            if (freeAnswer) setFreeAnswerValue(freeAnswer)
        }
    }, [])

    const mapOptions = () => {
        return question?.answerVariants?.map((answer) => {
            return (
                <Checkbox key={answer.id} value={answer.id}>
                    {answer.title}
                </Checkbox>
            )
        })
    }

    return (
        <CheckboxGroup
            name={question.id}
            value={selectedAnswers}
            onChange={(value) => {
                setSelectedAnswers(value as string[])
                resultStoreHelper.changeAnswerValue(value.join(';'), question.id)
            }}
        >
            {mapOptions()}
            {question.isFreeAnswer && (
                <Checkbox value={freeAnswerValue}>
                    <div style={{ marginTop: '-10px' }}>
                        <Input placeholder="Свой вариант" value={freeAnswerValue} onChange={setFreeAnswerValue} />
                    </div>
                </Checkbox>
            )}
        </CheckboxGroup>
    )
}

export default MultipleOptionQuizQuestion
