import { Router } from "express";
import validadeSchema from "../middlewares/validateSchema.middleware.js";
import rentalsSchema from "../schemas/rentals.schema.js";
import { deleteRental, endRental, getRentals, postRentals } from "../controllers/rentals.controller.js";

const rentsRouter = Router();

rentsRouter.post("/rentals", validadeSchema(rentalsSchema), postRentals);
rentsRouter.get("/rentals", getRentals);
rentsRouter.post("/rentals/:id/return", endRental);
rentsRouter.delete("/rentals/:id", deleteRental);

export default rentsRouter;
