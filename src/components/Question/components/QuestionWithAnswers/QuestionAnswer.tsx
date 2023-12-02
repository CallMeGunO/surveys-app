import React, { useState } from 'react'
import EditableText from '../../../EditableText/EditableText'

interface QuestionAnswerProps {
    value: string
    onChange: (value: string) => void
    onDelete: () => void
}

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({ value = '', onChange, onDelete }) => {
    const [answerTitle, setAnswerTitle] = useState<string>(value)

    const handleChangeAnswerTitle = (newTitle: string) => {
        setAnswerTitle(newTitle)
        onChange(newTitle)
    }

    return (
        <div>
            <EditableText value={answerTitle} setValue={handleChangeAnswerTitle} handleDelete={onDelete} />
        </div>
    )
}

export default QuestionAnswer
