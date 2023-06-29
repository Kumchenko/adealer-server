import { Router } from "express";
import ServiceController from "../controllers/ServiceController";

const router = Router();

// Handlers
router.get('/', ServiceController.getMany)

export default router;