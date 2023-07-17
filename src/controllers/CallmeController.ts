import { Response, NextFunction } from "express"
import ApiError from "../errors/ApiError";
import { prisma } from "../lib/prisma";
import { CallmeCreateRequest, CallmeUpdateRequest, CallmesGetRequest, CallmeCheckRequest, CallmeCheckResponse, CallmeFilter, Sort } from "../interfaces";
import { getCheckedValue } from "../utils";

class CallmeController {
    async check(req: CallmeCheckRequest, res: CallmeCheckResponse, next: NextFunction) {
        try {
            const { id } = req.params;

            const callme = await prisma.callMe.findUnique({
                where: {
                    id: parseInt(id)
                }
            })

            if (callme) {
                res.locals.callme = callme;
                next();
            } else {
                throw ApiError.badRequest({
                    i18n: 'callme-not-found',
                    message: 'CallMe not found'
                })
            }
        }
        catch (e) {
            next(e)
        }
    }

    async create(req: CallmeCreateRequest, res: Response, next: NextFunction) {
        try {
            const { name, tel } = req.body;

            if (!tel || !name) {
                throw ApiError.badRequest({
                    i18n: 'empty-data',
                    message: 'Provided tel or name is undefined'
                })
            }

            const createdCall = await prisma.callMe.create({
                data: {
                    name,
                    tel,
                }
            })

            res.json(createdCall)
        }
        catch (e) {
            next(e);
        }
    }

    async get(req: CallmeCheckRequest, res: CallmeCheckResponse, next: NextFunction) {
        try {
            res.json(res.locals.callme)
        }
        catch (e) {
            next(e)
        }
    }

    async delete(req: CallmeCheckRequest, res: CallmeCheckResponse, next: NextFunction) {
        try {
            const deletedCallme = await prisma.callMe.delete({
                where: {
                    id: res.locals.callme.id
                }
            })

            if (!deletedCallme) {
                throw ApiError.badRequest({
                    i18n: 'callme-not-found',
                    message: 'CallMe not found'
                })
            }

            res.json(deletedCallme);
        }
        catch (e) {
            next(e)
        }
    }

    async update(req: CallmeUpdateRequest, res: CallmeCheckResponse, next: NextFunction) {
        try {
            const updatedCallme = await prisma.callMe.update({
                data: req.body,
                where: {
                    id: res.locals.callme.id
                }
            })

            if (!updatedCallme) {
                throw ApiError.badRequest({
                    i18n: 'callme-not-found',
                    message: 'CallMe not found'
                })
            }

            res.json(updatedCallme)
        }
        catch (e) {
            next(e)
        }
    }

    async getMany(req: CallmesGetRequest, res: Response, next: NextFunction) {
        try {
            const { id, take = '10', skip = '0', name, tel, createdFrom, createdTo, checkedFrom, checkedTo, sort = Sort.Asc, sortBy = "id", filter = CallmeFilter.All } = req.query;

            const callmes = await prisma.callMe.findMany({
                skip: parseInt(skip),
                take: parseInt(take),
                where: {
                    id: id ? parseInt(id) : undefined,
                    name: {
                        contains: name
                    },
                    tel: {
                        contains: tel
                    },
                    created: {
                        lte: createdTo,
                        gte: createdFrom
                    },
                    checked: getCheckedValue(filter, checkedFrom, checkedTo)
                },
                orderBy: {
                    [sortBy]: sort
                }
            })

            res.json(callmes)
        }
        catch (e) {
            next(e)
        }
    }
}

export default new CallmeController()