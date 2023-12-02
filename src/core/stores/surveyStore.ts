import { create } from 'zustand'
import { Question, QuestionGroup, SurveyStatus } from '../types/Surveys'
import { devtools } from 'zustand/middleware'

const initialData: SurveysStoreValues = {
    id: '',
    title: '',
    description: '',

    created: new Date().getTime(),
    modified: new Date().getTime(),

    questionGroups: [],
    questions: {},

    status: SurveyStatus.Draft,
}

interface SurveysStoreValues {
    id: string
    title: string
    description: string

    created: number
    modified: number

    questionGroups: QuestionGroup[]
    questions: Record<string, Question>

    status: SurveyStatus
}

interface SurveysStoreActions {
    setTitle: (title: string) => void
    setDescription: (description: string) => void
    setModifiedDate: (modified: number) => void

    setQuestionGroups: (questionGroups: QuestionGroup[]) => void

    setQuestions: (questions: Record<string, Question>) => void

    setStatus: (status: SurveyStatus) => void

    setStore: (storeData: SurveysStoreValues) => void
}

const useSurveyStore = create<SurveysStoreValues & SurveysStoreActions>()(
    devtools((set) => ({
        ...initialData,

        setTitle: (title: string) =>
            set(() => ({
                title: title,
            })),
        setDescription: (description: string) =>
            set(() => ({
                description: description,
            })),
        setModifiedDate: (modified: number) =>
            set(() => ({
                modified: modified,
            })),

        setQuestionGroups: (questionGroups: QuestionGroup[]) =>
            set(() => ({
                questionGroups: questionGroups,
            })),

        setQuestions: (questions: Record<string, Question>) =>
            set(() => ({
                questions: questions,
            })),

        setStatus: (status: SurveyStatus) =>
            set(() => ({
                status: status,
            })),

        setStore: (storeData: SurveysStoreValues) =>
            set(() => ({
                id: storeData.id,
                title: storeData.title,
                description: storeData.description,
                questionGroups: storeData.questionGroups,
                questions: storeData.questions,
                status: storeData.status,
            })),
    }))
)

export default useSurveyStore
