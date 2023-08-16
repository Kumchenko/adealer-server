import { NextFunction, Response } from 'express'
import { prisma } from '../lib/prisma'
import ApiError from '../errors/ApiError'
import { ServicesGetRequest } from '../interfaces'

class ServiceController {
    async getMany(req: ServicesGetRequest, res: Response, next: NextFunction) {
        try {
            const services = await prisma.service.findMany({
                where: req.query,
            })

            if (!services) {
                throw ApiError.forbidden({
                    i18n: 'services-not-found',
                    message: 'Services not found',
                })
            }

            res.json(services)
        } catch (e) {
            next(e)
        }
    }
}

export default new ServiceController()
