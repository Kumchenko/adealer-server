import { Router } from 'express'
import OrderController from '../controllers/OrderController'

const router = Router()
const authRouter = Router()

// Middlewares
authRouter.use('/:id', OrderController.check)

// Non-auth Handlers
router.post('/', OrderController.create)
router.get('/:id', OrderController.check, OrderController.getWithoutAuth)

// Auth Handlers
authRouter.get('/stats/', OrderController.getStats)
authRouter.get('/:id', OrderController.get)
authRouter.patch('/:id', OrderController.update)
authRouter.delete('/:id', OrderController.delete)
authRouter.get('/', OrderController.getMany)

export { router as orderRouter, authRouter as orderAuthRouter }
