import { Router } from 'express'
import ModelController from '../controllers/ModelController'

const router = Router()

// Handlers
router.get('/', ModelController.getMany)

export default router
