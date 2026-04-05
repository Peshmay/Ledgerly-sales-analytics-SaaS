export type DashboardSummary = {
  totalRevenue: number;
  totalProfit: number;
  totalSales: number;
  lowStockCount: number;
};

export type DashboardTopCocktail = {
  cocktailId: string;
  name: string;
  quantitySold: number;
  revenue: number;
};

export type DashboardRecentSale = {
  id: string;
  soldAt: string;
  totalAmount: number;
  profit: number;
  soldBy: {
    fullName: string;
  };
  items: {
    cocktailName: string;
    quantity: number;
  }[];
};

export type DashboardLowStockIngredient = {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  unit: "ML" | "CL" | "L" | "G" | "KG" | "PCS";
  supplier?: string | null;
};

export type DashboardOverview = {
  summary: DashboardSummary;
  topCocktails: DashboardTopCocktail[];
  recentSales: DashboardRecentSale[];
  lowStockIngredients: DashboardLowStockIngredient[];
};
