import { api } from "./axios";
import type { Cocktail } from "../types/cocktail.types";

export function getCocktailsRequest() {
  return api.get<{ success: boolean; data: Cocktail[] }>("/cocktails");
}

export function createCocktailRequest(data: any) {
  return api.post<{ success: boolean; data: Cocktail }>("/cocktails", data);
}

export function deleteCocktailRequest(id: string) {
  return api.delete(`/cocktails/${id}`);
}
