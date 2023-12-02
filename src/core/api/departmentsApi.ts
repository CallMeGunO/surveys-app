import { ApiResponse } from "../types/Common"

export interface Department {
    id: string,
    displayName: string,
}

class DepartmentsApi {
    static async getDepartments(): Promise<ApiResponse<Department[]>> {
        try {
            const url = `/api/us/superuser/department/getList`
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    filters: null,
                    sorting: null,
                    paging: { page: 0, rowsPerPage: 500, enableNext: true }
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
}

export default DepartmentsApi