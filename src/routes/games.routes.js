import { Router } from "express";
import gameSchema from "../schemas/games.schema.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { getGames, postGames } from "../controllers/games.controller.js";

const gamesRouter = Router();

gamesRouter.post("/games", validateSchema(gameSchema), postGames);
gamesRouter.get("/games", getGames);

export default gamesRouter;