import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCocktailsRequest } from "../api/cocktails.api";
import { createSaleRequest } from "../api/sales.api";
import { getCocktailCostSummaryRequest } from "../api/cost-summary.api";
import { useAuth } from "../context/auth-context";
import { CocktailMenuCard } from "../components/menu/CocktailMenuCard";
import { cocktailImages, defaultCocktailImage } from "../data/cocktail-images";
import type { Cocktail } from "../types/cocktail.types";
import type { CocktailCostSummary } from "../types/cost-summary.types";
import { unwrap } from "../utils/api";

export function MenuPage() {
  const { user, logout } = useAuth();

  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [costSummaries, setCostSummaries] = useState<
    Record<string, CocktailCostSummary>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [servingId, setServingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadMenu();
  }, []);

  async function loadMenu() {
    try {
      setIsLoading(true);
      setError("");

      const cocktails = unwrap<Cocktail[]>(await getCocktailsRequest());

      const activeCocktails = cocktails.filter((cocktail) => cocktail.isActive);

      setCocktails(activeCocktails);

      await Promise.all(
        activeCocktails.map(async (cocktail: Cocktail) => {
          try {
            const summaryResponse = await getCocktailCostSummaryRequest(
              cocktail.id,
            );

            setCostSummaries((prev) => ({
              ...prev,
              [cocktail.id]: summaryResponse.data,
            }));
          } catch (err) {
            console.error(err);
          }
        }),
      );
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load menu.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleServe(cocktailId: string) {
    try {
      setServingId(cocktailId);
      setError("");
      setSuccessMessage("");

      await createSaleRequest({
        items: [
          {
            cocktailId,
            quantity: 1,
          },
        ],
      });

      setSuccessMessage("Sale recorded successfully.");
      await loadMenu();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to serve cocktail.");
    } finally {
      setServingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
              Ledgerly Menu
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Serve drinks and track sales in real time.
            </h1>
            <p className="mt-3 max-w-2xl text-white/70">
              Staff can click a drink to record a sale. Each sale updates your
              nightly sales data and reduces ingredient stock automatically.
            </p>
            <p className="mt-2 text-sm text-white/50">
              Signed in as {user?.fullName}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Dashboard
            </Link>

            <Link
              to="/sales"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Sales
            </Link>

            <Link
              to="/cocktails"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Cocktails
            </Link>

            <button
              onClick={logout}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {successMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white/60">
            Loading menu...
          </div>
        ) : cocktails.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/50">
            No active cocktails available.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cocktails.map((cocktail) => {
              const imageSrc =
                cocktail.imageUrl ||
                cocktailImages[cocktail.name] ||
                defaultCocktailImage;

              return (
                <div key={cocktail.id} className="relative">
                  <CocktailMenuCard
                    imageSrc={imageSrc}
                    name={cocktail.name}
                    category={cocktail.category}
                    salePrice={cocktail.salePrice}
                    summary={costSummaries[cocktail.id]}
                    onServe={() => handleServe(cocktail.id)}
                  />

                  {servingId === cocktail.id ? (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-sm font-medium text-white">
                      Recording sale...
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
