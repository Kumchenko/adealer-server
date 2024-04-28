import { IComponentsGetQuery } from 'adealer-types'
import { Request } from 'express'

export type IComponentsGetRequest = Request<{}, {}, {}, IComponentsGetQuery>
