import { Router } from 'express'
import { orderRouter, orderAuthRouter } from './order'
import { callmeRouter, callmeAuthRouter } from './callme'
import modelRouter from './model'
import componentRouter from './component'
import serviceRouter from './service'
import qualityRouter from './quality'
import { employeeRouter, employeeAuthRouter } from './employee'
import AuthMiddleware from '../middlewares/AuthMiddleware'

const router = Router()
const authRouter = Router()

// Keeping non-auth routers together
router.use('/models', modelRouter)
router.use('/components', componentRouter)
router.use('/qualities', qualityRouter)
router.use('/services', serviceRouter)
router.use('/orders', orderRouter)
router.use('/callmes', callmeRouter)
router.use('/employee', employeeRouter)
router.use('/health', (req, res) => res.status(200).json({ message: 'OK' }))

// Keeping routers with auth together
authRouter.use('/orders', orderAuthRouter)
authRouter.use('/callmes', callmeAuthRouter)
authRouter.use('/employee', employeeAuthRouter)

// Keeping non-auth and auth routers together
const globalRouter = Router().use('/', router).use('/auth', AuthMiddleware, authRouter)

export default globalRouter
