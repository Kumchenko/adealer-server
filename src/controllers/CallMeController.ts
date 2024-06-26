import { Response, Request, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import { prisma } from '../lib/prisma'
import {
    ICallMeCheckRequest,
    ICallMeCheckResponse,
    ICallMeCreateRequest,
    ICallMeUpdateRequest,
    ICallMesGetRequest,
    ICallMesGetStatsRequest,
} from '../models'
import { Prisma } from '@prisma/client'
import { ECallMeFilter, ECallMeSortByField, ETimeframe } from 'adealer-types'
import DateUtils from '../utils/Date'
import CallMeUtils from '../utils/CallMe'

class CallmeController {
    async check(req: ICallMeCheckRequest, res: ICallMeCheckResponse, next: NextFunction) {
        try {
            const { id } = req.params

            const callme = await prisma.callMe.findUnique({
                where: {
                    id: parseInt(id),
                },
            })

            if (callme) {
                res.locals.call = callme
                next()
            } else {
                throw ApiError.badRequest('callme-not-found')
            }
        } catch (e) {
            next(e)
        }
    }

    async create(req: ICallMeCreateRequest, res: Response, next: NextFunction) {
        try {
            const { name, tel } = req.body

            if (!tel || !name) {
                throw ApiError.badRequest('empty-data')
            }

            const createdCall = await prisma.callMe.create({
                data: {
                    name,
                    tel,
                },
            })

            res.json(createdCall)
        } catch (e) {
            next(e)
        }
    }

    async get(req: ICallMeCheckRequest, res: ICallMeCheckResponse, next: NextFunction) {
        try {
            res.json(res.locals.call)
        } catch (e) {
            next(e)
        }
    }

    async delete(req: ICallMeCheckRequest, res: ICallMeCheckResponse, next: NextFunction) {
        try {
            const deletedCallme = await prisma.callMe.delete({
                where: {
                    id: res.locals.call.id,
                },
            })

            if (!deletedCallme) {
                throw ApiError.badRequest('callme-not-found')
            }

            res.json(deletedCallme)
        } catch (e) {
            next(e)
        }
    }

    async update(req: ICallMeUpdateRequest, res: ICallMeCheckResponse, next: NextFunction) {
        try {
            const { name, tel, checked } = req.body

            const getCheckedDate = () => {
                if (checked === null) return checked
                switch (typeof checked) {
                    case 'boolean':
                        return new Date()
                    case 'string':
                        return new Date(checked)
                    default:
                        return undefined
                }
            }

            const updatedCallme = await prisma.callMe.update({
                data: {
                    name,
                    tel,
                    checked: getCheckedDate(),
                },
                where: {
                    id: res.locals.call.id,
                },
            })

            if (!updatedCallme) {
                throw ApiError.badRequest('callme-not-found')
            }

            res.json(updatedCallme)
        } catch (e) {
            next(e)
        }
    }

    async getMany(req: ICallMesGetRequest, res: Response, next: NextFunction) {
        try {
            const {
                id,
                name,
                tel,
                page: pageString = '-1',
                perPage: perPageString = '-1',
                from,
                to,
                apply,
                sortDesc = false,
                sortBy = ECallMeSortByField.ID,
                filter = ECallMeFilter.All,
            } = req.query

            const page = parseInt(pageString)
            const perPage = parseInt(perPageString)

            const isPagination = page > 0 && perPage > 0

            const query: Prisma.CallMeFindManyArgs = {
                where: {
                    id: (id && parseInt(id)) || undefined,
                    name: { contains: name },
                    tel: { contains: tel },
                    created: {
                        lte:
                            ((filter === ECallMeFilter.Checked && !apply) || filter !== ECallMeFilter.Checked) && to
                                ? new Date(to)
                                : undefined,
                        gte:
                            ((filter === ECallMeFilter.Checked && !apply) || filter !== ECallMeFilter.Checked) && from
                                ? new Date(from)
                                : undefined,
                    },
                    checked: {
                        not: filter === ECallMeFilter.Checked ? null : undefined,
                        equals: filter === ECallMeFilter.Created ? null : undefined,
                        lte: filter === ECallMeFilter.Checked && apply && to ? new Date(to) : undefined,
                        gte: filter === ECallMeFilter.Checked && apply && from ? new Date(from) : undefined,
                    },
                },
                orderBy: {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                },
                skip: isPagination ? (page - 1) * perPage : undefined,
                take: isPagination ? perPage : undefined,
            }

            const [callmes, count] = await prisma.$transaction([
                prisma.callMe.findMany(query),
                prisma.callMe.count({ where: query.where }),
            ])

            res.json({
                pagination: {
                    pages: isPagination ? Math.ceil(count / perPage) : 1,
                    page: isPagination ? page : 1,
                    total: count,
                    perPage: isPagination ? perPage : count,
                },
                data: callmes,
            })
        } catch (e) {
            next(e)
        }
    }

    async getStats(req: ICallMesGetStatsRequest, res: Response, next: NextFunction) {
        try {
            const { timeframe = ETimeframe.WEEK, to: toString } = req.query

            const to = toString ? new Date(toString) : new Date()
            const datePeriods = DateUtils.getDatePeriods(timeframe, to)
            const periodQueries = CallMeUtils.getStatsQueries(datePeriods)

            const createdQuery: Prisma.CallMeCountArgs = {
                where: {
                    checked: null,
                },
            }

            const checkedQuery: Prisma.CallMeCountArgs = {
                where: {
                    checked: {
                        not: null,
                    },
                },
            }

            const [all, created, checked, ...periods] = await prisma.$transaction([
                prisma.callMe.count(),
                prisma.callMe.count(createdQuery),
                prisma.callMe.count(checkedQuery),
                ...periodQueries.map(q => prisma.callMe.count(q)),
            ])

            res.json({
                all,
                created,
                checked,
                counts: periods.map((item, i) => ({
                    date: datePeriods[i][0],
                    calls: item,
                })),
            })
        } catch (e) {
            next(e)
        }
    }
}

export default new CallmeController()
