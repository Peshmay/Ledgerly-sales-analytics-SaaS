import { Request, Response } from "express";
import { ZodError } from "zod";
import {
  createCocktail,
  deleteCocktail,
  getCocktailById,
  getCocktails,
  getCocktailCostSummary,
  updateCocktail,
} from "./cocktails.service";
import { createCocktailSchema, updateCocktailSchema } from "./cocktails.schema";

export async function createCocktailHandler(req: Request, res: Response) {
  try {
    const data = createCocktailSchema.parse(req.body);
    const cocktail = await createCocktail(data);

    return res.status(201).json({
      success: true,
      message: "Cocktail created successfully",
      data: cocktail,
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
        error instanceof Error ? error.message : "Failed to create cocktail",
    });
  }
}

export async function getCocktailsHandler(_req: Request, res: Response) {
  const cocktails = await getCocktails();

  return res.status(200).json({
    success: true,
    data: cocktails,
  });
}

export async function getCocktailByIdHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const cocktail = await getCocktailById(id);

  if (!cocktail) {
    return res.status(404).json({
      success: false,
      message: "Cocktail not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: cocktail,
  });
}

export async function getCocktailCostSummaryHandler(
  req: Request,
  res: Response,
) {
  const id = req.params.id as string;
  const summary = await getCocktailCostSummary(id);

  if (!summary) {
    return res.status(404).json({
      success: false,
      message: "Cocktail not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: summary,
  });
}

export async function updateCocktailHandler(req: Request, res: Response) {
  try {
    const data = updateCocktailSchema.parse(req.body);
    const id = req.params.id as string;
    const cocktail = await updateCocktail(id, data);

    return res.status(200).json({
      success: true,
      message: "Cocktail updated successfully",
      data: cocktail,
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
        error instanceof Error ? error.message : "Failed to update cocktail",
    });
  }
}

export async function deleteCocktailHandler(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteCocktail(id);

    return res.status(200).json({
      success: true,
      message: "Cocktail deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete cocktail",
    });
  }
}
