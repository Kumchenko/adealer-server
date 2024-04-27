import { Request } from 'express'

export interface IComponentsGetQuery {
    modelId?: string
}

export type IComponentsGetRequest = Request<{}, {}, {}, IComponentsGetQuery>
