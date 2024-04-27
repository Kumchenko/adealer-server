import { Router } from 'express'
import CallMeController from '../controllers/CallMeController'

const router = Router()
const authRouter = Router()

// Middlewares
authRouter.use('/:id', CallMeController.check)

// Non-auth Handlers
router.post('/', CallMeController.create)

// Auth Handlers

authRouter.get('/:id', CallMeController.get)
authRouter.patch('/:id', CallMeController.update)
authRouter.delete('/:id', CallMeController.delete)
authRouter.get('/stats/', CallMeController.getStats)
authRouter.get('/', CallMeController.getMany)

export { router as callmeRouter, authRouter as callmeAuthRouter }
