import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import ApiError from "../errors/ApiError";
import { IOrderRequest, IOrderCreateRequest, IOrderGetRequest } from "../interfaces";

class OrderController {
    async check(req: IOrderRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (!id) {
                throw ApiError.badRequest({
                    i18n: 'id-is-undefined',
                    message: 'Provided id is undefined'
                })
            }

            const foundOrder = await prisma.order.findUnique({
                where: {
                    id: parseInt(id)
                },
                include: {
                    operations: true,
                    service: true
                }
            })

            if (foundOrder) {
                const { service: { id, cost, ...otherServiceData }, ...order } = foundOrder;
                req.order = {
                    ...order,
                    ...otherServiceData
                };
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

    async create(req: IOrderCreateRequest, res: Response, next: NextFunction) {
        try {
            const {
                name,
                surname,
                tel,
                email,
                modelId,
                qualityId,
                componentId
            } = req.body;

            const service = await prisma.service.findUnique({
                where: {
                    modelId_componentId_qualityId: {
                        modelId,
                        qualityId,
                        componentId
                    }
                }
            })

            if (!service) {
                throw ApiError.badRequest({
                    i18n: 'service-not-found',
                    message: 'Service not found'
                })
            }

            const createdOrder = await prisma.order.create({
                data: {
                    serviceId: service.id,
                    name,
                    surname,
                    tel,
                    email,
                    cost: service.cost
                }
            })

            res.json({ ...createdOrder, modelId, componentId, qualityId })
        }
        catch (e) {
            next(e);
        }
    }

    async get(req: IOrderGetRequest, res: Response, next: NextFunction) {
        try {
            const { tel } = req.query;

            if (!tel) {
                throw ApiError.badRequest({
                    i18n: 'tel-is-undefined',
                    message: 'Provided tel is undefined'
                })
            }

            if (req.order?.tel === tel) {
                res.json(req.order)
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

    async delete(req: IOrderRequest, res: Response, next: NextFunction) {
        try {
            const deletedOrder = await prisma.order.delete({
                where: {
                    id: req.order?.id
                }
            })
            res.json(deletedOrder)
        }
        catch (e) {
            next(e)
        }
    }
}

export default new OrderController()