import { Router, type IRouter } from "express";
import healthRouter from "./health";
import donorsRouter from "./donors";
import bloodRequestsRouter from "./bloodRequests";
import authRouter from "./auth";
import appointmentsRouter from "./appointments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(donorsRouter);
router.use(bloodRequestsRouter);
router.use(authRouter);
router.use(appointmentsRouter);

export default router;
