import { Employee } from '@prisma/client'
import { Request, Response } from 'express'

export type LoginData = Pick<Employee, 'login' | 'password'>

export type EmployeeData = Pick<Employee, 'id' | 'login'>

export type RefreshRequest = Request<
    {},
    {},
    {
        refreshToken: string
    }
>

export type AuthResponse = Response<{}, { employee: EmployeeData }>

export type EmployeeLoginRequest = Request<{}, {}, LoginData>

export type EmployeeResponse = Response<{}, { employee: LoginData }>
