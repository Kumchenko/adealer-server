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

            res.json(services)
        } catch (e) {
            next(e)
        }
    }
}

export default new ServiceController()
