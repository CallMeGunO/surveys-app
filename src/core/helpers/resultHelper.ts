import ResultsApi from "../api/resultsApi"
import { ApiResponse } from "../types/Common"
import { RequestResultData, Result } from "../types/Result"
import messageHelper from "./messageHelper"

class ResultHelper {
    parseRequestResultData(requestSurveyData: RequestResultData): Result {
        return {
            id: requestSurveyData.id,
            surveyId: requestSurveyData.data.Survey[0].id,
            data: JSON.parse(requestSurveyData.data.ResultData),
            userDisplayName: requestSurveyData.data.User[0].displayName || ''
        }
    }

    async createResult(
        result: Result,
        userId: string
    ): Promise<ApiResponse<RequestResultData>> {
        const response = await ResultsApi.createResult({
            data: {
                strTitle: result.surveyId,
                Survey: [
                    {
                        id: result.surveyId,
                    },
                ],
                ResultData: JSON.stringify(result.data),
                Created: new Date().getTime(),
                Modified: new Date().getTime(),
                User: [
                    {
                        id: userId,
                        type: 'USER',
                    },
                ],
            },
        })

        return response
    }

    async updateResult(
        result: Result, 
        userId: string, 
        serviceData?: object
    ): Promise<ApiResponse<RequestResultData>> {
        let checkedServiceData = serviceData
        
        if (!serviceData) {
            const resultDataResponse = await ResultsApi.getResultById(result.id)
            if (!resultDataResponse.success) {
                messageHelper.pushMessage(resultDataResponse.error, 'error')
                return resultDataResponse
            }
            checkedServiceData = resultDataResponse.data.serviceData
        }

        const response = await ResultsApi.updateResult({
            id: result.id,
            serviceData: checkedServiceData,
            data: {
                id: result.id,
                strTitle: result.surveyId,
                Survey: [
                    {
                        id: result.surveyId,
                    },
                ],
                ResultData: JSON.stringify(result.data),
                Created: new Date().getTime(),
                Modified: new Date().getTime(),
                User: [
                    {
                        id: userId,
                        type: 'USER',
                    },
                ],
            },
        })

        return response
    }
}

export default new ResultHelper()