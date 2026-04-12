import { prisma } from "../../lib/prisma";
import type {
  CreateCocktailInput,
  UpdateCocktailInput,
} from "./cocktails.schema";

export async function createCocktail(data: CreateCocktailInput) {
  return prisma.cocktail.create({
    data: {
      name: data.name.trim(),
      description: data.description?.trim() || null,
      salePrice: data.salePrice,
      category: data.category?.trim() || null,
      imageUrl: data.imageUrl?.trim() || null,
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
    data: {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.description !== undefined
        ? { description: data.description?.trim() || null }
        : {}),
      ...(data.salePrice !== undefined ? { salePrice: data.salePrice } : {}),
      ...(data.category !== undefined
        ? { category: data.category?.trim() || null }
        : {}),
      ...(data.imageUrl !== undefined
        ? { imageUrl: data.imageUrl?.trim() || null }
        : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    },
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
