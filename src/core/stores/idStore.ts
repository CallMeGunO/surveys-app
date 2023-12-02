import { create } from 'zustand'
// TODO: delete if not needed
const initialData: IdStoreValues = {
    surveysListId: "",
    answersListId: ""
}

interface IdStoreValues {
    surveysListId: string,
    answersListId: string,
}

interface IdStoreActions {
    setSurveysListId: (surveysListId: string) => void
    setAnswersListId: (answersListId: string) => void
}

const useIdStore = create<IdStoreValues & IdStoreActions>(((set) => ({
    ...initialData,
    setSurveysListId: (surveysListId: string) => set(() => (
        {
            surveysListId: surveysListId
        }
    )),
    setAnswersListId: (answersListId: string) => set(() => (
        {
            answersListId: answersListId
        }
    ))
})))

export default useIdStore