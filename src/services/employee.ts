import { accessTokenMaxAge, refreshTokenMaxAge } from '../configs'
import { Jwt } from '../utils'
import { EmployeeData } from '../models'

export const signToken = (employee: EmployeeData) => {
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
