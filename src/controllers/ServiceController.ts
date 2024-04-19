import { NextFunction, Response } from 'express'
import { prisma } from '../lib/prisma'
import { ServicesGetRequest } from '../interfaces'

class ServiceController {
    async getMany(req: ServicesGetRequest, res: Response, next: NextFunction) {
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
