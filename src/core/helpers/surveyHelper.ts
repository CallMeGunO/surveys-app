import ResultsApi from '../api/resultsApi'
import SurveysApi from '../api/surveysApi'
import { Result } from '../types/Result'
import { FirebaseSurveyData, Survey, SurveyStatus } from '../types/Surveys'
import messageHelper from './messageHelper'

class SurveyHelper {
    parseRequestSurveyData(requestSurveyData: FirebaseSurveyData): Survey {
        return {
            id: requestSurveyData.id,
            title: requestSurveyData.Title,
            description: requestSurveyData.Description,
            data: JSON.parse(requestSurveyData.SurveyData),
            created: requestSurveyData.Created,
            modified: requestSurveyData.Modified,
        }
    }

    checkIsStopped(survey: Survey, allResults: Result[]): boolean {
        const unfinishedResult = allResults
            .filter((result) => result.surveyId === survey.id)
            .find((result) => !result.data.isFinished)

        if (unfinishedResult) {
            return true
        }

        return false
    }

    async createSurvey(survey: Survey, status: SurveyStatus) {
        const response = await SurveysApi.createSurvey({
            id: survey.id,
            Title: survey.title,
            Description: survey.description,
            SurveyData: JSON.stringify({
                content: {
                    questionGroups: survey.data.content.questionGroups,
                    questions: survey.data.content.questions,
                },
                settings: {
                    status: status,
                },
            }),
            Created: survey.created,
            Modified: survey.modified,
        })

        return response
    }

    async updateSurvey(survey: Survey, status: SurveyStatus) {
        const response = await SurveysApi.updateSurvey({
            id: survey.id,
            Title: survey.title,
            Description: survey.description,
            SurveyData: JSON.stringify({
                content: {
                    questionGroups: survey.data.content.questionGroups,
                    questions: survey.data.content.questions,
                },
                settings: {
                    status: status,
                },
            }),
            Created: survey.created,
            Modified: survey.modified,
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
            if (result.SurveyId === surveyId) {
                const deleteResponse = await ResultsApi.deleteResult(result.id)

                if (!deleteResponse.success) {
                    deleteResult = false
                }
            }
        }
        return deleteResult
    }

    async deleteSurvey(surveyId: string) {
        const deleteAnswersResult = await this.deleteSurveyResults(surveyId)
        if (!deleteAnswersResult) {
            messageHelper.pushMessage('Ошибка при удалении результатов опроса', 'error')
            return {
                error: 'Ошибка при удалении результатов опроса',
                success: false,
            }
        }
        const deleteResult = await SurveysApi.deleteSurvey(surveyId)
        return deleteResult
    }
}

export default new SurveyHelper()
