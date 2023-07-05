import { Router } from "express";
import modelRouter from "./model";
import orderRouter from "./order";
import componentRouter from "./component";
import serviceRouter from "./service";
import callmeRouter from "./callme";

const router = Router();

// Keeping routers together
router.use('/model', modelRouter)
router.use('/order', orderRouter)
router.use('/component', componentRouter)
router.use('/service', serviceRouter)
router.use('/callme', callmeRouter)
router.use('/health', (req, res) => res.status(200).json({ message: 'OK' }))

export default router;