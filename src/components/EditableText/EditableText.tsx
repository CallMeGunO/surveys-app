import React, { useState } from 'react'
import { Button, ButtonGroup, Input } from 'rsuite'
import { EditIcon, DeleteIcon } from '@fluentui/react-icons-mdl2'

import styles from './EditableText.css'
import './EditableTextStaticStyles.css'

interface EditableTextProps {
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>> | ((value: string) => void)
    handleDelete: () => void
}

const EditableText: React.FC<EditableTextProps> = ({ value, setValue, handleDelete }) => {
    const [isTextEdit, setIsTextEdit] = useState<boolean>(false)

    return (
        <div className={styles.container}>
            <div
                className={styles.text}
                onClick={() => {
                    setIsTextEdit(true)
                }}
            >
                <Input
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue)
                    }}
                    plaintext={!isTextEdit}
                    autoFocus={true}
                    classPrefix="editable-text"
                    onBlur={() => {
                        setIsTextEdit(false)
                    }}
                />
            </div>
            <div className={styles.buttons}>
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            setIsTextEdit(true)
                        }}
                        appearance="subtle"
                    >
                        <EditIcon />
                    </Button>
                    <Button onClick={handleDelete} appearance="subtle">
                        <DeleteIcon />
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    )
}

export default EditableText
