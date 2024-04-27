import { CallMe } from '@prisma/client'
import { Request, Response } from 'express'

export enum ECallMeFilter {
    All = 'all',
    Created = 'created',
    Checked = 'checked',
}

export enum ECallMeSortByField {
    ID = 'id',
    NAME = 'name',
    TEL = 'tel',
    EMAIL = 'email',
    COST = 'cost',
    CREATED = 'created',
}

export type ICallMesGetQuery = {
    id?: string
    name?: string
    tel?: string
    page?: string
    perPage?: string
    from?: string
    to?: string
    filter?: ECallMeFilter
    apply?: boolean
    sortBy?: ECallMeSortByField
    sortDesc?: boolean
}

export interface ICallMeCheckParams {
    id: string
}

export interface ICallMeCreate {
    name: string
    tel: string
}

export interface ICallMeUpdate {
    name: string
    tel: string
    checked: boolean
}

export type ICallMeCheckRequest = Request<ICallMeCheckParams>

export type ICallMeCheckResponse = Response<{}, CallMe>

export type ICallMeUpdateRequest = Request<ICallMeCheckParams, {}, ICallMeUpdate>

export type ICallMeCreateRequest = Request<{}, {}, ICallMeCreate>

export type ICallMesGetRequest = Request<{}, {}, {}, ICallMesGetQuery>
