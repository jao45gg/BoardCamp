import { Router } from "express";
import gamesRouter from "./games.routes.js";
import customersRouter from "./customers.routes.js";
import rentsRouter from "./rents.routes.js";

const router = Router();
router.use(gamesRouter);
router.use(customersRouter);
router.use(rentsRouter);

export default router;