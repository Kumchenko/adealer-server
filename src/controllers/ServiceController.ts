import { NextFunction, Request, Response } from "express";
import { IServiceBody, IServicesQuery } from "../interfaces";
import { prisma } from "../lib/prisma";
import ApiError from "../errors/ApiError";
import { Service } from "@prisma/client";

interface IServiceRequest extends Request {
    service?: Service
    body: IServiceBody,
    query: IServicesQuery
}

class ServiceController {
    async get(req: IServiceRequest, res: Response, next: NextFunction) {
        try {
            const {
                model,
                quality,
                component
            } = req.body;

            const service = await prisma.service.findUnique({
                where: {
                    modelId_componentId_qualityId: {
                        modelId: model,
                        qualityId: quality,
                        componentId: component
                    }
                }
            })

            if (!service) {
                throw ApiError.internal('Service not found')
            }
            if (req.baseUrl === '/api/service') {
                res.json(service);
            } else {
                req.service = service;
                next();
            }
        }
        catch (e) {
            next(e);
        }
    }

    async getMany(req: IServiceRequest, res: Response, next: NextFunction) {
        try {
            const { model, component } = req.query;

            if (!model || !component) {
                throw ApiError.badRequest('Provided model or component is undefined')
            }

            const qualities = await prisma.service.findMany({
                where: {
                    modelId: model,
                    componentId: component
                }
            })

            res.json(qualities);
        }
        catch (e) {
            next(e)
        }
    }
}

export default new ServiceController()