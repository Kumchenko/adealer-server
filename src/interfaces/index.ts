export type IOrderQuery = {
    tel?: string;
}

export type IOrderParams = {
    id?: string;
}

export interface IOrderBody {
    model: string;
    name: string;
    surname: string;
    tel: string;
    email: string;
    component: string;
    quality: string;
}

export type IComponentsQuery = {
    model?: string;
}

export type IServicesQuery = {
    model: string;
    component: string;
}

export interface ICallQuery {
    name: string;
    tel: string;
}

export interface IServiceBody {
    model: string;
    component: string;
    quality: string;
}

