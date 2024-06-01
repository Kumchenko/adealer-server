import { ETimeframe } from 'adealer-types'
import { set, subDays, subMonths, subWeeks, addDays } from 'date-fns'
import { IDatePeriod } from '../../models'

export const getDatePeriods = (timeframe: ETimeframe, toUncleaned: Date): IDatePeriod[] => {
    const to = addDays(
        set(toUncleaned, {
            hours: 0,
            minutes: 0,
            seconds: 1,
            milliseconds: 0,
        }),
        1,
    )

    switch (timeframe) {
        case ETimeframe.WEEK: {
            const res = new Array(7).fill(0)
            return res.map((_, i, arr) => [subDays(to, arr.length - i), subDays(to, arr.length - i - 1)])
        }
        case ETimeframe.MONTH: {
            const res = new Array(4).fill(0)
            return res.map((_, i, arr) => [subWeeks(to, arr.length - i), subWeeks(to, arr.length - i - 1)])
        }
        case ETimeframe.YEAR: {
            const res = new Array(12).fill(0)
            return res.map((_, i, arr) => [subMonths(to, arr.length - i), subMonths(to, arr.length - i - 1)])
        }
        default:
            const _check: never = timeframe
            throw Error('Exhaustive check for Timeframe failed')
    }
}
