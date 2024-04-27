import { NextFunction, Response } from 'express'
import { prisma } from '../lib/prisma'
import { IServicesGetRequest } from '../models'

class ServiceController {
    async getMany(req: IServicesGetRequest, res: Response, next: NextFunction) {
        try {
            const { modelId, componentId, qualityId } = req.query
            const services = await prisma.service.findMany({
                where: {
                    modelId,
                    componentId,
                    qualityId,
                },
            })

            res.json(services)
        } catch (e) {
            next(e)
        }
    }
}

export default new ServiceController()
