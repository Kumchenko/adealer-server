import { Router } from "express";
import CallmeController from "../controllers/CallmeController";

const router = Router();

// Handlers
router.post('/', CallmeController.create)

export default router;