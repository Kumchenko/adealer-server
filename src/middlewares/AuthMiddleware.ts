import { NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import { AuthResponse, EmployeeData, RequestWithTokens } from '../interfaces'
import { Jwt } from '../utils/Jwt'

export function authMiddleware(req: RequestWithTokens, res: AuthResponse, next: NextFunction) {
    try {
        if (req.method === 'OPTIONS') {
            next()
        }

        // Getting token from cookie
        let token = req.cookies.access_token

        // If not decoded or token undefined throw error
        const decoded = Jwt.verify<EmployeeData>(token)
        if (!decoded) {
            throw ApiError.notAuthorized()
        }

        // Setting EmployeeData for response (for determining operation issuer)
        res.locals.employee = {
            id: decoded.id,
            login: decoded.login,
        }

        // Success - Go to next middleware
        next()
    } catch (e) {
        next(e)
    }
}
