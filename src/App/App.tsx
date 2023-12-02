import React, { useContext, useEffect } from 'react'
import SurveysPage from '../pages/SurveysPage/SurveysPage'
import FirebaseContext from '../core/contexts/FirebaseContext'
import { getFirestore } from 'firebase/firestore/lite'
import useDb from '../core/stores/dbStore'
import useAppRouteStore, { AppRoute } from '../core/stores/appRouteStore'
import SurveyPage from '../pages/SurveyPage/SurveyPage'
import QuizPage from '../pages/QuizPage/QuizPage'
import ru_RU from 'rsuite/locales/ru_RU'
import { CustomProvider } from 'rsuite'

import styles from './App.css'

const App: React.FC = () => {
    const { app } = useContext(FirebaseContext)
    const { db, setDb } = useDb()
    const { appRoute } = useAppRouteStore()

    useEffect(() => {
        const db = getFirestore(app)
        setDb(db)
    }, [])

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

    return <CustomProvider locale={russianLocale}>{db && getViewByRoute(appRoute)}</CustomProvider>
}

export default App
