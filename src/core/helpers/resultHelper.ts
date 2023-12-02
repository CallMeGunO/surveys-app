import ResultsApi from '../api/resultsApi'
import { ApiResponse } from '../types/Common'
import { FirebaseResultData, Result } from '../types/Result'

class ResultHelper {
    parseRequestResultData(requestSurveyData: FirebaseResultData): Result {
        return {
            id: requestSurveyData.id,
            surveyId: requestSurveyData.SurveyId,
            data: JSON.parse(requestSurveyData.ResultData),
        }
    }

    async createResult(result: Result): Promise<ApiResponse<boolean>> {
        const response = await ResultsApi.createResult({
            id: result.surveyId,
            SurveyId: result.surveyId,
            ResultData: JSON.stringify(result.data),
            Created: new Date().getTime(),
            Modified: new Date().getTime(),
        })

        return response
    }

    async updateResult(result: Result): Promise<ApiResponse<boolean>> {
        const response = await ResultsApi.updateResult({
            id: result.surveyId,
            SurveyId: result.surveyId,
            ResultData: JSON.stringify(result.data),
            Created: new Date().getTime(),
            Modified: new Date().getTime(),
        })

        return response
    }
}

export default new ResultHelper()
