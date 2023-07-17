import { Router } from "express";
import OrderController from "../controllers/OrderController";

const router = Router();

// Middlewares
router.use('/:id', OrderController.check)

// Handlers
router.post('/', OrderController.create)
router.get('/:id', OrderController.get)
router.patch('/:id', OrderController.update)
router.delete('/:id', OrderController.delete)
router.get('/', OrderController.getMany)

export default router;