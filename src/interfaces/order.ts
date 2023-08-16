import { Request, Response } from 'express'
import { Operation, Order, Service, Status } from '@prisma/client'
import { ServiceUniqueData } from './service'
import { AuthResponse, Sort } from '.'

export enum OrderFilter {
    All = 'ALL',
    Created = 'CREATED',
    Process = 'INPROCESS',
    Done = 'DONE',
}

export type OrderId = { id: string }

export type OrderTel = { tel: string }

export enum OrderSortBy {
    ID = 'id',
    Name = 'name',
    Surname = 'surname',
    Tel = 'tel',
    Email = 'email',
    Cost = 'cost',
    Created = 'created',
}

export type OrdersGetQuery = {
    id?: string
    name: string
    surname: string
    tel: string
    email: string
    page: string
    perPage: string
    from: string
    to: string
    modelId: string
    componentId: string
    qualityId: string
    apply: string
    filter: OrderFilter
    sort: Sort
    sortBy: OrderSortBy
}

export type OrderCreationalInfo = Pick<Order, 'name' | 'surname' | 'tel' | 'email'> & ServiceUniqueData

export type OrderCreateRequest = Request<{}, {}, OrderCreationalInfo>

export type OrderCheckRequest = Request<OrderId>

export type OrderCheckResponse = Response<{}, { order: Order & { service: Service; operations: Operation[] } }> &
    AuthResponse

export type OrderGetRequest = Request<{}, {}, {}, Partial<OrderTel>> & OrderCheckRequest

export type OrderDeleteRequest = OrderCheckRequest

export type OrderUpdateRequest = Request<{}, {}, Partial<OrderCreationalInfo> & { cost?: number; status?: Status }>

export type OrdersGetRequest = Request<{}, {}, {}, Partial<OrdersGetQuery>>
