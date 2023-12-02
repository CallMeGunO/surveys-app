import { create } from 'zustand'

export enum AppRoute {
    Main = 'MAIN_ROUTE',
    New = 'NEW_ROUTE',
    Edit = 'EDIT_ROUTE',
    Quiz = 'QUIZ_ROUTE'
}

const initialData: AppRouteStoreValues = {
    appRoute: AppRoute.Main,
    surveyId: ''
}

interface AppRouteStoreValues {
    appRoute: AppRoute,
    surveyId: string,
}

interface AppRouteStoreActions {
    setRoute: (route: AppRoute) => void
    setSurveyId: (surveyId: string) => void
}

const useAppRouteStore = create<AppRouteStoreValues & AppRouteStoreActions>(((set) => ({
    ...initialData,
    setRoute: (appRoute: AppRoute) => set(() => (
        {
            appRoute: appRoute
        }
    )),
    setSurveyId: (surveyId: string) => set(() => (
        {
            surveyId: surveyId
        }
    )) 
})))

export default useAppRouteStore