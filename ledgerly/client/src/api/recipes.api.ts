import { api } from "./axios";
import type {
  CreateRecipeItemPayload,
  RecipeItemResponse,
  RecipeItemsResponse,
} from "../types/recipe.types";

export async function createRecipeItemRequest(
  payload: CreateRecipeItemPayload,
) {
  const response = await api.post<RecipeItemResponse>("/recipes", payload);
  return response.data;
}

export async function getRecipeByCocktailIdRequest(cocktailId: string) {
  const response = await api.get<RecipeItemsResponse>(
    `/recipes/cocktails/${cocktailId}`,
  );
  return response.data;
}

export async function deleteRecipeItemRequest(id: string) {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/recipes/${id}`,
  );
  return response.data;
}
