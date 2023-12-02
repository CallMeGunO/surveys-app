import ResultsApi from "../api/resultsApi";
import SurveysApi from "../api/surveysApi";
import useUserStore from "../stores/userStore";
import { ApiResponse } from "../types/Common";
import { Result } from "../types/Result";
import { RequestSurveyData, Survey, SurveyStatus } from "../types/Surveys";
import messageHelper from "./messageHelper";
import resultHelper from "./resultHelper";

class SurveyHelper {
    parseRequestSurveyData(requestSurveyData: RequestSurveyData): Survey {
        return {
            id: requestSurveyData.id,
            title: requestSurveyData.data.Title,
            description: requestSurveyData.data.Description,
            data: JSON.parse(requestSurveyData.data.SurveyData),
            created: requestSurveyData.data.Created,
            modified: requestSurveyData.data.Modified,
            userId: requestSurveyData.data.User && requestSurveyData.data.User.length > 0 ? requestSurveyData.data.User[0].id : '',
            imageUrl: requestSurveyData.data.ImageUrl
        }
    }

    checkAccessToDraftSurvey(survey: Survey): boolean {
        const userData = useUserStore.getState().userData

        return userData.id === survey.userId
    }

    checkAccessToNonDraftSurvey(survey: Survey): boolean {
        if (survey.data.settings.auditories.length === 0) return true
 
        const userData = useUserStore.getState().userData

        let result = survey.data.settings.auditories.find((auditory) => auditory.id === userData.id)
        if (result) return true

        result = survey.data.settings.auditories.find((auditory) => auditory.id === userData.department.id)
        if (result) return true

        for (const roleGroup of userData.groups) {
            result = survey.data.settings.auditories.find((auditory) => auditory.id === roleGroup.id)
            if (result) return true   
        }

        return false
    }

    checkIsStoppedByCurrentUser(survey: Survey, allResults: Result[]): boolean {
        const userData = useUserStore.getState().userData
        
        const unfinishedResult = allResults
            .filter((result) => result.surveyId === survey.id)
            .find((result) => !result.data.isFinished)

        if (unfinishedResult && unfinishedResult.userDisplayName === userData.displayName) {
            return true
        }

        return false
    }

    async createSurvey(survey: Survey, status: SurveyStatus): Promise<ApiResponse<RequestSurveyData>> {
        const response = await SurveysApi.createSurvey({
            data: {
                Title: survey.title,
                Description: survey.description,
                ImageUrl: survey.imageUrl,
                SurveyData: JSON.stringify({
                    content: {
                        questionGroups: survey.data.content.questionGroups,
                        questions: survey.data.content.questions,
                    },
                    settings: {
                        routes: [],
                        status: status,
                        auditories: survey.data.settings.auditories,
                    },
                }),
                Created: survey.created,
                Modified: survey.modified,
                User: [
                    {
                        id: survey.userId,
                        type: 'USER',
                    },
                ],
            },
        })

        return response
    }

    async updateSurvey(survey: Survey, status: SurveyStatus, serviceData?: object): Promise<ApiResponse<RequestSurveyData>> {
        let checkedServiceData = serviceData
        
        if (!serviceData) {
            const surveyDataResponse = await SurveysApi.getSurveyById(survey.id)
            if (!surveyDataResponse.success) {
                messageHelper.pushMessage(surveyDataResponse.error, 'error')
                return surveyDataResponse
            }
            checkedServiceData = surveyDataResponse.data.serviceData
        }

        const response = await SurveysApi.updateSurvey({
            id: survey.id,
            serviceData: checkedServiceData,
            data: {
                id: survey.id,
                Title: survey.title,
                Description: survey.description,
                ImageUrl: survey.imageUrl,
                SurveyData: JSON.stringify({
                    content: {
                        questionGroups: survey.data.content.questionGroups,
                        questions: survey.data.content.questions,
                    },
                    settings: {
                        routes: [],
                        status: status,
                        auditories: survey.data.settings.auditories,
                    },
                }),
                Created: survey.created,
                Modified: survey.modified,
                User: [
                    {
                        id: survey.userId,
                        type: 'USER',
                    },
                ],
            },
        })

        return response
    }

    async deleteSurveyResults(surveyId: string): Promise<boolean> {
        let deleteResult = true
        const resultsResponse = await ResultsApi.getResults()
        if (!resultsResponse.success) {
            messageHelper.pushMessage(resultsResponse.error, 'error')
            return false
        }
        for (const result of resultsResponse.data) {
            if (result.data.Survey[0].id === surveyId) {
                const deleteResponse = await ResultsApi.deleteResultById(result.id)

                if (!deleteResponse.success)  {
                    deleteResult = false
                }
            }
        }
        return deleteResult
    }

    async deleteSurvey(surveyId: string): Promise<ApiResponse<boolean>> {
        const deleteAnswersResult = await this.deleteSurveyResults(surveyId)
        if (!deleteAnswersResult) {
            messageHelper.pushMessage('Ошибка при удалении результатов опроса', 'error')
            return {
                error: 'Ошибка при удалении результатов опроса',
                success: false
            }
        }
        const deleteResult = await SurveysApi.deleteSurvey(surveyId)
        return deleteResult
    }
}

export default new SurveyHelper()