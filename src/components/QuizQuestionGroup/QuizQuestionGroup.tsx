import React from 'react'
import useSurveyStore from '../../core/stores/surveyStore'
import QuizQuestion from '../QuizQuestion/QuizQuestion'
import { Button, Whisper } from 'rsuite'

import styles from './QuizQuestionGroup.css'

interface QuizQuestionGroupProps {
    groupId: string
    exitButtonPopover: React.ReactElement
    handleExit: () => void
    handleFinishSurvey: () => void
    isDraft: boolean
}

const QuizQuestionGroup: React.FC<QuizQuestionGroupProps> = ({
    groupId,
    exitButtonPopover,
    handleFinishSurvey,
    handleExit,
    isDraft,
}) => {
    const { questionGroups, questions } = useSurveyStore()

    const mapQuestions = () => {
        const group = questionGroups.find((questionGroup) => questionGroup.id === groupId)
        return group?.questions.map((questionId) => {
            return (
                <div key={questionId}>
                    <QuizQuestion question={questions[questionId]} />
                </div>
            )
        })
    }

    return (
        <div className={styles.container}>
            {mapQuestions()}
            <div className={styles.finishButton}>
                {isDraft ? (
                    <>
                        <Button appearance="primary" onClick={handleExit}>
                            Завершить опрос
                        </Button>
                        <Button onClick={handleExit} appearance="primary" color="blue">
                            Выйти
                        </Button>
                    </>
                ) : (
                    <>
                        <Button appearance="primary" onClick={handleFinishSurvey}>
                            Завершить опрос
                        </Button>
                        <Whisper placement="auto" trigger="click" speaker={exitButtonPopover}>
                            <Button appearance="primary" color="blue">
                                Выйти
                            </Button>
                        </Whisper>
                    </>
                )}
            </div>
        </div>
    )
}

export default QuizQuestionGroup
