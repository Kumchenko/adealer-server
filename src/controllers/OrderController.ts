import { NextFunction, Response, Request } from "express";
import { prisma } from "../lib/prisma";
import ApiError from "../errors/ApiError";
import { OrderCheckRequest, OrderCheckResponse, OrderCreateRequest, OrderDeleteRequest, OrderFilter, OrderGetRequest, OrderUpdateRequest, OrdersGetRequest, Sort } from "../interfaces";
import { getOperations } from "../utils";

class OrderController {
    async check(req: OrderCheckRequest, res: OrderCheckResponse, next: NextFunction) {
        try {
            const { id } = req.params;

            if (!id) {
                throw ApiError.badRequest({
                    i18n: 'id-is-undefined',
                    message: 'Provided id is undefined'
                })
            }

            const order = await prisma.order.findUnique({
                where: {
                    id: parseInt(id)
                },
                include: {
                    operations: true,
                    service: true
                }
            })

            if (order) {
                res.locals.order = order;
                next();
            } else {
                throw ApiError.badRequest({
                    i18n: 'order-not-found',
                    message: 'Order not found'
                })
            }
        }
        catch (e) {
            next(e);
        }
    }

    async create(req: OrderCreateRequest, res: Response, next: NextFunction) {
        try {
            const {
                name,
                surname,
                tel,
                email,
                modelId,
                componentId,
                qualityId
            } = req.body;

            const service = await prisma.service.findUnique({
                where: {
                    modelId_componentId_qualityId: {
                        modelId, componentId, qualityId
                    }
                }
            })

            if (!service) {
                throw ApiError.badRequest({
                    i18n: 'service-not-found',
                    message: 'Service not found'
                })
            }

            const order = await prisma.order.create({
                data: {
                    serviceId: service.id,
                    name,
                    surname,
                    tel,
                    email,
                    cost: service.cost
                }
            })

            res.json({ ...order, service })
        }
        catch (e) {
            next(e);
        }
    }

    async get(req: OrderGetRequest, res: OrderCheckResponse, next: NextFunction) {
        try {
            const { tel } = req.query;

            if (!tel) {
                throw ApiError.badRequest({
                    i18n: 'tel-is-undefined',
                    message: 'Provided tel is undefined'
                })
            }

            if (res.locals.order?.tel === tel) {
                res.json(res.locals.order)
            } else {
                throw ApiError.badRequest({
                    i18n: 'tel-is-wrong',
                    message: 'The given tel is wrong'
                })
            }
        }
        catch (e) {
            next(e);
        }
    }

    async delete(req: OrderDeleteRequest, res: Response, next: NextFunction) {
        try {
            const deletedOrder = await prisma.order.delete({
                where: {
                    id: res.locals.order?.id
                }
            })
            res.json(deletedOrder)
        }
        catch (e) {
            next(e)
        }
    }

    async update(req: OrderUpdateRequest, res: OrderCheckResponse, next: NextFunction) {
        try {
            const { name, surname, tel, email, modelId, componentId, qualityId, cost, status } = req.body;
            const { id } = res.locals.order;
            const prevService = res.locals.order.service;

            const service = await prisma.service.findUnique({
                where: {
                    modelId_componentId_qualityId: {
                        modelId: modelId || prevService.modelId,
                        componentId: componentId || prevService.componentId,
                        qualityId: qualityId || prevService.qualityId
                    }
                }
            })

            if (!service) {
                throw ApiError.badRequest({
                    i18n: 'service-not-found',
                    message: 'Service not found'
                })
            }

            if (status) {
                await prisma.operation.create({
                    data: {
                        status,
                        orderId: id,
                        employeeId: 1
                    }
                })
            }

            const order = await prisma.order.update({
                where: {
                    id
                },
                data: {
                    name,
                    surname,
                    tel,
                    email,
                    serviceId: service.id,
                    cost: cost || service.cost
                },
                include: {
                    operations: true,
                    service: true
                }
            })

            res.json(order)
        }
        catch (e) {
            next(e)
        }
    }

    async getMany(req: OrdersGetRequest, res: Response, next: NextFunction) {
        try {
            const {
                id, name, surname, tel, email,
                modelId, componentId, qualityId,
                operation, createdFrom, createdTo,
                filter = OrderFilter.All, sort = Sort.Asc
            } = req.query;

            const orders = await prisma.order.findMany({
                where: {
                    id: id ? parseInt(id) : undefined,
                    name: {
                        contains: name
                    },
                    surname: {
                        contains: surname
                    },
                    tel: {
                        contains: tel
                    },
                    email: {
                        contains: email
                    },
                    service: {
                        modelId,
                        componentId,
                        qualityId
                    },
                    created: {
                        lte: createdTo,
                        gte: createdFrom
                    },
                    operations: getOperations(filter, operation)
                },
                include: {
                    service: true,
                    operations: true
                },
                orderBy: {
                    id: sort
                }
            })

            res.json(orders)
        }
        catch (e) {
            next(e)
        }
    }
}

export default new OrderController()