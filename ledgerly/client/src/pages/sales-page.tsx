import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { getCocktailsRequest } from "../api/cocktails.api";
import { getIngredientsRequest } from "../api/ingredients.api";
import { createSaleRequest, getSalesRequest } from "../api/sales.api";
import type { Cocktail } from "../types/cocktail.types";
import type { Ingredient } from "../types/ingredient.types";
import type { Sale } from "../types/sale.types";

type CartItem = {
  cocktailId: string;
  name: string;
  price: number;
  quantity: number;
};

type Sale = {
  id: string;
  totalAmount: number;
  soldAt: string;
  soldBy: {
    id: string;
    fullName: string;
    email: string;
    role: "ADMIN" | "STAFF";
  };
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    cocktail: {
      id: string;
      name: string;
    };
  }[];
};

export function SalesPage() {
  const { logout, user } = useAuth();

  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  const [selectedCocktailId, setSelectedCocktailId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
    try {
      setIsLoading(true);
      setError("");

      const [cocktailsResponse, ingredientsResponse, salesResponse] =
        await Promise.all([
          getCocktailsRequest(),
          getIngredientsRequest(),
          getSalesRequest(),
        ]);

      setCocktails(
        cocktailsResponse.data.filter((cocktail) => cocktail.isActive),
      );
      setIngredients(ingredientsResponse.data);
      setSales(salesResponse.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load sales data.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddToCart() {
    setError("");
    setSuccessMessage("");

    const cocktail = cocktails.find((item) => item.id === selectedCocktailId);
    const parsedQuantity = Number(quantity);

    if (!cocktail) {
      setError("Please select a cocktail.");
      return;
    }

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    setCart((prev) => {
      const existingItem = prev.find((item) => item.cocktailId === cocktail.id);

      if (existingItem) {
        return prev.map((item) =>
          item.cocktailId === cocktail.id
            ? { ...item, quantity: item.quantity + parsedQuantity }
            : item,
        );
      }

      return [
        ...prev,
        {
          cocktailId: cocktail.id,
          name: cocktail.name,
          price: cocktail.salePrice,
          quantity: parsedQuantity,
        },
      ];
    });

    setSelectedCocktailId("");
    setQuantity("1");
  }

  function handleRemoveFromCart(cocktailId: string) {
    setCart((prev) => prev.filter((item) => item.cocktailId !== cocktailId));
  }

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const lowStockIngredients = useMemo(() => {
    return ingredients.filter(
      (ingredient) => ingredient.currentStock <= ingredient.minimumStock,
    );
  }, [ingredients]);

  async function handleSubmitSale() {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      if (cart.length === 0) {
        setError("Add at least one item to the cart.");
        return;
      }

      await createSaleRequest({
        items: cart.map((item) => ({
          cocktailId: item.cocktailId,
          quantity: item.quantity,
        })),
      });

      setCart([]);
      setSelectedCocktailId("");
      setQuantity("1");
      setSuccessMessage("Sale completed successfully.");

      await loadPageData();
    } catch (err: any) {
      console.error(err);

      const backendMessage =
        err?.response?.data?.message || "Failed to complete sale.";

      setError(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
              Ledgerly Sales
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Record sales and track live stock movement.
            </h1>
            <p className="mt-3 max-w-2xl text-white/70">
              Build a ticket, complete the sale, and let Ledgerly deduct
              ingredients from stock automatically.
            </p>
            <p className="mt-2 text-sm text-white/50">
              Signed in as {user?.fullName}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Dashboard
            </Link>

            <Link
              to="/cocktails"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Cocktails
            </Link>

            <Link
              to="/ingredients"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Ingredients
            </Link>

            <button
              onClick={logout}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Create sale</h2>
            <p className="mt-2 text-sm text-white/60">
              Add cocktails to the current ticket and complete the sale.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Cocktail
                </label>
                <select
                  value={selectedCocktailId}
                  onChange={(e) => setSelectedCocktailId(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                >
                  <option value="">Select cocktail</option>
                  {cocktails.map((cocktail) => (
                    <option key={cocktail.id} value={cocktail.id}>
                      {cocktail.name} — {cocktail.salePrice.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                />
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full rounded-2xl bg-emerald-500 px-5 py-3 font-medium text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Add to ticket
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Current ticket</h2>
              <p className="mt-2 text-sm text-white/60">
                Review items before completing the sale.
              </p>
            </div>

            {cart.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/50">
                No sale items yet. Add cocktails to the ticket.
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.cocktailId}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#111827] px-4 py-4"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-white/60">
                        {item.quantity} × {item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="font-medium">
                        {(item.price * item.quantity).toFixed(2)}
                      </p>

                      <button
                        onClick={() => handleRemoveFromCart(item.cocktailId)}
                        className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="rounded-2xl border border-white/10 bg-[#111827] px-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Total</span>
                    <span className="text-xl font-semibold">
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {error ? (
                  <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </p>
                ) : null}

                {successMessage ? (
                  <p className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                    {successMessage}
                  </p>
                ) : null}

                <button
                  onClick={handleSubmitSale}
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-emerald-500 px-5 py-3 font-medium text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Processing..." : "Complete sale"}
                </button>
              </div>
            )}
          </section>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Recent sales</h2>
              <p className="mt-2 text-sm text-white/60">
                Latest completed sales in your workspace.
              </p>
            </div>

            {sales.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/50">
                No sales yet.
              </div>
            ) : (
              <div className="space-y-4">
                {sales.slice(0, 5).map((sale) => (
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

                    <div className="mt-3 space-y-2">
                      {sale.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm text-white/70"
                        >
                          <span>
                            {item.cocktail.name} × {item.quantity}
                          </span>
                          <span>{item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Low stock alerts</h2>
              <p className="mt-2 text-sm text-white/60">
                Ingredients that are at or below minimum stock.
              </p>
            </div>

            {lowStockIngredients.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/50">
                No low stock alerts right now.
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">
                          {ingredient.name}
                        </p>
                        <p className="mt-1 text-sm text-white/70">
                          Supplier: {ingredient.supplier || "—"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium text-amber-300">
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
      </div>
    </main>
  );
}
