import { Router } from 'express'
import EmployeeController from '../controllers/EmployeeController'

const router = Router()
const authRouter = Router()

// Handlers
router.post('/login', EmployeeController.login, EmployeeController.authorization)
router.get('/refresh', EmployeeController.refresh, EmployeeController.authorization)
router.get('/logout', EmployeeController.logout)

// Handlers for routes which require Authorization
authRouter.get('/info', EmployeeController.info)

export { router as employeeRouter, authRouter as employeeAuthRouter }
