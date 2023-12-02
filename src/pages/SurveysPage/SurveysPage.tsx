import React, { useEffect, useState } from 'react'
import { Survey, SurveyStatus } from '../../core/types/Surveys'
import useAppRouteStore, { AppRoute } from '../../core/stores/appRouteStore'
import { Result } from '../../core/types/Result'
import SurveysApi from '../../core/api/surveysApi'
import messageHelper from '../../core/helpers/messageHelper'
import surveyHelper from '../../core/helpers/surveyHelper'
import ResultsApi from '../../core/api/resultsApi'
import resultHelper from '../../core/helpers/resultHelper'
import PageHeader from '../../components/PageHeader/PageHeader'
import ButtonWithIcon from '../../components/ButtonWithIcon/ButtonWithIcon'
import SurveyCard from '../../components/SurveyCard/SurveyCard'
import { AcceptIcon, AddIcon, BulletedListIcon, SaveIcon, TrackersIcon } from '@fluentui/react-icons-mdl2'

import styles from './SurveysPage.css'

interface AllSurveys {
    draft: Survey[]
    active: Survey[]
    archive: Survey[]
}

enum PageFilter {
    All = 'ALL',
    Draft = 'DRAFT',
    Active = 'ACTIVE',
    Archive = 'ARCHIVE',
}

const SurveysPage: React.FC = () => {
    const { setRoute } = useAppRouteStore()
    const [surveys, setSurveys] = useState<AllSurveys>({
        draft: [],
        active: [],
        archive: [],
    })
    const [currentFilter, setCurrentFilter] = useState<PageFilter>(PageFilter.All)
    const [allResults, setAllResults] = useState<Result[]>([])

    const updateSurveys = async () => {
        const surveyDataResponse = await SurveysApi.getSurveys()
        if (!surveyDataResponse.success) {
            messageHelper.pushMessage(surveyDataResponse.error, 'error')
            return
        }

        const newSurveys: AllSurveys = {
            draft: [],
            active: [],
            archive: [],
        }

        surveyDataResponse.data.forEach((requestSurvey) => {
            const survey = surveyHelper.parseRequestSurveyData(requestSurvey)

            switch (survey.data.settings.status) {
                case SurveyStatus.Draft:
                    newSurveys.draft.push(survey)
                    break
                case SurveyStatus.Active:
                    newSurveys.active.push(survey)
                    break
                case SurveyStatus.Archive:
                    newSurveys.archive.push(survey)
                    break
            }
        })

        setSurveys(newSurveys)

        const resultDataResponse = await ResultsApi.getResults()
        if (!resultDataResponse.success) {
            messageHelper.pushMessage(resultDataResponse.error, 'error')
            return
        }

        setAllResults(resultDataResponse.data.map((requestResultData) => resultHelper.parseRequestResultData(requestResultData)))
    }

    useEffect(() => {
        updateSurveys()
    }, [])

    const mapSurveys = (surveys: Survey[]) => {
        return surveys.map((survey) => {
            const resultsAmount = allResults.filter((result) => result.surveyId === survey.id && result.data.isFinished).length
            const isStopped = surveyHelper.checkIsStopped(survey, allResults)
            return (
                <SurveyCard
                    key={survey.id}
                    survey={survey}
                    isStopped={isStopped}
                    updateSurveys={updateSurveys}
                    resultsAmount={resultsAmount}
                />
            )
        })
    }

    return (
        <div className={styles.container}>
            <PageHeader>
                <ButtonWithIcon icon={<BulletedListIcon />} onClick={() => setCurrentFilter(PageFilter.All)}>
                    Все
                </ButtonWithIcon>
                <ButtonWithIcon icon={<TrackersIcon />} onClick={() => setCurrentFilter(PageFilter.Draft)}>
                    Черновики
                </ButtonWithIcon>
                <ButtonWithIcon icon={<AcceptIcon />} onClick={() => setCurrentFilter(PageFilter.Active)}>
                    Опубликованные
                </ButtonWithIcon>
                <ButtonWithIcon icon={<SaveIcon />} onClick={() => setCurrentFilter(PageFilter.Archive)}>
                    Архивные
                </ButtonWithIcon>
            </PageHeader>
            {(currentFilter === PageFilter.All || currentFilter === PageFilter.Draft) && (
                <div className={styles.surveyGroup}>
                    <div className={styles.subTitle}>
                        Черновики<span>{surveys.draft.length}</span>
                    </div>
                    <div className={styles.surveysContainer}>
                        <div
                            className={styles.newSurveyCard}
                            onClick={() => {
                                setRoute(AppRoute.New)
                            }}
                        >
                            <span className={styles.newSurveyCardIcon}>
                                <AddIcon />
                            </span>
                            <span className={styles.newSurveyCardText}>Создать опрос</span>
                        </div>
                        {mapSurveys(surveys.draft)}
                    </div>
                </div>
            )}
            {surveys.active.length > 0 && (currentFilter === PageFilter.All || currentFilter === PageFilter.Active) && (
                <div className={styles.surveyGroup}>
                    <div className={styles.subTitle}>
                        Опубликованные<span>{surveys.active.length}</span>
                    </div>
                    <div className={styles.surveysContainer}>{mapSurveys(surveys.active)}</div>
                </div>
            )}
            {surveys.archive.length > 0 && (currentFilter === PageFilter.All || currentFilter === PageFilter.Archive) && (
                <div className={styles.surveyGroup}>
                    <div className={styles.subTitle}>
                        Архивные<span>{surveys.archive.length}</span>
                    </div>
                    <div className={styles.surveysContainer}>{mapSurveys(surveys.archive)}</div>
                </div>
            )}
        </div>
    )
}

export default SurveysPage
