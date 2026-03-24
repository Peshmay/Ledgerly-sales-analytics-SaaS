import { prisma } from "../../lib/prisma";
import type {
  CreateIngredientInput,
  UpdateIngredientInput,
} from "./ingredients.schema";

export async function createIngredient(data: CreateIngredientInput) {
  return prisma.ingredient.create({
    data,
  });
}

export async function getIngredients() {
  return prisma.ingredient.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getIngredientById(id: string) {
  return prisma.ingredient.findUnique({
    where: { id },
  });
}

export async function updateIngredient(
  id: string,
  data: UpdateIngredientInput,
) {
  return prisma.ingredient.update({
    where: { id },
    data,
  });
}

export async function deleteIngredient(id: string) {
  return prisma.ingredient.delete({
    where: { id },
  });
}
