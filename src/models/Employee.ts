import { Request, Response } from 'express'

export interface IEmployeeLogin {
    login: string
    password: string
}

export interface IEmployeeAuthorization {
    id: number
    login: string
    accessToken: string
    refreshToken: string
}

export interface IEmployeeTokens {
    accessToken: string
    refreshToken: string
}

export interface IEmployeeData {
    id: number
    login: string
}

export interface IEmployeeRefresh {
    refreshToken: string
}

export type IEmployeeRefreshRequest = Request<{}, {}, IEmployeeRefresh>

export type IEmployeeLoginRequest = Request<{}, {}, IEmployeeLogin>

export type IEmployeeAuthResponse = Response<{}, IEmployeeLogin>

export type IEmployeeResponse = Response<{}, IEmployeeData>
