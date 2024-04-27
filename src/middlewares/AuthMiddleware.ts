import { NextFunction, Request } from 'express'
import ApiError from '../errors/ApiError'
import { IEmployeeResponse, IEmployeeData } from '../models'
import { Jwt } from '../utils/Jwt'

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
        res.locals = {
            ...res.locals,
            id: decoded.id,
            login: decoded.login,
        }

        // Success - Go to next middleware
        next()
    } catch (e) {
        next(e)
    }
}
