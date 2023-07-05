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

            if (!name || !tel) {
                throw ApiError.internal('Name or tel is empty')
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