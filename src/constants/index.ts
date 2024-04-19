export const isDev = (process.env.NODE_ENV || 'production') === 'development'
export const API_ERROR = 'ApiError' as const
