import { Response, Request, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import { prisma } from '../lib/prisma'
import {
    CallmeCreateRequest,
    CallmeUpdateRequest,
    CallmesGetRequest,
    CallmeCheckRequest,
    CallmeCheckResponse,
    CallmeFilter,
    Sort,
} from '../interfaces'
import { Prisma } from '@prisma/client'

class CallmeController {
    async check(req: CallmeCheckRequest, res: CallmeCheckResponse, next: NextFunction) {
        try {
            const { id } = req.params

            const callme = await prisma.callMe.findUnique({
                where: {
                    id: parseInt(id),
                },
            })

            if (callme) {
                res.locals.callme = callme
                next()
            } else {
                throw ApiError.badRequest({
                    i18n: 'callme-not-found',
                    message: 'CallMe not found',
                })
            }
        } catch (e) {
            next(e)
        }
    }

    async create(req: CallmeCreateRequest, res: Response, next: NextFunction) {
        try {
            const { name, tel } = req.body

            if (!tel || !name) {
                throw ApiError.badRequest({
                    i18n: 'empty-data',
                    message: 'Provided tel or name is undefined',
                })
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

    async get(req: CallmeCheckRequest, res: CallmeCheckResponse, next: NextFunction) {
        try {
            res.json(res.locals.callme)
        } catch (e) {
            next(e)
        }
    }

    async delete(req: CallmeCheckRequest, res: CallmeCheckResponse, next: NextFunction) {
        try {
            const deletedCallme = await prisma.callMe.delete({
                where: {
                    id: res.locals.callme.id,
                },
            })

            if (!deletedCallme) {
                throw ApiError.badRequest({
                    i18n: 'callme-not-found',
                    message: 'CallMe not found',
                })
            }

            res.json(deletedCallme)
        } catch (e) {
            next(e)
        }
    }

    async update(req: CallmeUpdateRequest, res: CallmeCheckResponse, next: NextFunction) {
        try {
            const updatedCallme = await prisma.callMe.update({
                data: req.body,
                where: {
                    id: res.locals.callme.id,
                },
            })

            if (!updatedCallme) {
                throw ApiError.badRequest({
                    i18n: 'callme-not-found',
                    message: 'CallMe not found',
                })
            }

            res.json(updatedCallme)
        } catch (e) {
            next(e)
        }
    }

    async getMany(req: CallmesGetRequest, res: Response, next: NextFunction) {
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
                sort = Sort.Asc,
                sortBy = 'id',
                filter = CallmeFilter.All,
            } = req.query

            const page = parseInt(pageString)
            const perPage = parseInt(perPageString)

            const isPagination = page > 0 && perPage > 0

            const query: Prisma.CallMeFindManyArgs = {
                where: {
                    id: id ? parseInt(id) : undefined,
                    name: { contains: name },
                    tel: { contains: tel },
                    created: {
                        lte:
                            ((filter === CallmeFilter.Checked && !apply) || filter !== CallmeFilter.Checked) && to
                                ? new Date(to)
                                : undefined,
                        gte:
                            ((filter === CallmeFilter.Checked && !apply) || filter !== CallmeFilter.Checked) && from
                                ? new Date(from)
                                : undefined,
                    },
                    checked: {
                        not: filter === CallmeFilter.Checked ? null : undefined,
                        equals: filter === CallmeFilter.Created ? null : undefined,
                        lte: filter === CallmeFilter.Checked && apply && to ? new Date(to) : undefined,
                        gte: filter === CallmeFilter.Checked && apply && from ? new Date(from) : undefined,
                    },
                },
                orderBy: {
                    [sortBy]: sort,
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

    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
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

            const [all, created, checked] = await prisma.$transaction([
                prisma.callMe.count(),
                prisma.callMe.count(createdQuery),
                prisma.callMe.count(checkedQuery),
            ])

            res.json({
                all,
                created,
                checked,
            })
        } catch (e) {
            next(e)
        }
    }
}

export default new CallmeController()
