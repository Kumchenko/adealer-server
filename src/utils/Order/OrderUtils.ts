import { Prisma } from '@prisma/client'
import { EOrderFilter } from 'adealer-types'

export const getOrderFilter = (
    filter: EOrderFilter,
    apply?: string,
    from?: Date,
    to?: Date,
): Prisma.OperationListRelationFilter | undefined => {
    switch (filter) {
        case EOrderFilter.All: {
            return undefined
        }
        case EOrderFilter.Created: {
            return {
                none: {},
            }
        }
        case EOrderFilter.Process: {
            return {
                some: {
                    status: filter,
                    dateTime: {
                        lte: apply ? to : undefined,
                        gte: apply ? from : undefined,
                    },
                },
                none: {
                    status: EOrderFilter.Done,
                },
            }
        }
        case EOrderFilter.Done: {
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
