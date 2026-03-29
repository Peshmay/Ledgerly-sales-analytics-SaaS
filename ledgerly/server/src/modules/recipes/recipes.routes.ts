import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createRecipeItemHandler,
  deleteRecipeItemHandler,
  getRecipeByCocktailIdHandler,
} from "./recipes.controller";

export const recipesRouter = Router();

recipesRouter.use(authenticate);

recipesRouter.post("/", createRecipeItemHandler);
recipesRouter.get("/cocktails/:cocktailId", getRecipeByCocktailIdHandler);
recipesRouter.delete("/:id", deleteRecipeItemHandler);
