import { Request, Response, NextFunction } from "express"
import ApiError from "../errors/ApiError";
import { prisma } from "../lib/prisma";
import { ICallmeCreateRequest } from "../interfaces";

class CallmeController {
    async create(req: ICallmeCreateRequest, res: Response, next: NextFunction) {
        try {
            const {
                name,
                tel
            } = req.body;

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
}

export default new CallmeController()