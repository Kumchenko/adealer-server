export interface IApiErrorConstructor {
    status: number
    message: string
    params?: string[]
}

export interface IApiError extends IApiErrorConstructor, Error {}
