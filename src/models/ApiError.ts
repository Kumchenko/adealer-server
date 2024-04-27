export const API_ERROR_NAME = 'ApiError' as const

export interface IApiErrorConstructor {
    status: number
    message: string
    params?: string[]
}

export interface IApiError extends IApiErrorConstructor, Error {}
