import { Router } from "express";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { getCustomers, getCustomersById, postCostumer } from "../controllers/customers.controller.js";
import customerSchema from "../schemas/costumers.schema.js";

const customersRouter = Router();

customersRouter.post("/customers", validateSchema(customerSchema), postCostumer);
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersById);

export default customersRouter;