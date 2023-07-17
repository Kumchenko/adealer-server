export interface IApiErrorCreator {
    i18n: string;
    message: string;
}

export interface IApiErrorConstructor extends IApiErrorCreator {
    status: number;
}

export interface IApiError extends IApiErrorConstructor, Error { }