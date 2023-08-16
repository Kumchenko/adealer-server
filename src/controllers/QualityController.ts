import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import ApiError from '../errors/ApiError'

class QualityController {
    async getMany(req: Request, res: Response, next: NextFunction) {
        try {
            const qualities = await prisma.quality.findMany()

            if (qualities.length === 0) {
                throw ApiError.forbidden({
                    i18n: 'qualities-not-found',
                    message: 'Qualities not found',
                })
            }

            const qualityIds = qualities.map(quality => quality.id)
            res.json(qualityIds)
        } catch (e) {
            next(e)
        }
    }
}

export default new QualityController()
