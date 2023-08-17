import { Employee } from '@prisma/client'
import { Request, Response } from 'express'

export type LoginData = Pick<Employee, 'login' | 'password'>

export type EmployeeData = Pick<Employee, 'id' | 'login'>

export interface RequestWithTokens extends Request {
    cookies: {
        access_token?: string
        refresh_token?: string
    }
}

export type AuthResponse = Response<{}, { employee: EmployeeData }>

export type EmployeeLoginRequest = Request<{}, {}, LoginData>

export type EmployeeResponse = Response<{}, { employee: LoginData }>

export interface TestRequest extends Request {
    cookies: {
        connected?: string
    }
}
