import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import ApiError from '../errors/ApiError'
import { EmployeeLoginRequest, EmployeeResponse, RefreshRequest } from '../models'
import { Jwt } from '../utils'
import { signToken } from '../services'
import { Employee } from '@prisma/client'

class EmployeeController {
    async login(req: EmployeeLoginRequest, res: EmployeeResponse, next: NextFunction) {
        try {
            res.locals.employee = req.body
            next()
        } catch (e) {
            next(e)
        }
    }

    async refresh(req: RefreshRequest, res: EmployeeResponse, next: NextFunction) {
        try {
            const { refreshToken } = req.body

            const employee = Jwt.verify<Employee>(refreshToken)
            if (!employee) {
                throw ApiError.notAuthorized()
            }

            res.locals.employee = { login: employee.login, password: employee.password }
            next()
        } catch (e) {
            next(e)
        }
    }

    async authorization(req: Request, res: EmployeeResponse, next: NextFunction) {
        try {
            const { login, password } = res.locals.employee
            if (!login || !password) {
                throw ApiError.badRequest('empty-login-data')
            }

            const employee = await prisma.employee.findUnique({
                where: { login },
            })

            if (!employee) {
                throw ApiError.badRequest('employee-not-found')
            }

            if (employee.password !== password) {
                throw ApiError.badRequest('password-is-wrong')
            }

            // Generating tokens
            res.json({ id: employee.id, login: employee.login, ...signToken(employee) })
        } catch (e) {
            next(e)
        }
    }

    async info(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization?.split('Bearer ')?.at(1)

            const employee = Jwt.verify<Employee>(token)

            if (!employee) {
                throw ApiError.notAuthorized()
            }
            res.json({
                id: employee.id,
                login: employee.login,
            })
        } catch (e) {
            next(e)
        }
    }
}

export default new EmployeeController()
