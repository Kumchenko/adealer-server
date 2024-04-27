import { Router } from 'express'
import ComponentController from '../controllers/ComponentController'

const router = Router()

// Handlers
router.get('/', ComponentController.getMany)

export default router
