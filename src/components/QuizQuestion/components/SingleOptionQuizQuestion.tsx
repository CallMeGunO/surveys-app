import React, { useEffect, useState } from 'react'
import { QuestionWithAnswers } from '../../../core/types/Surveys'
import { Input, Radio, RadioGroup } from 'rsuite'
import resultStoreHelper from '../../../core/helpers/resultStoreHelper'
import useResultsStore from '../../../core/stores/resultsStore'

interface SingleOptionQuizQuestionProps {
    question: QuestionWithAnswers
}

const SingleOptionQuizQuestion: React.FC<SingleOptionQuizQuestionProps> = ({ question }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string>()
    const [freeAnswerValue, setFreeAnswerValue] = useState<string>('')

    const { resultData } = useResultsStore()

    useEffect(() => {
        const currentAnswer = resultData.answers.find((answer) => answer.questionId === question.id)
        if (currentAnswer) {
            setSelectedAnswer(currentAnswer.answer)
            if (!question?.answerVariants?.find((answerVariant) => answerVariant.id === currentAnswer.answer)) {
                setFreeAnswerValue(currentAnswer.answer)
            }
        }
    }, [])

    const mapOptions = () => {
        return question?.answerVariants?.map((answer) => {
            return (
                <Radio key={answer.id} value={answer.id}>
                    {answer.title}
                </Radio>
            )
        })
    }

    return (
        <RadioGroup
            name={question.id}
            value={selectedAnswer}
            onChange={(value) => {
                setSelectedAnswer(value as string)
                resultStoreHelper.changeAnswerValue(value as string, question.id)
            }}
        >
            {mapOptions()}
            {question.isFreeAnswer && (
                <Radio value={freeAnswerValue}>
                    <div style={{ marginTop: '-10px' }}>
                        <Input placeholder="Свой вариант" value={freeAnswerValue} onChange={setFreeAnswerValue} />
                    </div>
                </Radio>
            )}
        </RadioGroup>
    )
}

export default SingleOptionQuizQuestion
