interface FirebaseData {
    id: string
}
interface CheckPickerItem<T> {
    value: T
    label: string
}

interface ApiResponseSuccess<T> {
    data: T
    success: true
}

interface ApiResponseError {
    error: string
    success: false
}

type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError

export { FirebaseData, CheckPickerItem, ApiResponse }
