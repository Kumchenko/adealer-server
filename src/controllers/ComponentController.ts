import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import ApiError from "../errors/ApiError";
import { IComponentsByModelRequest } from "../interfaces";

class ComponentController {
    async getManyByModel(req: IComponentsByModelRequest, res: Response, next: NextFunction) {
        try {
            const { modelId } = req.params;

            if (!modelId) {
                throw ApiError.badRequest('Provided modelId is undefined')
            }

            const components = await prisma.component.findMany({
                where: {
                    services: {
                        some: {
                            modelId
                        }
                    }
                }
            })

            const componentIds = components.map(component => component.id);

            if (components.length === 0) {
                throw ApiError.internal('Not found components for this modelId')
            }

            res.json(componentIds)
        }
        catch (e) {
            next(e)
        }
    }
}

export default new ComponentController()