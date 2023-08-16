import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

class QualityController {
    async getMany(req: Request, res: Response, next: NextFunction) {
        try {
            const qualities = await prisma.quality.findMany()
            const qualityIds = qualities.map(quality => quality.id)
            res.json(qualityIds)
        } catch (e) {
            next(e)
        }
    }
}

export default new QualityController()
