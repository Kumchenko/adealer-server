import { NextFunction, Request } from 'express'
import ApiError from '../errors/ApiError'
import { IEmployeeResponse } from '../models'
import { Jwt } from '../utils/Jwt'
import { IEmployeeData } from 'adealer-types'
import { prisma } from '../lib/prisma'
import ActionController from '../controllers/ActionController'

export const AuthMiddleware = async (req: Request, res: IEmployeeResponse, next: NextFunction) => {
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

        const employee = await prisma.employee.findUnique({
            where: { login: decoded.login },
        })

        if (!employee || employee.attempts <= 0 || employee.password !== decoded.password) {
            throw ApiError.badRequest('auth-out-of-date')
        }

        // Setting Employee for response (for determining operation issuer)
        res.locals = {
            ...res.locals,
            employee,
        }

        // Adding note to ActionLogs
        ActionController.log(employee.login, req)

        // Success - Go to next middleware
        next()
    } catch (e) {
        next(e)
    }
}
