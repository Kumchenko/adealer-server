import { Request, Response } from 'express'
import { Operation, Order, Service } from '@prisma/client'
import {
    IEmployeeData,
    IOrderCheckParams,
    IOrderCreate,
    IOrderGetQuery,
    IOrderUpdate,
    IOrdersGetQuery,
    IOrdersGetStatsQuery,
} from 'adealer-types'

export type IOrderCreateRequest = Request<{}, {}, IOrderCreate>

export type IOrderCheckRequest = Request<IOrderCheckParams>

export type IOrderCheckResponse = Response<
    {},
    {
        order: Order & { service: Service; operations: Operation[] }
        employee: IEmployeeData
    }
>

export type IOrderGetRequest = Request<{}, {}, {}, IOrderGetQuery> & IOrderCheckRequest

export type IOrderDeleteRequest = IOrderCheckRequest

export type IOrderUpdateRequest = Request<{}, {}, IOrderUpdate>

export type IOrdersGetRequest = Request<{}, {}, {}, IOrdersGetQuery>

export type IOrdersGetStatsRequest = Request<{}, {}, {}, IOrdersGetStatsQuery>
