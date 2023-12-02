import PlatformApi from './platformApi'
import { RequestResultData } from '../types/Result'
import useIdStore from '../stores/idStore'
import { ApiResponse } from '../types/Common'

class ResultsApi extends PlatformApi {
    static async getResults(): Promise<ApiResponse<RequestResultData[]>> {
        const listId = useIdStore.getState().answersListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        const response = this.getListItems(listId)
        return response as Promise<ApiResponse<RequestResultData[]>>
    }

    static async getResultById(resultId: string): Promise<ApiResponse<RequestResultData>> {
        const listId = useIdStore.getState().answersListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        const response = this.getListItemById(listId, resultId)
        return response as Promise<ApiResponse<RequestResultData>>
    }

    static async createResult(itemData: object): Promise<ApiResponse<RequestResultData>> {
        const listId = useIdStore.getState().answersListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        const response = this.createListItem(listId, itemData)
        return response as Promise<ApiResponse<RequestResultData>>
    }

    static async updateResult(itemData: object): Promise<ApiResponse<RequestResultData>> {
        const listId = useIdStore.getState().answersListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        const response = this.updateListItem(listId, itemData)
        return response as Promise<ApiResponse<RequestResultData>>
    }

    static async deleteResultById(resultId: string): Promise<ApiResponse<boolean>> {
        const listId = useIdStore.getState().answersListId
        if (listId === '') {
            return {
                error: 'Не найдено id списка',
                success: false
            }
        }
        return this.deleteListItem(listId, resultId)
    }
}

export default ResultsApi
