import { NextFunction, Request, Response } from 'express'
import ApiError from '../errors/ApiError'
import { isDev } from '../constants'

export default function (err: Error, req: Request, res: Response, next: NextFunction) {
    const isApiError = err instanceof ApiError

    isDev ? console.error(`${err.message} ${new Date().toLocaleString()}`) : null

    return res.status(isApiError ? err.status : 500).json({
        name: err.name,
        i18n: isApiError ? err.i18n : 'occured',
        message: err.message,
        stack: isDev ? err.stack : undefined,
    })
}
