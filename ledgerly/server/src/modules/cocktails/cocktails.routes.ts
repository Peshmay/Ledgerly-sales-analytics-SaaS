import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createCocktailHandler,
  deleteCocktailHandler,
  getCocktailByIdHandler,
  getCocktailsHandler,
  updateCocktailHandler,
} from "./cocktails.controller";

export const cocktailsRouter = Router();

cocktailsRouter.use(authenticate);

cocktailsRouter.post("/", createCocktailHandler);
cocktailsRouter.get("/", getCocktailsHandler);
cocktailsRouter.get("/:id", getCocktailByIdHandler);
cocktailsRouter.patch("/:id", updateCocktailHandler);
cocktailsRouter.delete("/:id", deleteCocktailHandler);
