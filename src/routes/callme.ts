import { Router } from 'express'
import CallMeController from '../controllers/CallMeController'
import { RoleMiddleware } from '../middlewares/RoleMiddleware'

const router = Router()
const authRouter = Router()

// Non-auth Handlers
router.post('/', CallMeController.create)

// Auth Handlers
authRouter.get('/stats/', RoleMiddleware(['ADMIN']), CallMeController.getStats)

authRouter.use('/:id', CallMeController.check)
authRouter.get('/:id', CallMeController.get)
authRouter.patch('/:id', CallMeController.update)
authRouter.delete('/:id', RoleMiddleware(['ADMIN']), CallMeController.delete)

authRouter.get('/', CallMeController.getMany)

export { router as callmeRouter, authRouter as callmeAuthRouter }
