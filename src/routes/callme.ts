import { Router } from 'express'
import CallMeController from '../controllers/CallMeController'

const router = Router()
const authRouter = Router()

// Middlewares
authRouter.use('/callme/:id', CallMeController.check)

// Non-auth Handlers
router.post('/', CallMeController.create)

// Auth Handlers
authRouter.get('/stats/', CallMeController.getStats)
authRouter.get('/callme/:id', CallMeController.get)
authRouter.patch('/callme/:id', CallMeController.update)
authRouter.delete('/callme/:id', CallMeController.delete)
authRouter.get('/', CallMeController.getMany)

export { router as callmeRouter, authRouter as callmeAuthRouter }
