import { ApiResponse } from '../types/Common'
import { FirebaseSurveyData } from '../types/Surveys'
import FirebaseApi from './firebaseApi'

class SurveysApi extends FirebaseApi {
    static async getSurveys(): Promise<ApiResponse<FirebaseSurveyData[]>> {
        return this.getListItems('surveys') as Promise<ApiResponse<FirebaseSurveyData[]>>
    }

    static async getSurveyById(surveyId: string): Promise<ApiResponse<FirebaseSurveyData>> {
        return this.getListItemById('surveys', surveyId) as Promise<ApiResponse<FirebaseSurveyData>>
    }

    static async createSurvey(itemData: FirebaseSurveyData): Promise<ApiResponse<boolean>> {
        return this.createListItem('surveys', itemData)
    }

    static async updateSurvey(itemData: FirebaseSurveyData): Promise<ApiResponse<boolean>> {
        return this.updateListItem('surveys', itemData)
    }

    static async deleteSurvey(surveyId: string): Promise<ApiResponse<boolean>> {
        return this.deleteListItemById('surveys', surveyId)
    }
}

export default SurveysApi
