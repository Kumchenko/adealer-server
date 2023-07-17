import { CallMe } from "@prisma/client";
import { Request, Response } from "express"
import { Sort } from ".";

export type CallmeId = {
    id: string;
}

export enum CallmeFilter {
    All = 'all',
    Checked = 'checked',
    Unchecked = 'unchecked'
}

export type CallmesQuery = Partial<{
    id: string;
    skip: string;
    take: string;
    name: string;
    tel: string;
    createdFrom: string;
    createdTo: string;
    checkedFrom: string;
    checkedTo: string;
    filter: CallmeFilter;
    sortBy: 'id' | 'checked' | 'created';
    sort: Sort
}>

export type CallmeCheckResponse = Response<{}, { callme: CallMe }>

export type CallmeCheckRequest = Request<CallmeId>

export type CallmeUpdateRequest = Request<CallmeId, {}, Partial<Omit<CallMe, 'id'>>>

export type CallmeCreateRequest = Request<{}, {}, Pick<CallMe, 'name' | 'tel'>>

export type CallmesGetRequest = Request<{}, {}, {}, CallmesQuery>