import { IServicesGetQuery } from 'adealer-types'
import { Request } from 'express'

export type IServicesGetRequest = Request<{}, {}, {}, IServicesGetQuery>
