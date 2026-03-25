import { api } from "./axios";
import type {
  CreateIngredientPayload,
  IngredientResponse,
  IngredientsResponse,
} from "../types/ingredient.types";

export async function getIngredientsRequest() {
  const response = await api.get<IngredientsResponse>("/ingredients");
  return response.data;
}

export async function createIngredientRequest(
  payload: CreateIngredientPayload,
) {
  const response = await api.post<IngredientResponse>("/ingredients", payload);
  return response.data;
}

export async function deleteIngredientRequest(id: string) {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/ingredients/${id}`,
  );
  return response.data;
}
