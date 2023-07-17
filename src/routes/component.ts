import { Router } from "express";
import ComponentController from "../controllers/ComponentController";

const router = Router();

// Handlers
router.get('/:modelId', ComponentController.getMany)

export default router;