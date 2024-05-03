import { IEmployeeRefresh, IEmployeeLogin, IEmployeeData } from 'adealer-types'
import { Request, Response } from 'express'

export type IEmployeeRefreshRequest = Request<{}, {}, IEmployeeRefresh>

export type IEmployeeLoginRequest = Request<{}, {}, IEmployeeLogin>

export type IEmployeeAuthResponse = Response<{}, IEmployeeLogin>

export type IEmployeeResponse = Response<{}, { employee: IEmployeeData }>
