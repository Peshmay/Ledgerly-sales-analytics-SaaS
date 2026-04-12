import { Request, Response } from "express";
import { ZodError } from "zod";
import {
  createRecipeItem,
  deleteRecipeItem,
  getRecipeByCocktailId,
} from "./recipes.service";
import { createRecipeItemSchema } from "./recipes.schema";

export async function createRecipeItemHandler(req: Request, res: Response) {
  try {
    const data = createRecipeItemSchema.parse(req.body);
    const recipeItem = await createRecipeItem(data);

    return res.status(201).json({
      success: true,
      message: "Recipe item created successfully",
      data: recipeItem,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create recipe item",
    });
  }
}

export async function getRecipeByCocktailIdHandler(
  req: Request,
  res: Response,
) {
  const cocktailId = req.params.cocktailId as string;
  const recipeItems = await getRecipeByCocktailId(cocktailId);

  return res.status(200).json({
    success: true,
    data: recipeItems,
  });
}

export async function deleteRecipeItemHandler(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteRecipeItem(id);

    return res.status(200).json({
      success: true,
      message: "Recipe item deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete recipe item",
    });
  }
}
