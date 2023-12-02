interface LookupField<T> {
    data: T,
    id: string,
    displayName?: string,
    serviceData?: object,
    attachmentPermissions?: object,
    rootFileId?: string
}

interface CheckPickerItem<T> {
    value: T,
    label: string
}

interface ApiResponseSuccess<T> {
    data: T,
    success: true,
}

interface ApiResponseError {
    error: string,
    success: false,
}

type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError

interface Attachment {
    id: string,
    downloadLink: string,
}

export {
    LookupField,
    CheckPickerItem,
    ApiResponse,
    Attachment
}