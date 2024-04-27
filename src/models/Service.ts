import { Request } from 'express'

export interface IServicesGetQuery {
    modelId: string
    componentId: string
    qualityId: string
}

export type IServicesGetRequest = Request<{}, {}, {}, IServicesGetQuery>
