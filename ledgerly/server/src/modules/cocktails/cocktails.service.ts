import { prisma } from "../../lib/prisma";
import type {
  CreateCocktailInput,
  UpdateCocktailInput,
} from "./cocktails.schema";

export async function createCocktail(data: CreateCocktailInput) {
  return prisma.cocktail.create({
    data: {
      ...data,
      isActive: data.isActive ?? true,
    },
  });
}

export async function getCocktails() {
  return prisma.cocktail.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getCocktailById(id: string) {
  return prisma.cocktail.findUnique({
    where: { id },
  });
}

export async function updateCocktail(id: string, data: UpdateCocktailInput) {
  return prisma.cocktail.update({
    where: { id },
    data,
  });
}

export async function deleteCocktail(id: string) {
  return prisma.cocktail.delete({
    where: { id },
  });
}

export async function getCocktailCostSummary(id: string) {
  const cocktail = await prisma.cocktail.findUnique({
    where: { id },
    include: {
      recipeItems: {
        include: {
          ingredient: true,
        },
      },
    },
  });

  if (!cocktail) {
    return null;
  }

  let recipeCost = 0;

  for (const item of cocktail.recipeItems) {
    // For now, only calculate when recipe unit matches ingredient unit
    if (item.unit !== item.ingredient.unit) {
      continue;
    }

    recipeCost += item.quantity * item.ingredient.costPerUnit;
  }

  const salePrice = cocktail.salePrice;
  const profit = salePrice - recipeCost;
  const marginPercent = salePrice > 0 ? (profit / salePrice) * 100 : 0;

  return {
    cocktailId: cocktail.id,
    cocktailName: cocktail.name,
    salePrice,
    recipeCost,
    profit,
    marginPercent,
  };
}
