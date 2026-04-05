import { prisma } from "../../lib/prisma";

export async function getDashboardOverview() {
  const [salesAggregate, allIngredients, topCocktailGroups, recentSales] =
    await Promise.all([
      prisma.sale.aggregate({
        _sum: {
          totalAmount: true,
          profit: true,
        },
        _count: {
          id: true,
        },
      }),

      // ✅ fetch ALL ingredients first
      prisma.ingredient.findMany({
        select: {
          id: true,
          name: true,
          currentStock: true,
          minimumStock: true,
          unit: true,
          supplier: true,
        },
      }),

      prisma.saleItem.groupBy({
        by: ["cocktailId"],
        _sum: {
          quantity: true,
          subtotal: true,
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      }),

      prisma.sale.findMany({
        orderBy: {
          soldAt: "desc",
        },
        take: 5,
        select: {
          id: true,
          soldAt: true,
          totalAmount: true,
          profit: true,
          soldBy: {
            select: {
              fullName: true,
            },
          },
          items: {
            select: {
              quantity: true,
              cocktail: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
    ]);

  const lowStockIngredients = allIngredients
    .filter((ingredient) => ingredient.currentStock <= ingredient.minimumStock)
    .sort((a, b) => a.currentStock - b.currentStock); // Sort by current stock ascending

  const cocktailIds = topCocktailGroups.map((group) => group.cocktailId);

  const cocktails =
    cocktailIds.length > 0
      ? await prisma.cocktail.findMany({
          where: {
            id: {
              in: cocktailIds,
            },
          },
          select: {
            id: true,
            name: true,
          },
        })
      : [];

  const cocktailsMap = new Map(
    cocktails.map((cocktail) => [cocktail.id, cocktail]),
  );

  const topCocktails = topCocktailGroups.map((group) => {
    const cocktail = cocktailsMap.get(group.cocktailId);

    return {
      cocktailId: group.cocktailId,
      name: cocktail?.name ?? "Unknown cocktail",
      quantitySold: group._sum.quantity ?? 0,
      revenue: group._sum.subtotal ?? 0,
    };
  });

  const formattedRecentSales = recentSales.map((sale) => ({
    id: sale.id,
    soldAt: sale.soldAt,
    totalAmount: sale.totalAmount,
    profit: sale.profit,
    soldBy: {
      fullName: sale.soldBy.fullName,
    },
    items: sale.items.map((item) => ({
      cocktailName: item.cocktail.name,
      quantity: item.quantity,
    })),
  }));

  return {
    summary: {
      totalRevenue: salesAggregate._sum.totalAmount ?? 0,
      totalProfit: salesAggregate._sum.profit ?? 0,
      totalSales: salesAggregate._count.id ?? 0,
      lowStockCount: lowStockIngredients.length,
    },
    topCocktails,
    recentSales: formattedRecentSales,
    lowStockIngredients,
  };
}
