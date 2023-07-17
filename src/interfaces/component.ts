import { Request } from "express"

export type ComponentsGetRequest = Request<{
    modelId: string
}>