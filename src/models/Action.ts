import { IActionsGetQuery } from 'adealer-types'
import { Request } from 'express'

export type IActionsGetRequest = Request<{}, {}, {}, IActionsGetQuery>
