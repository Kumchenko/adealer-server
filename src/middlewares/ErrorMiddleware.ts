import { NextFunction, Request, Response } from 'express'
import ApiError from '../errors/ApiError'
import { isDev } from '../constants'

import TranslationController from '../controllers/TranslationController'
import { API_ERROR_NAME } from '../models'

const errorTranslationController = new TranslationController('errors')

export default function ErrorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    const isApiError = err instanceof ApiError && err.name === API_ERROR_NAME

    const locale = req.headers['accept-language']?.slice(0, 2)

    const message = isApiError ? errorTranslationController.getTranslation(locale, err.message) : err.message
    isDev ? console.error(`${message} – ${new Date().toLocaleString()}`) : null

    return res.status(isApiError ? err.status : 500).json({
        name: err.name,
        message,
    })
}
