import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import ApiError from '../errors/ApiError'
import { ComponentsGetRequest } from '../interfaces'

class ComponentController {
    async getMany(req: Request, res: Response, next: NextFunction) {
        try {
            const components = await prisma.component.findMany()
            const componentIds = components.map(component => component.id)
            res.json(componentIds)
        } catch (e) {
            next(e)
        }
    }

    async getManyByModel(req: ComponentsGetRequest, res: Response, next: NextFunction) {
        try {
            const { modelId } = req.params

            if (!modelId) {
                throw ApiError.badRequest('model-id-is-undefined')
            }

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
