import { Router } from 'express'
import CallmeController from '../controllers/CallmeController'

const router = Router()
const authRouter = Router()

// Middlewares
authRouter.use('/callme/:id', CallmeController.check)

// Non-auth Handlers
router.post('/', CallmeController.create)

// Auth Handlers
authRouter.get('/stats/', CallmeController.getStats)
authRouter.get('/callme/:id', CallmeController.get)
authRouter.patch('/callme/:id', CallmeController.update)
authRouter.delete('/callme/:id', CallmeController.delete)
authRouter.get('/', CallmeController.getMany)

export { router as callmeRouter, authRouter as callmeAuthRouter }
