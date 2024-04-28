import { IEmployeeData } from 'adealer-types'
import { accessTokenMaxAge, refreshTokenMaxAge } from '../configs'
import { Jwt } from '../utils'

export const signToken = (employee: IEmployeeData) => {
    const accessToken = Jwt.sign(employee, {
        expiresIn: accessTokenMaxAge,
    })
    const refreshToken = Jwt.sign(employee, {
        expiresIn: refreshTokenMaxAge,
    })

    return {
        accessToken,
        refreshToken,
    }
}
