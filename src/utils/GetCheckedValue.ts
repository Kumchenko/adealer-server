import { CallmeFilter } from "../interfaces/callme";

export function getCheckedValue(filter: CallmeFilter, checkedFrom?: string, checkedTo?: string) {
    if (checkedFrom || checkedTo) {
        return {
            lte: checkedTo || new Date(),
            gte: checkedFrom || new Date(0)
        }
    }
    switch (filter) {
        case CallmeFilter.All: {
            return undefined;
        }
        case CallmeFilter.Unchecked: {
            return null;
        }
        case CallmeFilter.Checked: {
            return {
                lte: checkedTo || new Date(),
                gte: checkedFrom || new Date(0)
            }
        }
        default: {
            const _exhaustiveCheck: never = filter;
            return undefined;
        }
    }
}