import { Router } from "express";
import OrderController from "../controllers/OrderController";

const router = Router();

// Middlewares
router.use('/:id', OrderController.check)

// Handlers
router.get('/:id', OrderController.get)
router.post('/', OrderController.create)
router.delete('/:id', OrderController.delete)

export default router;