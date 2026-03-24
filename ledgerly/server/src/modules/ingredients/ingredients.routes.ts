import { Router } from "express";
import {
  createIngredientHandler,
  deleteIngredientHandler,
  getIngredientByIdHandler,
  getIngredientsHandler,
  updateIngredientHandler,
} from "./ingredients.controller";
import { authenticate } from "../../middleware/auth.middleware";

export const ingredientsRouter = Router();

ingredientsRouter.use(authenticate);

ingredientsRouter.post("/", createIngredientHandler);
ingredientsRouter.get("/", getIngredientsHandler);
ingredientsRouter.get("/:id", getIngredientByIdHandler);
ingredientsRouter.patch("/:id", updateIngredientHandler);
ingredientsRouter.delete("/:id", deleteIngredientHandler);
