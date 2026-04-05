import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardOverviewRequest } from "../api/dashboard.api";
import { useAuth } from "../context/auth-context";
import type { DashboardOverview } from "../types/dashboard.types";

export function DashboardPage() {
  const { user, logout } = useAuth();

  const [dashboard, setDashboard] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setIsLoading(true);
      setError("");

      const response = await getDashboardOverviewRequest();
      setDashboard(response.data.data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to load dashboard overview.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
              Ledgerly Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Welcome back{user ? `, ${user.fullName}` : ""}.
            </h1>
            <p className="mt-3 max-w-2xl text-white/70">
              Track revenue, profit, sales activity, and stock risks across your
              workspace.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/ingredients"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Ingredients
            </Link>

            <Link
              to="/cocktails"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Cocktails
            </Link>

            <Link
              to="/sales"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Sales
            </Link>

            <button
              onClick={logout}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/60">
            Loading dashboard...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-red-300">
            {error}
          </div>
        ) : dashboard ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-white/60">Total revenue</p>
                <h2 className="mt-3 text-3xl font-semibold">
                  {dashboard.summary.totalRevenue.toFixed(2)}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-white/60">Total profit</p>
                <h2 className="mt-3 text-3xl font-semibold text-emerald-400">
                  {dashboard.summary.totalProfit.toFixed(2)}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-white/60">Total sales</p>
                <h2 className="mt-3 text-3xl font-semibold">
                  {dashboard.summary.totalSales}
                </h2>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-white/60">Low stock alerts</p>
                <h2
                  className={`mt-3 text-3xl font-semibold ${
                    dashboard.summary.lowStockCount > 0
                      ? "text-amber-400"
                      : "text-white"
                  }`}
                >
                  {dashboard.summary.lowStockCount}
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold">Top cocktails</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Best-performing cocktails by quantity sold.
                  </p>
                </div>

                {dashboard.topCocktails.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/50">
                    No cocktail sales yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboard.topCocktails.map((cocktail, index) => (
                      <div
                        key={cocktail.cocktailId}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111827] px-4 py-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-semibold text-emerald-400">
                            #{index + 1}
                          </div>

                          <div>
                            <p className="font-medium">{cocktail.name}</p>
                            <p className="text-sm text-white/60">
                              Sold: {cocktail.quantitySold}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold">
                            {cocktail.revenue.toFixed(2)}
                          </p>
                          <p className="text-sm text-white/50">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold">Low stock preview</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Ingredients currently at or below minimum stock.
                  </p>
                </div>

                {dashboard.lowStockIngredients.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/50">
                    No low stock alerts right now.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboard.lowStockIngredients.map((ingredient) => (
                      <div
                        key={ingredient.id}
                        className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-medium">{ingredient.name}</p>
                            <p className="mt-1 text-sm text-white/60">
                              Supplier: {ingredient.supplier || "—"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-amber-300">
                              {ingredient.currentStock} {ingredient.unit}
                            </p>
                            <p className="mt-1 text-sm text-white/60">
                              Min: {ingredient.minimumStock} {ingredient.unit}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Recent sales</h2>
                <p className="mt-2 text-sm text-white/60">
                  Latest completed sales across your workspace.
                </p>
              </div>

              {dashboard.recentSales.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/50">
                  No recent sales yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboard.recentSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="rounded-2xl border border-white/10 bg-[#111827] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium">{sale.soldBy.fullName}</p>
                          <p className="mt-1 text-sm text-white/60">
                            {new Date(sale.soldAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            {sale.totalAmount.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm ${
                              sale.profit >= 0
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            Profit: {sale.profit.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {sale.items.map((item, index) => (
                          <div
                            key={`${sale.id}-${item.cocktailName}-${index}`}
                            className="flex items-center justify-between text-sm text-white/70"
                          >
                            <span>{item.cocktailName}</span>
                            <span>× {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
