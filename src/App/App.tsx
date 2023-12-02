import React, { useEffect, useState } from 'react'
import SurveysPage from '../pages/SurveysPage/SurveysPage'
import SurveyPage from '../pages/SurveyPage/SurveyPage'
import QuizPage from '../pages/QuizPage/QuizPage'
import PlatformApi from '../core/api/platformApi'
import useIdStore from '../core/stores/idStore'
import useAppRouteStore, { AppRoute } from '../core/stores/appRouteStore'
import ru_RU from 'rsuite/locales/ru_RU'
import { CustomProvider } from 'rsuite'
import useUserStore from '../core/stores/userStore'
import UsersApi from '../core/api/usersApi'
import { UserRole } from '../core/types/User'
import messageHelper from '../core/helpers/messageHelper'
import { initializeApp } from 'firebase/app'

import styles from './App.css'

const App: React.FC = () => {
    // const { setSurveysListId, setAnswersListId } = useIdStore()
    // const { setUserData, setUserRole } = useUserStore()
    const { appRoute } = useAppRouteStore()
    // const [isIdFetched, setIsIdFetched] = useState<boolean>(false)

    // useEffect(() => {
    // const fetchIds = async () => {
    //     let response = await PlatformApi.getListInfoByName(process.env.SURVEYS_LIST || '')
    //     if (!response.success) {
    //         messageHelper.pushMessage(response.error, 'error')
    //         return
    //     }
    //     setSurveysListId(response.data[0].id)
    //     response = await PlatformApi.getListInfoByName(process.env.SURVEY_RESULTS_LIST || '')
    //     if (!response.success) {
    //         messageHelper.pushMessage(response.error, 'error')
    //         return
    //     }
    //     setAnswersListId(response.data[0].id)
    //     setIsIdFetched(true)
    // }

    // const fetchUser = async () => {
    //     const currentUserResponse = await UsersApi.getCurrentUser()
    //     if (!currentUserResponse.success) {
    //         messageHelper.pushMessage(currentUserResponse.error, 'error')
    //         return
    //     }
    //     setUserData(currentUserResponse.data)
    //     if (currentUserResponse.data.groups.find((group) => group.displayName === 'Администратор_Опросов')) {
    //         setUserRole(UserRole.SurveysAdmin)
    //     }
    // }

    //     fetchIds()
    //     fetchUser()
    // }, [])

    const getViewByRoute = (appRoute: AppRoute): React.ReactNode => {
        switch (appRoute) {
            case AppRoute.Main:
                return <SurveysPage />
            case AppRoute.New:
                return <SurveyPage />
            case AppRoute.Edit:
                return <SurveyPage />
            case AppRoute.Quiz:
                return <QuizPage />
        }
    }

    const russianLocale = {
        ...ru_RU,
        Plaintext: {
            unfilled: 'Введите текст',
            notSelected: 'Не выбрано',
            notUploaded: 'Не загружено',
        },
    }

    return (
        <div className={styles.app}>
            <CustomProvider locale={russianLocale}>{isIdFetched && getViewByRoute(appRoute)}</CustomProvider>
        </div>
    )
}

export default App
