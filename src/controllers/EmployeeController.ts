import { CookieOptions, NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import ApiError from '../errors/ApiError'
import { EmployeeLoginRequest, EmployeeResponse, RequestWithTokens } from '../interfaces'
import { Jwt } from '../utils'
import { signToken } from '../services'
import { accessTokenMaxAge, refreshTokenMaxAge } from '../configs'
import { Employee } from '@prisma/client'

const accessTokenCookieOptions: CookieOptions = {
    maxAge: accessTokenMaxAge,
    httpOnly: true,
}

const refreshTokenCookieOptions: CookieOptions = {
    maxAge: refreshTokenMaxAge,
    httpOnly: true,
}

class EmployeeController {
    async login(req: EmployeeLoginRequest, res: EmployeeResponse, next: NextFunction) {
        try {
            res.locals.employee = req.body
            next()
        } catch (e) {
            next(e)
        }
    }

    async refresh(req: RequestWithTokens, res: EmployeeResponse, next: NextFunction) {
        try {
            const employee = Jwt.verify<Employee>(req.cookies.refresh_token)
            if (!employee) {
                throw ApiError.notAuthorized()
            }

            res.locals.employee = { login: employee.login, password: employee.password }
            next()
        } catch (e) {
            next(e)
        }
    }

    async authorization(req: RequestWithTokens, res: EmployeeResponse, next: NextFunction) {
        try {
            const { login, password } = res.locals.employee
            if (!login || !password) {
                throw ApiError.badRequest({
                    i18n: 'empty-login-data',
                    message: 'Login or password is empty',
                })
            }

            const employee = await prisma.employee.findUnique({
                where: { login },
            })

            if (!employee) {
                throw ApiError.badRequest({
                    i18n: 'employee-not-found',
                    message: 'Employee with such login not found',
                })
            }

            if (employee.password !== password) {
                throw ApiError.badRequest({
                    i18n: 'password-is-wrong',
                    message: 'The password is wrong',
                })
            }

            // Generating tokens
            const { accessToken, refreshToken } = signToken(employee)

            // Attaching tokens to cookies
            res.cookie('access_token', accessToken, accessTokenCookieOptions)
            res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions)
            res.cookie('logged_in', true, { maxAge: refreshTokenMaxAge })

            res.json(employee)
        } catch (e) {
            next(e)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.cookie('access_token', '', { maxAge: 0 })
            res.cookie('refresh_token', '', { maxAge: 0 })
            res.cookie('logged_in', false, { maxAge: 0 })
            res.sendStatus(200)
        } catch (e) {
            next(e)
        }
    }

    async info(req: RequestWithTokens, res: Response, next: NextFunction) {
        try {
            const employee = Jwt.verify<Employee>(req.cookies.access_token)

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
