import { Router } from 'express'
import OrderController from '../controllers/OrderController'

const router = Router()
const authRouter = Router()

// Middlewares
authRouter.use('/order/:id', OrderController.check)

// Non-auth Handlers
router.post('/', OrderController.create)
router.get('/order/:id', OrderController.check, OrderController.getWithoutAuth)

// Auth Handlers
authRouter.get('/stats/', OrderController.getStats)
authRouter.get('/order/:id', OrderController.get)
authRouter.patch('/order/:id', OrderController.update)
authRouter.delete('/order/:id', OrderController.delete)
authRouter.get('/', OrderController.getMany)

export { router as orderRouter, authRouter as orderAuthRouter }
