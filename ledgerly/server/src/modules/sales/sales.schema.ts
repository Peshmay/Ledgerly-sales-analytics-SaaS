import { z } from "zod";

export const createSaleItemSchema = z.object({
  cocktailId: z.string().min(1, "Cocktail ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const createSaleSchema = z.object({
  items: z
    .array(createSaleItemSchema)
    .min(1, "At least one sale item is required"),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
