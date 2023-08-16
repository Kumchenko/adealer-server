import { Prisma } from '@prisma/client'
import { OrderFilter } from '../interfaces'

export function getOrderFilter(
    filter: OrderFilter,
    apply?: string,
    from?: Date,
    to?: Date,
): Prisma.OperationListRelationFilter | undefined {
    switch (filter) {
        case OrderFilter.All: {
            return undefined
        }
        case OrderFilter.Created: {
            return {
                none: {},
            }
        }
        case OrderFilter.Process: {
            return {
                some: {
                    status: filter,
                    dateTime: {
                        lte: apply ? to : undefined,
                        gte: apply ? from : undefined,
                    },
                },
                none: {
                    status: OrderFilter.Done,
                },
            }
        }
        case OrderFilter.Done: {
            return {
                some: {
                    status: filter,
                    dateTime: {
                        lte: apply ? to : undefined,
                        gte: apply ? from : undefined,
                    },
                },
            }
        }
        default: {
            const _exhaustiveCheck: never = filter
            return undefined
        }
    }
}
