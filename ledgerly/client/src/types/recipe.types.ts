import type { IngredientUnit } from "./ingredient.types";

export type RecipeItem = {
  id: string;
  cocktailId: string;
  ingredientId: string;
  quantity: number;
  unit: IngredientUnit;
  createdAt?: string;
  ingredient: {
    id: string;
    name: string;
    unit: IngredientUnit;
  };
};

export type CreateRecipeItemPayload = {
  cocktailId: string;
  ingredientId: string;
  quantity: number;
  unit: IngredientUnit;
};

export type RecipeItemsResponse = {
  success: boolean;
  data: RecipeItem[];
};

export type RecipeItemResponse = {
  success: boolean;
  message: string;
  data: RecipeItem;
};
