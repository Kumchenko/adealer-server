import { Prisma } from '@prisma/client'
import { IDatePeriod } from '../../models'

export const getStatsQueries = (periods: IDatePeriod[]): Prisma.CallMeCountArgs[] =>
    periods.map(([from, to]) => ({
        where: {
            created: {
                lte: to,
                gte: from,
            },
        },
    }))
