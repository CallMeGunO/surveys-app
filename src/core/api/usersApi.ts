import { ApiResponse } from "../types/Common"
import { User } from "../types/User"

class UsersApi {
    static async getUsers(): Promise<ApiResponse<User[]>> {
        try {
            const url = `/api/us/superuser/user/getList`
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

    static async getCurrentUser(): Promise<ApiResponse<User>> {
        try {
            const url = `/api/us/user/me`
            const response = await fetch(url)

            if (response.ok) {
                const json = await response.json()
                return {
                    data: json,
                    success: true,
                }
            } else {
                return Promise.reject(response)
            }
        } catch (error) {
            console.log(error)
            return {
                error: error,
                success: false,
            }
        }
    }
}

export default UsersApi