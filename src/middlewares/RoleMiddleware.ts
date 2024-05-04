import { Role } from '@prisma/client'
import { IEmployeeResponse } from '../models'
import { Request, NextFunction } from 'express'
import ApiError from '../errors/ApiError'

export const RoleMiddleware =
    (roles?: Role[]) => async (req: Request<any>, res: IEmployeeResponse, next: NextFunction) => {
        try {
            const { employee } = res.locals

            // If there are some roles for performing Action and Employee's role doesn't fit requirements
            if (roles && !roles.includes(employee.role as Role)) {
                throw ApiError.forbidden('insufficient-access') // Throw forbidden Error
            }

            // Success - Go to next middleware
            next()
        } catch (e) {
            next(e)
        }
    }
