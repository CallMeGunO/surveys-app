import { FirebaseData } from './Common'

interface FirebaseResultData extends FirebaseData {
    SurveyId: string
    ResultData: string
    Created: number
    Modified: number
}

interface Answer {
    questionId: string
    answer: string
}

interface ResultData {
    isFinished: boolean
    answers: Answer[]
}

interface Result {
    id: string
    surveyId: string
    data: ResultData
}

export { FirebaseResultData, Answer, ResultData, Result }
