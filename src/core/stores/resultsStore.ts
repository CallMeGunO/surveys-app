import { create } from 'zustand'
import { ResultData } from '../types/Result'
import { devtools } from 'zustand/middleware'

const initialData: ResultsStoreValues = {
    id: '',
    surveyId: '',
    resultData: {
        isFinished: false,
        answers: [],
    },
}

interface ResultsStoreValues {
    id: string
    surveyId: string
    resultData: ResultData
}

interface ResultsStoreActions {
    setResultData: (resultData: ResultData) => void
    setStore: (storeData: ResultsStoreValues) => void
}

const useResultsStore = create<ResultsStoreValues & ResultsStoreActions>()(
    devtools((set) => ({
        ...initialData,

        setResultData: (resultData: ResultData) =>
            set(() => ({
                resultData: resultData,
            })),

        setStore: (storeData: ResultsStoreValues) =>
            set(() => ({
                id: storeData.id,
                surveyId: storeData.surveyId,
                resultData: storeData.resultData,
            })),
    }))
)

export default useResultsStore
