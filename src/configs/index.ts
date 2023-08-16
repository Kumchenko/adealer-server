import { CorsOptions } from 'cors'

export const accessTokenMaxAge = 1000 * 60 * 15 // 15 Minutes
export const refreshTokenMaxAge = 1000 * 60 * 30 // 30 Minutes

export const corsOptions: CorsOptions = {
    origin: true,
    credentials: true,
}
