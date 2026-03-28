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