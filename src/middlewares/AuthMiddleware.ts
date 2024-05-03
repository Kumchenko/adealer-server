import { NextFunction, Request } from 'express'
import ApiError from '../errors/ApiError'
import { IEmployeeResponse } from '../models'
import { Jwt } from '../utils/Jwt'
import { IEmployeeData } from 'adealer-types'

export default function AuthMiddleware(req: Request, res: IEmployeeResponse, next: NextFunction) {
    try {
        if (req.method === 'OPTIONS') {
            next()
        }

        // Getting token from cookie
        const token = req.headers.authorization?.split('Bearer ')?.at(1)

        // If not decoded or token undefined throw error
        const decoded = Jwt.verify<IEmployeeData>(token)
        if (!decoded) {
            throw ApiError.notAuthorized()
        }

        // Setting EmployeeData for response (for determining operation issuer)
        res.locals.employee = { id: decoded.id, login: decoded.login }

        // Success - Go to next middleware
        next()
    } catch (e) {
        next(e)
    }
}
