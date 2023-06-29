import { Router } from "express";
import OrderController from "../controllers/OrderController";
import ServiceController from "../controllers/ServiceController";

const router = Router();

// Middlewares
router.use('/:id', OrderController.check)
router.post('/', ServiceController.get)

// Handlers
router.get('/:id', OrderController.get)
router.get('/:id/', OrderController.getWithCheck)
router.post('/', OrderController.create)
router.delete('/:id', OrderController.delete)

export default router;