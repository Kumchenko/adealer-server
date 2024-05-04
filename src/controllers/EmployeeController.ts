import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import ApiError from '../errors/ApiError'
import { IEmployeeLoginRequest, IEmployeeRefreshRequest, IEmployeeAuthResponse, IEmployeeBlockRequest } from '../models'
import { Jwt } from '../utils'
import { signToken } from '../services'
import { Employee } from '@prisma/client'

class EmployeeController {
    async login(req: IEmployeeLoginRequest, res: IEmployeeAuthResponse, next: NextFunction) {
        try {
            res.locals.employee = req.body
            next()
        } catch (e) {
            next(e)
        }
    }

    async refresh(req: IEmployeeRefreshRequest, res: IEmployeeAuthResponse, next: NextFunction) {
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

    async authorization(req: Request, res: IEmployeeAuthResponse, next: NextFunction) {
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

            if (employee.attempts <= 0) {
                throw ApiError.badRequest('employee-blocked')
            }

            if (employee.password !== password) {
                const attempts = --employee.attempts
                await prisma.employee.update({ where: { login }, data: { attempts } })
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

            const { password, ...data } = employee

            res.json(data)
        } catch (e) {
            next(e)
        }
    }

    async block(req: IEmployeeBlockRequest, res: Response, next: NextFunction) {
        try {
            const { login, block } = req.body
            const { password, ...employee } = await prisma.employee.update({
                data: { attempts: block ? 0 : 3 },
                where: { login },
            })

            res.json(employee)
        } catch (e) {
            next(e)
        }
    }

    async getMany(req: Request, res: Response, next: NextFunction) {
        try {
            const employees = await prisma.employee.findMany({
                select: {
                    id: true,
                    attempts: true,
                    login: true,
                    role: true,
                },
                orderBy: {
                    id: 'asc',
                },
            })
            res.json(employees)
        } catch (e) {
            next(e)
        }
    }
}

export default new EmployeeController()
