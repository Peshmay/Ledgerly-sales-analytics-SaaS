import { z } from "zod";

export const createCocktailSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  salePrice: z.number().min(0.01, "Sale price must be greater than 0"),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateCocktailSchema = createCocktailSchema.partial();

export type CreateCocktailInput = z.infer<typeof createCocktailSchema>;
export type UpdateCocktailInput = z.infer<typeof updateCocktailSchema>;
