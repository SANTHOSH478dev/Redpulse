import { Router, type IRouter } from "express";
import healthRouter from "./health";
import donorsRouter from "./donors";
import bloodRequestsRouter from "./bloodRequests";

const router: IRouter = Router();

router.use(healthRouter);
router.use(donorsRouter);
router.use(bloodRequestsRouter);

export default router;
