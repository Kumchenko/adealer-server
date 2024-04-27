import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import ApiError from '../errors/ApiError'
import { Prisma, Status } from '@prisma/client'
import {
    EOrderFilter,
    EOrderSortByField,
    IOrderCheckRequest,
    IOrderCheckResponse,
    IOrderCreateRequest,
    IOrderDeleteRequest,
    IOrderGetRequest,
    IOrderUpdateRequest,
    IOrdersGetRequest,
} from '../models'
import OrderUtils from '../utils/Order'

class OrderController {
    async check(req: IOrderCheckRequest, res: IOrderCheckResponse, next: NextFunction) {
        try {
            const { id } = req.params

            const order = await prisma.order.findUnique({
                where: {
                    id: parseInt(id),
                },
                include: {
                    operations: {
                        include: {
                            employee: true,
                        },
                    },
                    service: true,
                },
            })

            if (order) {
                res.locals.order = order
                next()
            } else {
                throw ApiError.badRequest('order-not-found')
            }
        } catch (e) {
            next(e)
        }
    }

    async create(req: IOrderCreateRequest, res: Response, next: NextFunction) {
        try {
            const { name, surname, tel, email, modelId, componentId, qualityId } = req.body

            const service = await prisma.service.findUnique({
                where: {
                    modelId_componentId_qualityId: {
                        modelId,
                        componentId,
                        qualityId,
                    },
                },
            })

            if (!service) {
                throw ApiError.badRequest('service-not-found')
            }

            const order = await prisma.order.create({
                data: {
                    serviceId: service.id,
                    name,
                    surname,
                    tel,
                    email,
                    cost: service.cost,
                },
            })

            res.json({ ...order, service })
        } catch (e) {
            next(e)
        }
    }

    async getWithoutAuth(req: IOrderGetRequest, res: IOrderCheckResponse, next: NextFunction) {
        try {
            const { tel } = req.query

            if (res.locals.order?.tel === tel) {
                res.json(res.locals.order)
            } else {
                throw ApiError.badRequest('tel-is-wrong')
            }
        } catch (e) {
            next(e)
        }
    }

    async get(req: IOrderGetRequest, res: IOrderCheckResponse, next: NextFunction) {
        try {
            res.json(res.locals.order)
        } catch (e) {
            next(e)
        }
    }

    async delete(req: IOrderDeleteRequest, res: IOrderCheckResponse, next: NextFunction) {
        try {
            const { id } = res.locals.order
            await prisma.operation.deleteMany({
                where: {
                    orderId: id,
                },
            })
            const deletedOrder = await prisma.order.delete({
                where: {
                    id,
                },
            })
            res.json(deletedOrder)
        } catch (e) {
            next(e)
        }
    }

    async update(req: IOrderUpdateRequest, res: IOrderCheckResponse, next: NextFunction) {
        try {
            const { name, surname, tel, email, modelId, componentId, qualityId, cost, status } = req.body
            const {
                order: { service, ...order },
                employee,
            } = res.locals

            const parsedCost = parseInt(cost ?? '-1')

            const newService = await prisma.service.findUnique({
                where: {
                    modelId_componentId_qualityId: {
                        modelId: modelId ?? service.modelId,
                        componentId: componentId ?? service.componentId,
                        qualityId: qualityId ?? service.qualityId,
                    },
                },
            })

            if (!newService) {
                throw ApiError.badRequest('service-not-found')
            }

            if (status) {
                await prisma.operation.create({
                    data: {
                        status,
                        orderId: order.id,
                        employeeId: employee.id,
                    },
                })
            }

            const updatedOrder = await prisma.order.update({
                where: {
                    id: order.id,
                },
                data: {
                    name,
                    surname,
                    tel,
                    email,
                    serviceId: newService.id,
                    cost: parsedCost >= 0 ? parsedCost : service.cost,
                },
                include: {
                    operations: true,
                    service: true,
                },
            })

            res.json(updatedOrder)
        } catch (e) {
            next(e)
        }
    }

    async getMany(req: IOrdersGetRequest, res: Response, next: NextFunction) {
        try {
            const {
                id,
                name,
                surname,
                tel,
                email,
                modelId,
                componentId,
                qualityId,
                page: pageString = '-1',
                perPage: perPageString = '-1',
                from,
                to,
                apply,
                filter = EOrderFilter.All,
                sortDesc = false,
                sortBy = EOrderSortByField.ID,
            } = req.query

            const page = parseInt(pageString)
            const perPage = parseInt(perPageString)

            const isPagination = page > 0 && perPage > 0

            const fromDate = from ? new Date(from) : undefined
            const toDate = to ? new Date(to) : undefined

            const query: Prisma.OrderFindManyArgs = {
                where: {
                    id: (id && parseInt(id)) || undefined,
                    name: {
                        contains: name,
                    },
                    surname: {
                        contains: surname,
                    },
                    tel: {
                        contains: tel,
                    },
                    email: {
                        contains: email,
                    },
                    service: {
                        modelId,
                        componentId,
                        qualityId,
                    },
                    created: {
                        lte:
                            !apply || filter === EOrderFilter.All || filter === EOrderFilter.Created
                                ? toDate
                                : undefined,
                        gte:
                            !apply || filter === EOrderFilter.All || filter === EOrderFilter.Created
                                ? fromDate
                                : undefined,
                    },
                    operations: OrderUtils.getOrderFilter(filter, apply, fromDate, toDate),
                },
                include: {
                    service: true,
                    operations: {
                        include: {
                            employee: {
                                select: {
                                    id: true,
                                    login: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                },
                skip: isPagination ? (page - 1) * perPage : undefined,
                take: isPagination ? perPage : undefined,
            }

            const [orders, count] = await prisma.$transaction([
                prisma.order.findMany(query),
                prisma.order.count({ where: query.where }),
            ])

            res.json({
                pagination: {
                    pages: isPagination ? Math.ceil(count / perPage) : 1,
                    page: isPagination ? page : 1,
                    total: count,
                    perPage: isPagination ? perPage : count,
                },
                data: orders,
            })
        } catch (e) {
            next(e)
        }
    }

    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const createdQuery: Prisma.OrderCountArgs = {
                where: {
                    operations: {
                        none: {},
                    },
                },
            }

            const processQuery: Prisma.OrderCountArgs = {
                where: {
                    operations: {
                        none: {
                            status: Status.DONE,
                        },
                        some: {
                            status: Status.INPROCESS,
                        },
                    },
                },
            }

            const doneQuery: Prisma.OrderCountArgs = {
                where: {
                    operations: {
                        some: {
                            status: Status.DONE,
                        },
                    },
                },
            }

            const services = await prisma.service.findMany({
                include: {
                    _count: {
                        select: { orders: true },
                    },
                },
            })

            const popularService =
                services.length > 0
                    ? services.reduce((max, cur) => (cur._count.orders > max._count.orders ? cur : max))
                    : null

            const [all, created, processing, done] = await prisma.$transaction([
                prisma.order.count(),
                prisma.order.count(createdQuery),
                prisma.order.count(processQuery),
                prisma.order.count(doneQuery),
            ])

            res.json({
                all,
                created,
                processing,
                done,
                model: popularService?.modelId || 'No services',
                component: popularService?.componentId || 'No services',
            })
        } catch (e) {
            next(e)
        }
    }
}

export default new OrderController()
