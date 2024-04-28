import { CallMe } from '@prisma/client'
import { Request, Response } from 'express'

import { ICallMeCheckParams, ICallMeCreate, ICallMeUpdate, ICallMesGetQuery } from 'adealer-types'

export type ICallMeCheckRequest = Request<ICallMeCheckParams>

export type ICallMeCheckResponse = Response<{}, CallMe>

export type ICallMeUpdateRequest = Request<ICallMeCheckParams, {}, ICallMeUpdate>

export type ICallMeCreateRequest = Request<{}, {}, ICallMeCreate>

export type ICallMesGetRequest = Request<{}, {}, {}, ICallMesGetQuery>
