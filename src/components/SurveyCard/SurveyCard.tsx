import React from 'react'
import { Survey, SurveyStatus } from '../../core/types/Surveys'
import useAppRouteStore, { AppRoute } from '../../core/stores/appRouteStore'
import messageHelper from '../../core/helpers/messageHelper'
import {
    ContactIcon,
    InstallationIcon,
    EditIcon,
    DeleteIcon,
    RevToggleKeyIcon,
    MoveToFolderIcon,
    AcceptIcon,
} from '@fluentui/react-icons-mdl2'
import SurveysApi from '../../core/api/surveysApi'
import surveyHelper from '../../core/helpers/surveyHelper'
import { Button, Popover, Whisper } from 'rsuite'
import defaultImage from '../../assets/placeholder-image.jpg'
import excelHelper from '../../core/helpers/excelHelper'

import styles from './SurveyCard.css'

interface SurveyCardProps {
    survey: Survey
    updateSurveys: () => void
    isStopped: boolean
    resultsAmount?: number
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey, updateSurveys, isStopped, resultsAmount = 0 }) => {
    const { setRoute, setSurveyId } = useAppRouteStore()

    const takeSurveyHandler = () => {
        setSurveyId(survey.id)
        setRoute(AppRoute.Quiz)
    }

    const editSurveyHandler = () => {
        setSurveyId(survey.id)
        setRoute(AppRoute.Edit)
    }

    const exportSurveyHandler = () => {
        excelHelper.exportSurveyResults(survey.id).then((success) => {
            if (success) {
                messageHelper.pushMessage('Файл экспортирован', 'success')
            } else {
                messageHelper.pushMessage('Ошибка при экспорте в excel', 'error')
            }
        })
    }

    const deleteSurveyHandler = () => {
        SurveysApi.deleteSurvey(survey.id).then((success) => {
            if (success) {
                messageHelper.pushMessage('Опрос удален', 'success')
                updateSurveys()
            } else {
                messageHelper.pushMessage('Ошибка при удалении опроса', 'error')
            }
        })
    }

    const moveSurveyBackToDraftHandler = () => {
        surveyHelper.updateSurvey(survey, SurveyStatus.Draft).then((response) => {
            if (response.success) {
                messageHelper.pushMessage('Опрос перемещен в черновики', 'success')
                updateSurveys()
            } else {
                messageHelper.pushMessage(response.error, 'error')
            }
        })
    }

    const moveSurveyBackToDraftWithDeleteResultsHandler = () => {
        const deleteResultsAnswers = surveyHelper.deleteSurveyResults(survey.id)
        if (!deleteResultsAnswers) {
            messageHelper.pushMessage('Ошибка при удалении результатов опроса', 'error')
        }
        surveyHelper.updateSurvey(survey, SurveyStatus.Draft).then((response) => {
            if (response.success) {
                messageHelper.pushMessage('Опрос перемещен в черновики', 'success')
                updateSurveys()
            } else {
                messageHelper.pushMessage(response.error, 'error')
            }
        })
    }

    const publishSurveyHandler = () => {
        surveyHelper.updateSurvey(survey, SurveyStatus.Active).then((response) => {
            if (response.success) {
                messageHelper.pushMessage('Опрос опубликован', 'success')
                updateSurveys()
            } else {
                messageHelper.pushMessage(response.error, 'error')
            }
        })
    }

    const moveSurveyToArchiveHandler = () => {
        surveyHelper.updateSurvey(survey, SurveyStatus.Archive).then((response) => {
            if (response.success) {
                messageHelper.pushMessage('Опрос перемещен в архив', 'success')
                updateSurveys()
            } else {
                messageHelper.pushMessage(response.error, 'error')
            }
        })
    }

    const backToDraftsPopover = (
        <Popover title="Внимание" className="custom-popover">
            <div>Сбросить все результаты прохождения опроса?</div>
            <div className={styles.popoverButtons}>
                <Button onClick={moveSurveyBackToDraftWithDeleteResultsHandler} appearance="primary">
                    Да
                </Button>
                <Button onClick={moveSurveyBackToDraftHandler}>Нет</Button>
            </div>
        </Popover>
    )

    const getStatus = () => {
        switch (survey.data.settings.status) {
            case SurveyStatus.Draft:
                return (
                    <div className={`${styles.status} ${styles.draft}`} onClick={takeSurveyHandler}>
                        Пройти
                    </div>
                )
            case SurveyStatus.Active:
                return isStopped ? (
                    <div className={`${styles.status} ${styles.stopped}`} onClick={takeSurveyHandler}>
                        Остановлен
                    </div>
                ) : (
                    <div className={`${styles.status} ${styles.active}`} onClick={takeSurveyHandler}>
                        Пройти
                    </div>
                )
            case SurveyStatus.Archive:
                return <div></div>
        }
    }

    const getButtons = () => {
        switch (survey.data.settings.status) {
            case SurveyStatus.Draft:
                return (
                    <div className={styles.buttons}>
                        <AcceptIcon onClick={publishSurveyHandler} className={styles.button} title="Опубликовать" />
                        <EditIcon onClick={editSurveyHandler} className={styles.button} title="Редактировать" />
                        <DeleteIcon onClick={deleteSurveyHandler} className={styles.button} title="Удалить" />
                    </div>
                )
            case SurveyStatus.Active:
                return isStopped ? (
                    <div></div>
                ) : (
                    <div className={styles.buttons}>
                        <Whisper placement="top" trigger="click" speaker={backToDraftsPopover}>
                            <div>
                                <RevToggleKeyIcon className={styles.button} title="Вернуть в черновик" />
                            </div>
                        </Whisper>
                        <MoveToFolderIcon
                            onClick={moveSurveyToArchiveHandler}
                            className={styles.button}
                            title="Перенести в архив"
                        />
                        <InstallationIcon
                            onClick={exportSurveyHandler}
                            className={styles.button}
                            title="Выгрузить результаты в excel"
                        />
                    </div>
                )
            case SurveyStatus.Archive:
                return (
                    <div className={styles.buttons}>
                        <AcceptIcon onClick={publishSurveyHandler} className={styles.button} title="Опубликовать" />
                        <InstallationIcon
                            onClick={exportSurveyHandler}
                            className={styles.button}
                            title="Выгрузить результаты в excel"
                        />
                        <DeleteIcon onClick={deleteSurveyHandler} className={styles.button} title="Удалить" />
                    </div>
                )
        }
    }

    const parseNumberDateToString = (numberDate: number) => {
        const date = new Date(numberDate)
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    }

    const shortifyString = (initialString: string, availableLength: number) => {
        if (initialString.length > availableLength) return `${initialString.slice(0, availableLength)}...`
        return initialString
    }

    return (
        <div className={styles.container}>
            <img className={styles.image} src={defaultImage} />
            <div className={styles.info}>
                <span>{parseNumberDateToString(survey.created)}</span>
                {survey.data.settings.status !== SurveyStatus.Draft && (
                    <span>
                        <ContactIcon />
                        {resultsAmount}
                    </span>
                )}
            </div>
            <div className={styles.title}>{shortifyString(survey.title, 50)}</div>
            <div className={styles.actions}>
                {getStatus()}
                {getButtons()}
            </div>
        </div>
    )
}

export default SurveyCard
