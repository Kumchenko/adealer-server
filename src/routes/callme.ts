import { Router } from "express";
import CallmeController from "../controllers/CallmeController";

const router = Router();

// Middlewares
router.use('/:id', CallmeController.check)

// Handlers
router.post('/', CallmeController.create)
router.get('/:id', CallmeController.get)
router.patch('/:id', CallmeController.update)
router.delete('/:id', CallmeController.delete)
router.get('/', CallmeController.getMany)

export default router;