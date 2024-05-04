import { Router } from 'express'
import EmployeeController from '../controllers/EmployeeController'
import { RoleMiddleware } from '../middlewares/RoleMiddleware'

const router = Router()
const authRouter = Router()

// Handlers
router.post('/login', EmployeeController.login, EmployeeController.authorization)
router.post('/refresh', EmployeeController.refresh, EmployeeController.authorization)

// Handlers for routes which require Authorization
authRouter.get('/info', EmployeeController.info)
authRouter.post('/block', RoleMiddleware(['ADMIN']), EmployeeController.block)
authRouter.get('/all', RoleMiddleware(['ADMIN']), EmployeeController.getMany)

export { router as employeeRouter, authRouter as employeeAuthRouter }
