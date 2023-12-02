import { ApiResponse } from '../types/Common'
import { FirebaseResultData } from '../types/Result'
import FirebaseApi from './firebaseApi'

class ResultsApi extends FirebaseApi {
    static async getResults(): Promise<ApiResponse<FirebaseResultData[]>> {
        return this.getListItems('surveyResults') as Promise<ApiResponse<FirebaseResultData[]>>
    }

    static async getResultById(resultId: string): Promise<ApiResponse<FirebaseResultData>> {
        return this.getListItemById('surveyResults', resultId) as Promise<ApiResponse<FirebaseResultData>>
    }

    static async createResult(itemData: FirebaseResultData): Promise<ApiResponse<boolean>> {
        return this.createListItem('surveyResults', itemData)
    }

    static async updateResult(itemData: FirebaseResultData): Promise<ApiResponse<boolean>> {
        return this.updateListItem('surveyResults', itemData)
    }

    static async deleteResult(resultId: string): Promise<ApiResponse<boolean>> {
        return this.deleteListItemById('surveyResults', resultId)
    }
}

export default ResultsApi
