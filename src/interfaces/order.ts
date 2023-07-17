import { Request, Response } from "express"
import { Operation, Order, Service, Status } from "@prisma/client"
import { ServiceUniqueData } from "./service"
import { Sort } from "."

export enum OrderFilter {
    All = 'All',
    Created  = 'Created'
}

export type OrderId = { id: string }

export type OrderTel = { tel: string }

export type OrdersGetQuery = {
    id: string;
    name: string;
    surname: string;
    tel: string;
    email: string;
    createdFrom: string;
    createdTo: string;
    modelId: string;
    componentId: string;
    qualityId: string;
    operation: Status;
    filter: OrderFilter;
    sort: Sort;
}

export type OrderCreationalInfo = Pick<Order, 'name' | 'surname' | 'tel' | 'email'> & ServiceUniqueData

export type OrderCreateRequest = Request<{}, {}, OrderCreationalInfo>

export type OrderCheckRequest = Request<OrderId>

export type OrderCheckResponse = Response<{}, { order: Order & { service: Service, operations: Operation[] } }>

export type OrderGetRequest = Request<{}, {}, {}, Partial<OrderTel>> & OrderCheckRequest

export type OrderDeleteRequest = OrderCheckRequest

export type OrderUpdateRequest = Request<{}, {}, Partial<OrderCreationalInfo> & { cost?: number, status?: Status }>

export type OrdersGetRequest = Request<{}, {}, {}, Partial<OrdersGetQuery>>