import React from 'react'
import { Question, QuestionType, QuestionWithAnswers, QuestionWithRating } from '../../core/types/Surveys'
import SingleOptionQuizQuestion from './components/SingleOptionQuizQuestion'
import SingleLineTextQuizQuestion from './components/SingleLineTextQuizQuestion'
import MultipleOptionQuizQuestion from './components/MultipleOptionQuizQuestion'
import MultipleLineTextQuizQuestion from './components/MultipleLineTextQuizQuestion'
import NumberQuizQuestion from './components/NumberQuizQuestion'
import DateQuizQuestion from './components/DateQuizQuestion'
import { Popover, Whisper } from 'rsuite'
import RatingQuizQuestion from './components/RatingQuizQuestion'

import styles from './QuizQuestion.css'

interface QuizQuestionProps {
    question: Question
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question }) => {
    const NecessarilyFieldPopover = <Popover className="custom-popover">Обязательно поле</Popover>

    const getQuestionContent = () => {
        switch (question.type) {
            case QuestionType.SingleOption:
                return <SingleOptionQuizQuestion question={question as QuestionWithAnswers} />
            case QuestionType.SingleLineText:
                return <SingleLineTextQuizQuestion question={question} />
            case QuestionType.MultipleOptions:
                return <MultipleOptionQuizQuestion question={question as QuestionWithAnswers} />
            case QuestionType.MultipleLineText:
                return <MultipleLineTextQuizQuestion question={question} />
            case QuestionType.NumberValue:
                return <NumberQuizQuestion question={question} />
            case QuestionType.DateValue:
                return <DateQuizQuestion question={question} />
            case QuestionType.Rating:
                return <RatingQuizQuestion question={question as QuestionWithRating} />
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>
                {question.title}
                {question.isNecessarily && (
                    <Whisper placement="auto" trigger="hover" speaker={NecessarilyFieldPopover}>
                        <span className={styles.necessaryMark}>*</span>
                    </Whisper>
                )}
            </div>
            <div>{getQuestionContent()}</div>
        </div>
    )
}

export default QuizQuestion
