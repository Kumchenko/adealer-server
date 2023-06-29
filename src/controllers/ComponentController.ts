import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import ApiError from "../errors/ApiError";
import { IComponentsQuery } from "../interfaces";

interface IComponentsRequest extends Request {
    query: IComponentsQuery
}

class ComponentController {
    async getMany(req: IComponentsRequest, res: Response, next: NextFunction) {
        try {
            const { model } = req.query;

            if (!model) {
                throw ApiError.badRequest('Provided model is undefined')
            }

            const components = await prisma.component.findMany({
                where: {
                    services: {
                        some: {
                            modelId: model
                        }
                    }
                }
            })

            const arrComponents = components.map(component => component.id);

            if (components.length === 0) {
                throw ApiError.internal('Not found components for this model')
            }

            res.json(arrComponents)
        }
        catch (e) {
            next(e)
        }
    }
}

export default new ComponentController()