import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { IOrderBody, IOrderParams, IOrderQuery } from "../interfaces";
import ApiError from "../errors/ApiError";
import { Order, Service } from "@prisma/client";

interface IOrderRequest extends Request {
    params: IOrderParams
    query: IOrderQuery
    body: IOrderBody
    order?: Order
    service?: Service
}

class OrderController {
    async check(req: IOrderRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (!id) {
                throw ApiError.badRequest('Provided id is undefined')
            }

            const order = await prisma.order.findUnique({
                where: {
                    id: parseInt(id)
                }
            })

            if (order) {
                req.order = order;
                next();
            } else {
                throw ApiError.badRequest('Order not found')
            }
        }
        catch (e) {
            next(e);
        }
    }

    async create(req: IOrderRequest, res: Response, next: NextFunction) {
        try {
            const {
                name,
                surname,
                tel,
                email
            } = req.body;

            if (!req.service) {
                throw ApiError.internal('Received empty service data')
            }

            const createdOrder = await prisma.order.create({
                data: {
                    serviceId: req.service?.id,
                    name,
                    surname,
                    tel,
                    email,
                    cost: req.service?.cost
                }
            })

            res.json(createdOrder)
        }
        catch (e) {
            next(e);
        }
    }

    async getWithCheck(req: IOrderRequest, res: Response, next: NextFunction) {
        try {
            const { tel } = req.query;

            if (!tel) {
                throw ApiError.badRequest('Provided tel is undefined')
            }

            if (req.order?.tel === tel) {
                res.json(req.order)
            } else {
                throw ApiError.badRequest('The given tel is wrong')
            }
        }
        catch (e) {
            next(e);
        }
    }

    async get(req: IOrderRequest, res: Response, next: NextFunction) {
        try {
            res.json(req.order)
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