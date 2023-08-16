import ApiError from '../errors/ApiError'

export function env(variable: string) {
    const value = process.env[variable]
    if (value) {
        return value
    } else {
        throw ApiError.internal({
            i18n: 'variable-not-found',
            message: `Variable ${variable} not found`,
        })
    }
}
