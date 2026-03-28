import { api } from "./axios";
import type {
  CocktailsResponse,
  CocktailResponse,
  CreateCocktailPayload,
} from "../types/cocktail.types";

export async function getCocktailsRequest() {
  const response = await api.get<CocktailsResponse>("/cocktails");
  return response.data;
}

export async function createCocktailRequest(payload: CreateCocktailPayload) {
  const response = await api.post<CocktailResponse>("/cocktails", payload);
  return response.data;
}

export async function deleteCocktailRequest(id: string) {
  const response = await api.delete<{ success: boolean; message: string }>(
    `/cocktails/${id}`,
  );
  return response.data;
}
