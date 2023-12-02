import { create } from 'zustand'
import { Auditory, Question, QuestionGroup, SurveyStatus } from '../types/Surveys'

const initialData: SurveysStoreValues = {
    id: '',
    title: '',
    description: '',
    userId: '',
    imageUrl: '',

    created: new Date().getTime(),
    modified: new Date().getTime(),

    questionGroups: [],
    questions: {},

    auditories: [],
    status: SurveyStatus.Draft,
}

interface SurveysStoreValues {
    id: string,
    title: string,
    description: string,
    userId: string,
    imageUrl: string,

    created: number,
    modified: number,

    questionGroups: QuestionGroup[],
    questions: Record<string, Question>,

    auditories: Auditory[]
    status: SurveyStatus,
}

interface SurveysStoreActions {
    setTitle: (title: string) => void,
    setDescription: (description: string) => void,
    setUserId: (userId: string) => void,
    setImageUrl: (imageUrl: string) => void,
    setModifiedDate: (modified: number) => void,

    setQuestionGroups:  (questionGroups: QuestionGroup[]) => void,

    setQuestions:  (questions: Record<string, Question>) => void,

    setAuditories: (auditoris: Auditory[]) => void, 

    setStatus: (status: SurveyStatus) => void,

    setStore: (storeData: SurveysStoreValues) => void,
}

const useSurveyStore = create<SurveysStoreValues & SurveysStoreActions>(((set) => ({
    ...initialData,

    setTitle: (title: string) => set(() => (
        {
            title: title
        }
    )),
    setDescription: (description: string) => set(() => (
        {
            description: description
        }
    )),
    setUserId: (userId: string) => set(() => (
        {
            userId: userId
        }
    )),
    setImageUrl: (imageUrl: string) => set(() => (
        {
            imageUrl: imageUrl
        }
    )),
    setModifiedDate: (modified: number) => set(() => (
        {
            modified: modified
        }
    )),

    setQuestionGroups: (questionGroups: QuestionGroup[]) => set(() => (
        {
            questionGroups: questionGroups
        }
    )),

    setQuestions: (questions: Record<string, Question>) => set(() => (
        {
            questions: questions
        }
    )),

    setAuditories: (auditories: Auditory[]) => set(() => (
        {
            auditories: auditories
        }
    )),

    setStatus: (status: SurveyStatus) => set(() => (
        {
            status: status
        }
    )),

    setStore: (storeData: SurveysStoreValues) => set(() => (
        {
            id: storeData.id,
            title: storeData.title,
            description: storeData.description,
            userId: storeData.userId,
            questionGroups: storeData.questionGroups,
            questions: storeData.questions,
            auditories: storeData.auditories,
            status: storeData.status,
            imageUrl: storeData.imageUrl
        }
    ))
})))

export default useSurveyStore