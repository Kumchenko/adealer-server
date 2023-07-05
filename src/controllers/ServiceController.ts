import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import ApiError from "../errors/ApiError";
import { IServicesByModelComponentRequest } from "../interfaces";

class ServiceController {
    async getMany(req: IServicesByModelComponentRequest, res: Response, next: NextFunction) {
        try {
            const { modelId, componentId } = req.query;

            if (!modelId || !componentId) {
                throw ApiError.badRequest('Provided modelId or componentId is undefined')
            }

            const qualities = await prisma.service.findMany({
                where: {
                    modelId,
                    componentId
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