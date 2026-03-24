import { Request, Response } from "express";
import { ZodError } from "zod";
import {
  createIngredient,
  deleteIngredient,
  getIngredientById,
  getIngredients,
  updateIngredient,
} from "./ingredients.service";
import {
  createIngredientSchema,
  updateIngredientSchema,
} from "./ingredients.schema";

export async function createIngredientHandler(req: Request, res: Response) {
  try {
    const data = createIngredientSchema.parse(req.body);
    const ingredient = await createIngredient(data);

    return res.status(201).json({
      success: true,
      message: "Ingredient created successfully",
      data: ingredient,
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
        error instanceof Error ? error.message : "Failed to create ingredient",
    });
  }
}

export async function getIngredientsHandler(_req: Request, res: Response) {
  const ingredients = await getIngredients();

  return res.status(200).json({
    success: true,
    data: ingredients,
  });
}

export async function getIngredientByIdHandler(req: Request, res: Response) {
  const ingredient = await getIngredientById(req.params.id);

  if (!ingredient) {
    return res.status(404).json({
      success: false,
      message: "Ingredient not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: ingredient,
  });
}

export async function updateIngredientHandler(req: Request, res: Response) {
  try {
    const data = updateIngredientSchema.parse(req.body);
    const ingredient = await updateIngredient(req.params.id, data);

    return res.status(200).json({
      success: true,
      message: "Ingredient updated successfully",
      data: ingredient,
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
        error instanceof Error ? error.message : "Failed to update ingredient",
    });
  }
}

export async function deleteIngredientHandler(req: Request, res: Response) {
  try {
    await deleteIngredient(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Ingredient deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete ingredient",
    });
  }
}
