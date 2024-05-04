import { Router } from 'express'
import ActionController from '../controllers/ActionController'

const authRouter = Router()

// Auth Handlers
authRouter.get('/', ActionController.getMany)

export { authRouter as actionAuthRouter }
