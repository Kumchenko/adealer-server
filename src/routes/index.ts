import { Router } from "express";
import orderRouter from "./order";
import componentRouter from "./component";
import serviceRouter from "./service";

const router = Router();

// Keeping routers together
router.use('/order', orderRouter)
router.use('/component', componentRouter)
router.use('/service', serviceRouter)

export default router;