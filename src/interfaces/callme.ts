import { CallMe } from '@prisma/client'
import { Request, Response } from 'express'
import { Sort } from '.'

export type CallmeId = {
    id: string
}

export enum CallmeFilter {
    All = 'all',
    Created = 'created',
    Checked = 'checked',
}

export type CallmesQuery = Partial<{
    id: string
    name: string
    tel: string
    page: string
    perPage: string
    from: string
    to: string
    filter: CallmeFilter
    apply: string
    sortBy: 'id' | 'name' | 'tel' | 'checked' | 'created'
    sort: Sort
}>

export type CallmeCheckResponse = Response<{}, { callme: CallMe }>

export type CallmeCheckRequest = Request<CallmeId>

export type CallmeUpdateRequest = Request<CallmeId, {}, Partial<Omit<CallMe, 'id'>>>

export type CallmeCreateRequest = Request<{}, {}, Pick<CallMe, 'name' | 'tel'>>

export type CallmesGetRequest = Request<{}, {}, {}, CallmesQuery>
