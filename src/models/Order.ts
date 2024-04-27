import { Request, Response } from 'express'
import { Operation, Order, Service, Status } from '@prisma/client'
import { AuthResponse } from '.'

export enum EOrderFilter {
    All = 'ALL',
    Created = 'CREATED',
    Process = 'INPROCESS',
    Done = 'DONE',
}

export enum EOrderSortByField {
    ID = 'id',
    Name = 'name',
    Surname = 'surname',
    Tel = 'tel',
    Email = 'email',
    Cost = 'cost',
    Created = 'created',
}

export type IOrdersGetQuery = {
    id?: string
    name?: string
    surname?: string
    tel?: string
    email?: string
    page?: string
    perPage?: string
    from?: string
    to?: string
    modelId?: string
    componentId?: string
    qualityId?: string
    apply?: string
    filter?: EOrderFilter
    sortBy: EOrderSortByField
    sortDesc?: boolean
}

export interface IOrderCheckParams {
    id: string
}

export interface IOrderGetQuery {
    tel?: string
}

export interface IOrderCreate {
    name: string
    surname: string
    tel: string
    email: string
    modelId: string
    componentId: string
    qualityId: string
}

export interface IOrderUpdate {
    name?: string
    surname?: string
    tel?: string
    email?: string
    modelId?: string
    componentId?: string
    qualityId?: string
    cost?: string
    status?: Status
}

export type IOrderCreateRequest = Request<{}, {}, IOrderCreate>

export type IOrderCheckRequest = Request<IOrderCheckParams>

export type IOrderCheckResponse = Response<{}, { order: Order & { service: Service; operations: Operation[] } }> &
    AuthResponse

export type IOrderGetRequest = Request<{}, {}, {}, IOrderGetQuery> & IOrderCheckRequest

export type IOrderDeleteRequest = IOrderCheckRequest

export type IOrderUpdateRequest = Request<{}, {}, IOrderUpdate>

export type IOrdersGetRequest = Request<{}, {}, {}, IOrdersGetQuery>
