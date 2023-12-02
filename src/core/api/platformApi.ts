import { ApiResponse, Attachment, LookupField } from "../types/Common"

class PlatformApi {
    static DEFAULT_PARAMS = {
        filters: null,
        sorting: null,
        paging: { page: 0, rowsPerPage: 500, enableNext: true }
    }

    static async getListItems(listId: string, params?: object | null): Promise<ApiResponse<unknown>> {
        try {
            const url = `/api/ecm/entity/${listId}/instance/getList`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(params || this.DEFAULT_PARAMS)
            })

            if (response.ok) {
                const json = await response.json()
                return {
                    data: json, 
                    success: true
                }
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false
            }
        }
    }

    static async getListItemById(listId: string, itemId: string): Promise<ApiResponse<unknown>> {
        try {
            const url = `/api/ecm/entity/${listId}/instance/${itemId}`
            const response = await fetch(url)

            if (response.ok) {
                const json = await response.json()
                return {
                    data: json, 
                    success: true
                }
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false
            }
        }
    }

    static async createListItem(listId: string, itemData: object): Promise<ApiResponse<unknown>> {
        try {
            const url = `/api/ecm/entity/${listId}/instance`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(itemData)
            })

            if (response.ok) {
                const json = await response.json()
                return {
                    data: json, 
                    success: true
                }
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false
            }
        }
    }

    static async updateListItem(listId: string, itemData: object): Promise<ApiResponse<unknown>> {
        try {
            const url = `/api/ecm/entity/${listId}/instance`
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(itemData)
            })

            if (response.ok) {
                const json = await response.json()
                return {
                    data: json, 
                    success: true
                }
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false
            }
        }
    }

    static async deleteListItem(listId: string, itemId: string): Promise<ApiResponse<boolean>> {
        try {
            const url = `/api/ecm/entity/${listId}/instance/${itemId}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
            })

            if (response.ok) {
                return {
                    data: true,
                    success: true,
                }
            } 
            return {
                error: '',
                success: false,
            }
        } catch (error) {
            console.error(error)
            return {
                error: '',
                success: false,
            }
        }
    }

    static async getListInfoByName(listName: string): Promise<ApiResponse<LookupField<undefined>[]>> {
        try {
            const url = `/api/ecm/entity/minified/getList`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    filters: {
                        operator: 'eq',
                        type: 'eq',
                        leftOperand: {
                            type: 'field',
                            field: {
                                type: 'text',
                                label: listName,
                                options: [],
                                labelCode: 'entity-name',
                                dataAdapter: {
                                    type: 'CommonAdapter',
                                    service: 'z3x-entity-service',
                                    endpoint: '/entity'
                                },
                                spFieldName: 'entityMetadata.entityTypeName'
                            }
                        },
                        rightOperand: {
                            type: 'value',
                            value: listName
                        }
                    },
                    sorting: {
                        field: 'updatedAt',
                        direction: 'asc'
                    },
                    paging: {
                        page: 0,
                        rowsPerPage: 50,
                        enableNext: true
                    }
                })
            })

            if (response.ok) {
                const json = await response.json()
                return {
                    data: json, 
                    success: true
                }
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false
            }
        }
    }

    static async getListPermissons(listId: string): Promise<ApiResponse<object>> {
        try {
            const url = `/api/ecm/entity/${listId}`
            const response = await fetch(url)

            if (response.ok) {
                const json = await response.json()
                return {
                    data: json, 
                    success: true
                }
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false
            }
        }
    }

    static async uploadFileToDirectoryAttachemtns(
        rootDirectoryId: string,
        directoryId: string,
        file: BinaryData,
        attachmentPermissions: object,
    ) {
        try {
            const url = `/api/fs/root/${rootDirectoryId}/dir/${directoryId}/file_stringify`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    // 'content-type': 'application/json'
                },
                body: JSON.stringify({
                    file: file,
                    permissions: attachmentPermissions
                })
            })
            if (response.ok) {
                const json = await response.json()
                return {
                    data: json, 
                    success: true
                }
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false
            }
        }
    }

    static async getDirectoryAttachments(rootDirectoryId: string, directoryId: string): Promise<ApiResponse<Attachment[]>> {
        try {
            const url = `/api/fs/root/${rootDirectoryId}/dir/${directoryId}/getList`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(this.DEFAULT_PARAMS)
            })

            if (response.ok) {
                const json = await response.json()
                return {
                    data: json, 
                    success: true
                }
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false
            }
        }
    }

    static async deleteFileFromDirectoryAttachments(rootDirectoryId: string, directoryId: string, fileId: string): Promise<ApiResponse<boolean>> {
        try {
            const url = `/api/fs/root/${rootDirectoryId}/dir/${directoryId}/file/${fileId}`
            const response = await fetch(url, {
                method: 'DELETE'
            })

            if (response.ok) {
                return {
                    data: true, 
                    success: true
                }
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false
            }
        }
    }
}

export default PlatformApi
