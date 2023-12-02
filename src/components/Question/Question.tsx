import React, { useEffect, useState } from 'react'
import useSurveyStore from '../../core/stores/surveyStore'
import { QuestionType } from '../../core/types/Surveys'
import { Button, Checkbox, CheckboxGroup, Input, InputPicker } from 'rsuite'
import surveyStoreHelper from '../../core/helpers/surveyStoreHelper'
import QuestionWithAnswers from './components/QuestionWithAnswers/QuestionWithAnswers'
import QuestionWithRating from './components/QuestionWithRating/QuestionWithRating'
import { DeleteIcon } from '@fluentui/react-icons-mdl2'

import styles from './Question.css'

interface QuestionProps {
    groupId: string
    questionId: string
    title: string
    selectedQuestionId: string
}

const Question: React.FC<QuestionProps> = ({ groupId, questionId, title, selectedQuestionId }) => {
    const { questions } = useSurveyStore()
    const [questionTitle, setQuestionTitle] = useState<string>('')
    const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.SingleOption)

    useEffect(() => {
        if (questions[questionId]) {
            setQuestionTitle(questions[questionId].title)
            setQuestionType(questions[questionId].type)
        }
    }, [])

    const getQuestionTypeRu = (questionType: QuestionType): string => {
        switch (questionType) {
            case QuestionType.SingleOption:
                return 'Выбор одного варианта ответа'
            case QuestionType.MultipleOptions:
                return 'Выбор нескольких вариантов ответа'
            case QuestionType.SingleLineText:
                return 'Однострочный текст'
            case QuestionType.MultipleLineText:
                return 'Многострочный текст'
            case QuestionType.NumberValue:
                return 'Число'
            case QuestionType.DateValue:
                return 'Дата'
            case QuestionType.Rating:
                return 'Рейтинговая шкала'
        }
    }

    const questionTypeData = Object.values(QuestionType).map((questionType) => {
        return {
            value: questionType,
            label: getQuestionTypeRu(questionType),
        }
    })

    const getQuestionAnswers = () => {
        switch (questions[questionId].type) {
            case QuestionType.SingleOption:
            case QuestionType.MultipleOptions:
                return (
                    <div>
                        <QuestionWithAnswers questionId={questionId} key={questionId} />
                    </div>
                )
            case QuestionType.Rating:
                return (
                    <div>
                        <QuestionWithRating questionId={questionId} />
                    </div>
                )
        }
    }

    const handleDeleteQuestion = () => {
        surveyStoreHelper.deleteQuestion(groupId, questionId)
    }

    return (
        <div className={`${styles.container} ${selectedQuestionId === questionId ? styles.active : ''}`}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                <div className={styles.titleActions}>
                    <CheckboxGroup
                        onChange={(value) => {
                            const newNecessarity = value.includes('necessarily')
                            surveyStoreHelper.changeQuestionNecessarity(newNecessarity, questionId)
                        }}
                        defaultValue={questions[questionId].isNecessarily ? ['necessarily'] : undefined}
                    >
                        <Checkbox value="necessarily">Обязательный</Checkbox>
                    </CheckboxGroup>
                    <Button appearance="subtle" onClick={handleDeleteQuestion}>
                        <DeleteIcon />
                    </Button>
                </div>
            </div>
            <div className={styles.content}>
                <div>
                    <span>Текст вопроса</span>
                    <Input
                        placeholder=""
                        value={questionTitle}
                        onChange={(newValue) => {
                            setQuestionTitle(newValue)
                            surveyStoreHelper.changeQuestionTitle(newValue, questionId)
                        }}
                        as="textarea"
                        rows={3}
                    />
                </div>
                <div>
                    <span>Тип ответа</span>
                    <InputPicker
                        data={questionTypeData}
                        value={questionType}
                        onChange={(newValue) => {
                            setQuestionType(newValue)
                            surveyStoreHelper.changeQuestionType(newValue, questionId)
                        }}
                        menuClassName="custom-picker"
                        placeholder=""
                        className={styles.questionTypePicker}
                    />
                </div>
                {getQuestionAnswers()}
            </div>
        </div>
    )
}

export default Question
