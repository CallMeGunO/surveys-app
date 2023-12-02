import React, { useState, useEffect, useRef } from 'react'
import useResultsStore from '../../../core/stores/resultsStore'
import resultStoreHelper from '../../../core/helpers/resultStoreHelper'
import { Uploader } from 'rsuite'
import { FileType } from 'rsuite/esm/Uploader'
import { Question } from '../../../core/types/Surveys'
import { AnswerWithFiles } from '../../../core/types/Result'
import { UploaderInstance } from 'rsuite/esm/Uploader/Uploader'

interface FileQuizQuestionProps {
    question: Question
}

const FileQuizQuestion: React.FC<FileQuizQuestionProps> = ({ question }) => {
    const [fileList, setFileList] = useState<FileType[]>([])

    const { resultData } = useResultsStore()

    const uploaderRef = useRef<UploaderInstance>()

    const updateValuesFromFileList = (fileList: FileType[]) => {
        const newValue = fileList.map((file) => file.fileKey).join(';')
        setFileList(fileList)
        resultStoreHelper.changeAnswerValue(newValue, question.id)
        resultStoreHelper.addFilesToResultFiles(fileList)
    }

    useEffect(() => {
        const currentAnswer = resultData.answers.find((answer) => answer.questionId === question.id) as AnswerWithFiles
        if (currentAnswer && currentAnswer?.files) {
            updateValuesFromFileList(currentAnswer?.files)
        }
    }, [])

    const handleSelectedFileChange = (fileList: FileType[]) => {
        updateValuesFromFileList(fileList)
    }

    return (
        <div>
            <Uploader
                action=""
                autoUpload={false}
                fileList={fileList}
                draggable
                onChange={handleSelectedFileChange}
                multiple={true}
                ref={uploaderRef}
            />
        </div>
    )
}

export default FileQuizQuestion
