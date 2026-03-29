import { z } from "zod";

export const createRecipeItemSchema = z.object({
  cocktailId: z.string().min(1, "Cocktail ID is required"),
  ingredientId: z.string().min(1, "Ingredient ID is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unit: z.enum(["ML", "CL", "L", "G", "KG", "PCS"]),
});

export type CreateRecipeItemInput = z.infer<typeof createRecipeItemSchema>;
