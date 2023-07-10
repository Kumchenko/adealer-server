import { IApiError, IApiErrorConstructor, IApiErrorCreator } from "../interfaces";

class ApiError extends Error {
    status: number;
    i18n: string;
    message: string;

    constructor({ status, i18n, message }: IApiErrorConstructor) {
        super('ApiError');
        this.status = status;
        this.i18n = i18n;
        this.message = message;
    }

    static badRequest({ i18n, message }: IApiErrorCreator) {
        return new ApiError({ status: 400, i18n, message });
    }

    static forbidden({ i18n, message }: IApiErrorCreator) {
        return new ApiError({ status: 403, i18n, message });
    }

    static internal({ i18n, message }: IApiErrorCreator) {
        return new ApiError({ status: 500, i18n, message });
    }

    static notSupported() {
        return this.badRequest(({ i18n: 'occured', message: 'This path is not supported' }))
    }
}

export default ApiError