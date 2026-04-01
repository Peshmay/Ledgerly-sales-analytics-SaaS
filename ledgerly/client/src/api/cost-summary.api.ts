import { api } from "./axios";
import type { CocktailCostSummaryResponse } from "../types/cost-summary.types";

export async function getCocktailCostSummaryRequest(cocktailId: string) {
  const response = await api.get<CocktailCostSummaryResponse>(
    `/cocktails/${cocktailId}/cost-summary`,
  );
  return response.data;
}
