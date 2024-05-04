import { IEmployeeRefresh, IEmployeeLogin, IEmployeeData, IEmployeeBlock } from 'adealer-types'
import { Request, Response } from 'express'

export type IEmployeeRefreshRequest = Request<{}, {}, IEmployeeRefresh>

export type IEmployeeLoginRequest = Request<{}, {}, IEmployeeLogin>

export type IEmployeeBlockRequest = Request<{}, {}, IEmployeeBlock>

export type IEmployeeAuthResponse = Response<{}, { employee: IEmployeeLogin }>

export type IEmployeeResponse = Response<{}, { employee: IEmployeeData } & any>
