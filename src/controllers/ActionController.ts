import { prisma } from '../lib/prisma'
import { NextFunction, Request, Response } from 'express'
import ApiError from '../errors/ApiError'
import { IActionsGetRequest } from '../models/Action'
import { EActionSortByField, EActionMethod } from 'adealer-types'
import { Prisma } from '@prisma/client'

const LOGGABLE_METHODS = Object.values(EActionMethod)

class ActionController {
    log = async (login: string, req: Request) => {
        try {
            if (LOGGABLE_METHODS.includes(req.method as EActionMethod)) {
                await prisma.action.create({
                    data: {
                        login,
                        action: req.originalUrl,
                        method: req.method,
                    },
                })
            }
        } catch (e) {
            throw ApiError.internal('Error occured when tried to log!')
        }
    }
    async getMany(req: IActionsGetRequest, res: Response, next: NextFunction) {
        try {
            const {
                login,
                method,
                page: pageString = '-1',
                perPage: perPageString = '-1',
                from,
                to,
                sortDesc = false,
                sortBy = EActionSortByField.DATE,
            } = req.query

            const page = parseInt(pageString)
            const perPage = parseInt(perPageString)

            const isPagination = page > 0 && perPage > 0

            const query: Prisma.ActionFindManyArgs = {
                where: {
                    login: { contains: login },
                    method: { contains: method },
                    date: {
                        lte: to ? new Date(to) : undefined,
                        gte: from ? new Date(from) : undefined,
                    },
                },
                orderBy: {
                    [sortBy]: sortDesc ? 'desc' : 'asc',
                },
                skip: isPagination ? (page - 1) * perPage : undefined,
                take: isPagination ? perPage : undefined,
            }

            const [actions, count] = await prisma.$transaction([
                prisma.action.findMany(query),
                prisma.action.count({ where: query.where }),
            ])

            res.json({
                pagination: {
                    pages: isPagination ? Math.ceil(count / perPage) : 1,
                    page: isPagination ? page : 1,
                    total: count,
                    perPage: isPagination ? perPage : count,
                },
                data: actions,
            })
        } catch (e) {
            next(e)
        }
    }
}

export default new ActionController()
