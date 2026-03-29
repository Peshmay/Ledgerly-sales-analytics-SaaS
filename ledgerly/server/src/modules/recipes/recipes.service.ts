import { prisma } from "../../lib/prisma";
import type { CreateRecipeItemInput } from "./recipes.schema";

export async function createRecipeItem(data: CreateRecipeItemInput) {
  return prisma.recipeIngredient.create({
    data,
    include: {
      ingredient: true,
      cocktail: true,
    },
  });
}

export async function getRecipeByCocktailId(cocktailId: string) {
  return prisma.recipeIngredient.findMany({
    where: { cocktailId },
    include: {
      ingredient: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteRecipeItem(id: string) {
  return prisma.recipeIngredient.delete({
    where: { id },
  });
}
