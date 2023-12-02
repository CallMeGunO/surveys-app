import React from 'react'
import useSurveyStore from '../../core/stores/surveyStore'
import surveyStoreHelper from '../../core/helpers/surveyStoreHelper'
import QuestionGroupPickerItem from './QuestionGroupPickerItem'
import { AddIcon } from '@fluentui/react-icons-mdl2'

import styles from './QuestionGroupPicker.css'

interface QuestionGroupPickerProps {
    currentQuestionGroupId: string | undefined
    setCurrentQuestionGroupId: React.Dispatch<React.SetStateAction<string | undefined>>
    editable?: boolean
    checkQuestionsFunction?: (callback: () => void) => void
}

const QuestionGroupPicker: React.FC<QuestionGroupPickerProps> = ({
    currentQuestionGroupId,
    setCurrentQuestionGroupId,
    editable = false,
    checkQuestionsFunction,
}) => {
    const { questionGroups } = useSurveyStore()

    const mapQuestionGroups = () => {
        return questionGroups.map((questionGroup) => {
            const handleChangeQuestionGroup = () => {
                if (checkQuestionsFunction) {
                    checkQuestionsFunction(() => setCurrentQuestionGroupId(questionGroup.id))
                } else {
                    setCurrentQuestionGroupId(questionGroup.id)
                }
            }
            const isGroupActive = questionGroup.id === currentQuestionGroupId
            return (
                <div
                    className={`${styles.itemContainer} ${isGroupActive ? styles.active : ''}`}
                    key={questionGroup.id}
                    onClick={handleChangeQuestionGroup}
                >
                    <QuestionGroupPickerItem questionGroup={questionGroup} isGroupActive={isGroupActive} editable={editable} />
                </div>
            )
        })
    }

    const handleAddGroup = () => {
        surveyStoreHelper.addQuestionGroup({
            id: crypto.randomUUID(),
            title: 'Название группы',
            questions: [],
        })
    }

    return (
        <div className={styles.container}>
            {mapQuestionGroups()}
            {editable && (
                <div onClick={handleAddGroup} className={styles.addGroup}>
                    <AddIcon /> Добавить группу
                </div>
            )}
        </div>
    )
}

export default QuestionGroupPicker
