import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import ApiError from '../errors/ApiError'

class ModelController {
    async getMany(req: Request, res: Response, next: NextFunction) {
        try {
            const models = await prisma.model.findMany({
                orderBy: {
                    id: 'asc',
                },
            })

            res.json(models.map(model => model.id))
        } catch (e) {
            next(e)
        }
    }
}

export default new ModelController()
