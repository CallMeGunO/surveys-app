import PlatformApi from './platformApi'
import { RequestSurveyData } from '../types/Surveys'
import useIdStore from '../stores/idStore'
import { ApiResponse } from '../types/Common'

class SurveysApi extends PlatformApi {
    static async getSurveys(): Promise<ApiResponse<RequestSurveyData[]>> {
        const listId = useIdStore.getState().surveysListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        return this.getListItems(listId) as Promise<ApiResponse<RequestSurveyData[]>>
    }

    static async getSurveyById(surveyId: string): Promise<ApiResponse<RequestSurveyData>> {
        const listId = useIdStore.getState().surveysListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        return this.getListItemById(listId, surveyId) as Promise<ApiResponse<RequestSurveyData>>
    }

    static async createSurvey(itemData: object): Promise<ApiResponse<RequestSurveyData>> {
        const listId = useIdStore.getState().surveysListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        return this.createListItem(listId, itemData) as Promise<ApiResponse<RequestSurveyData>>
    }

    static async updateSurvey(itemData: object): Promise<ApiResponse<RequestSurveyData>> {
        const listId = useIdStore.getState().surveysListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        return this.updateListItem(listId, itemData) as Promise<ApiResponse<RequestSurveyData>>
    }

    static async deleteSurvey(surveyId: string): Promise<ApiResponse<boolean>> {
        const listId = useIdStore.getState().surveysListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        return this.deleteListItem(listId, surveyId)
    }

    static async getSurveysListPermissons(): Promise<ApiResponse<object>> {
        const listId = useIdStore.getState().surveysListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        return this.getListPermissons(listId)
    }
}

export default SurveysApi
