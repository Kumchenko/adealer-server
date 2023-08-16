import { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import ApiError from '../errors/ApiError'
import { ComponentsGetRequest } from '../interfaces'

class ComponentController {
    async getMany(req: Request, res: Response, next: NextFunction) {
        try {
            const components = await prisma.component.findMany()

            if (components.length === 0) {
                throw ApiError.internal({
                    i18n: 'components-not-found',
                    message: `Components not found`,
                })
            }

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
                throw ApiError.badRequest({
                    i18n: 'model-id-is-undefined',
                    message: 'Provided modelId is undefined',
                })
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

            if (components.length === 0) {
                throw ApiError.internal({
                    i18n: 'components-not-found',
                    message: `Components for this model not found`,
                })
            }

            const componentIds = components.map(component => component.id)

            res.json(componentIds)
        } catch (e) {
            next(e)
        }
    }
}

export default new ComponentController()
