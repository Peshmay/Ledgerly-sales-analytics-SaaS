import { prisma } from "../../lib/prisma";
import type { CreateSaleInput } from "./sales.schema";

type CreateSaleParams = {
  soldById: string;
  data: CreateSaleInput;
};

export async function createSale({ soldById, data }: CreateSaleParams) {
  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    let totalCost = 0;

    const preparedItems: Array<{
      cocktailId: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }> = [];

    for (const item of data.items) {
      const cocktail = await tx.cocktail.findUnique({
        where: { id: item.cocktailId },
        include: {
          recipeItems: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      if (!cocktail) {
        throw new Error("Cocktail not found");
      }

      if (cocktail.recipeItems.length === 0) {
        throw new Error(
          `Cocktail "${cocktail.name}" has no recipe and cannot be sold.`,
        );
      }

      for (const recipeItem of cocktail.recipeItems) {
        if (recipeItem.unit !== recipeItem.ingredient.unit) {
          throw new Error(
            `Unit mismatch for ingredient "${recipeItem.ingredient.name}". Conversion is not supported yet.`,
          );
        }

        const quantityToDeduct = recipeItem.quantity * item.quantity;

        if (recipeItem.ingredient.currentStock < quantityToDeduct) {
          throw new Error(
            `Not enough stock for ingredient "${recipeItem.ingredient.name}".`,
          );
        }
      }

      for (const recipeItem of cocktail.recipeItems) {
        const quantityToDeduct = recipeItem.quantity * item.quantity;
        const ingredientCost =
          quantityToDeduct * recipeItem.ingredient.costPerUnit;

        totalCost += ingredientCost;

        await tx.ingredient.update({
          where: { id: recipeItem.ingredientId },
          data: {
            currentStock: {
              decrement: quantityToDeduct,
            },
          },
        });

        await tx.stockAdjustment.create({
          data: {
            ingredientId: recipeItem.ingredientId,
            quantityChange: -quantityToDeduct,
            reason: `Sale recorded for cocktail: ${cocktail.name}`,
          },
        });
      }

      const subtotal = cocktail.salePrice * item.quantity;
      totalAmount += subtotal;

      preparedItems.push({
        cocktailId: item.cocktailId,
        quantity: item.quantity,
        unitPrice: cocktail.salePrice,
        subtotal,
      });
    }

    const profit = totalAmount - totalCost;

    const sale = await tx.sale.create({
      data: {
        soldById,
        totalAmount,
        totalCost,
        profit,
        items: {
          create: preparedItems,
        },
      },
      include: {
        items: {
          include: {
            cocktail: true,
          },
        },
        soldBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return sale;
  });
}

export async function getSales() {
  return prisma.sale.findMany({
    include: {
      soldBy: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      },
      items: {
        include: {
          cocktail: true,
        },
      },
    },
    orderBy: {
      soldAt: "desc",
    },
  });
}
