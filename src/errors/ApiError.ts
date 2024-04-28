import { API_ERROR_NAME } from 'adealer-types'
import { IApiErrorConstructor } from '../models'

class ApiError extends Error {
    status: number
    message: string
    params: string[] | undefined

    constructor({ status, message, params }: IApiErrorConstructor) {
        super(message)
        this.name = API_ERROR_NAME
        this.status = status
        this.message = message
        this.params = params
    }

    static badRequest(message: string, params?: string[]) {
        return new ApiError({ status: 400, message, params })
    }

    static forbidden(message: string, params?: string[]) {
        return new ApiError({ status: 403, message, params })
    }

    static internal(message: string, params?: string[]) {
        return new ApiError({ status: 500, message, params })
    }

    static notSupported() {
        return this.badRequest('not-supported')
    }

    static notAuthorized() {
        return new ApiError({
            status: 401,
            message: 'not-authorized',
        })
    }
}

export default ApiError
