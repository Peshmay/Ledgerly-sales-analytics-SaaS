import { z } from "zod";

export const createIngredientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  unit: z.enum(["ML", "CL", "L", "G", "KG", "PCS"]),
  currentStock: z.number().min(0),
  minimumStock: z.number().min(0),
  costPerUnit: z.number().min(0),
  supplier: z.string().optional(),
});

export const updateIngredientSchema = createIngredientSchema.partial();

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
