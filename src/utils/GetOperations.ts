import { Status } from "@prisma/client";
import { OrderFilter } from "../interfaces";

export function getOperations(filter: OrderFilter, operation?: Status) {
    switch (filter) {
        case OrderFilter.All: {
            return undefined
        }
        case OrderFilter.Created: {
            return {
                none: {}
            }
        }
        default: {
            const _exhaustiveCheck: never = filter;
            if (operation) {
                return {
                    some: {
                        status: operation
                    }
                }
            } else undefined
        }
    }
}