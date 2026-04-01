export type CocktailCostSummary = {
  cocktailId: string;
  cocktailName: string;
  salePrice: number;
  recipeCost: number;
  profit: number;
  marginPercent: number;
};

export type CocktailCostSummaryResponse = {
  success: boolean;
  data: CocktailCostSummary;
};
