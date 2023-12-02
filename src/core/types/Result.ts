import { LookupField } from "./Common"
import { RequestSurveyData } from "./Surveys"

interface PlatformResultData {
    id: string,
    Survey: LookupField<RequestSurveyData>[],
    ResultData: string,
    Created: number,
    Modified: number,
    User: LookupField<undefined>[]
}

type RequestResultData = LookupField<PlatformResultData> 

interface Answer {
    questionId: string,
    answer: string
}
 
interface ResultData {
    isFinished: boolean,
    answers: Answer[]
}

interface Result {
    id: string,
    surveyId: string,
    userDisplayName: string,
    data: ResultData,
}

export {
    RequestResultData,
    Answer,
    ResultData,
    Result
}