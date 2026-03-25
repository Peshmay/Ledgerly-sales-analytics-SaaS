export type IngredientUnit = "ML" | "CL" | "L" | "G" | "KG" | "PCS";

export type Ingredient = {
  id: string;
  name: string;
  unit: IngredientUnit;
  currentStock: number;
  minimumStock: number;
  costPerUnit: number;
  supplier?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateIngredientPayload = {
  name: string;
  unit: IngredientUnit;
  currentStock: number;
  minimumStock: number;
  costPerUnit: number;
  supplier?: string;
};

export type IngredientsResponse = {
  success: boolean;
  data: Ingredient[];
};

export type IngredientResponse = {
  success: boolean;
  message: string;
  data: Ingredient;
};
