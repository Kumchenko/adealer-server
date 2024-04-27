import { CorsOptions } from 'cors'
import { CookieOptions } from 'express'
import { isDev } from '../constants'

const defaultCookieOptions: CookieOptions = {
    sameSite: isDev ? 'lax' : 'none',
    secure: isDev ? undefined : true,
}

export const accessTokenMaxAge = 1000 * 60 * 15 // 15 Minutes
export const refreshTokenMaxAge = 1000 * 60 * 30 // 30 Minutes

export const corsOptions: CorsOptions = {
    origin: true,
    credentials: true,
}

export const accessTokenCookieOptions: CookieOptions = {
    maxAge: accessTokenMaxAge,
    httpOnly: true,
    ...defaultCookieOptions,
}

export const refreshTokenCookieOptions: CookieOptions = {
    maxAge: refreshTokenMaxAge,
    httpOnly: true,
    ...defaultCookieOptions,
}
