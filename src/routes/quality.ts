import { Router } from 'express'
import QualityController from '../controllers/QualityController'

const router = Router()

// Handlers
router.get('/', QualityController.getMany)

export default router
