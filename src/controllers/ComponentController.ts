import { NextFunction, Response } from 'express'
import { prisma } from '../lib/prisma'
import { IComponentsGetRequest } from '../models'

class ComponentController {
    async getMany(req: IComponentsGetRequest, res: Response, next: NextFunction) {
        try {
            const { modelId } = req.query

            const components = await prisma.component.findMany({
                where: {
                    services: {
                        some: {
                            modelId,
                        },
                    },
                },
            })

            const componentIds = components.map(component => component.id)
            res.json(componentIds)
        } catch (e) {
            next(e)
        }
    }
}

export default new ComponentController()
