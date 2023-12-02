import React, { useEffect, useState } from 'react'
import { QuestionGroup } from '../../core/types/Surveys'
import { Input } from 'rsuite'
import { EditIcon, CancelIcon } from '@fluentui/react-icons-mdl2'
import surveyStoreHelper from '../../core/helpers/surveyStoreHelper'

interface QuestionGroupPickerItemProps {
    questionGroup: QuestionGroup
    isGroupActive: boolean
    editable?: boolean
}

const QuestionGroupPickerItem: React.FC<QuestionGroupPickerItemProps> = ({ questionGroup, isGroupActive, editable = false }) => {
    const [groupTitle, setGroupTitle] = useState<string>('')
    const [isGroupTitleEdit, setIsGroupTitleEdit] = useState<boolean>(false)

    useEffect(() => {
        setGroupTitle(questionGroup.title)
    }, [])

    const handleTitleChange = (value: string) => {
        setGroupTitle(value)
        surveyStoreHelper.changeGroupTitle(value, questionGroup.id)
    }

    const handleDeleteQuestionGroup = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        surveyStoreHelper.deleteQuestionGroup(questionGroup.id)
    }

    return (
        <>
            {isGroupActive ? (
                <div onClick={() => setIsGroupTitleEdit(true)}>
                    <Input
                        placeholder="Название группы"
                        value={groupTitle}
                        plaintext={!(editable && isGroupTitleEdit)}
                        autoFocus={true}
                        onChange={handleTitleChange}
                        onBlur={() => setIsGroupTitleEdit(false)}
                    />
                    {editable && !isGroupTitleEdit && <EditIcon />}
                    {editable && <CancelIcon onClick={handleDeleteQuestionGroup} />}
                </div>
            ) : (
                questionGroup.title
            )}
        </>
    )
}

export default QuestionGroupPickerItem
