import { Request } from "express"
import { Order } from "@prisma/client"

export interface IOrderRequest extends Request {
    order?: Order
}

export interface IOrderGetRequest extends IOrderRequest {
    query: {
        tel?: string
    }
}

export interface IOrderCreateRequest extends Request {
    body: {
        name: string,
        surname: string,
        tel: string,
        email: string,
        modelId: string,
        componentId: string,
        qualityId: string
    }
}

export interface IComponentsByModelRequest extends Request {
    params: {
        modelId: string
    }
}

export interface ICallmeCreateRequest extends Request {
    body: {
        name: string;
        tel: string;
    }
}

export interface IServicesByModelComponentRequest extends Request {
    query: {
        modelId: string;
        componentId: string;
    }
}

export interface IApiErrorCreator {
    i18n: string;
    message: string;
}

export interface IApiErrorConstructor extends IApiErrorCreator {
    status: number;
}

export interface IApiError extends IApiErrorConstructor, Error { }



