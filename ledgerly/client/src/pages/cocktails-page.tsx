import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createCocktailRequest,
  deleteCocktailRequest,
  getCocktailsRequest,
} from "../api/cocktails.api";
import { useAuth } from "../context/auth-context";
import type { Cocktail, CreateCocktailPayload } from "../types/cocktail.types";

export function CocktailsPage() {
  const { logout, user } = useAuth();

  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    salePrice: "",
    category: "",
    isActive: true,
  });

  async function loadCocktails() {
    try {
      setIsLoading(true);
      setError("");
      const response = await getCocktailsRequest();
      setCocktails(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load cocktails.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCocktails();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload: CreateCocktailPayload = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        salePrice: Number(formData.salePrice.replace(",", ".")),
        category: formData.category.trim() || undefined,
        isActive: formData.isActive,
      };

      const response = await createCocktailRequest(payload);
      setCocktails((prev) => [response.data, ...prev]);

      setFormData({
        name: "",
        description: "",
        salePrice: "",
        category: "",
        isActive: true,
      });
    } catch (err: any) {
      console.error(err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        "Failed to create cocktail.";

      setError(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCocktailRequest(id);
      setCocktails((prev) => prev.filter((cocktail) => cocktail.id !== id));
    } catch (err: any) {
      console.error(err);

      const backendMessage =
        err?.response?.data?.message || "Failed to delete cocktail.";

      setError(backendMessage);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
              Ledgerly Cocktails
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Manage cocktails and menu-ready items.
            </h1>
            <p className="mt-3 max-w-2xl text-white/70">
              Add cocktails, define sale prices, and prepare your product
              catalog for recipes, menus, and sales.
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
            <h2 className="text-2xl font-semibold">Add cocktail</h2>
            <p className="mt-2 text-sm text-white/60">
              Create sellable cocktail items for your bar menu.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-white/25"
                  placeholder="Mojito"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="min-h-[100px] w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-white/25"
                  placeholder="Fresh mint, lime, sugar and soda"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Sale price
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.salePrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salePrice: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                  placeholder="12.50"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-white/25"
                  placeholder="Classic"
                />
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111827] px-4 py-3">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
                <label htmlFor="isActive" className="text-sm text-white/80">
                  Active on menu
                </label>
              </div>

              {error ? (
                <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-emerald-500 px-5 py-3 font-medium text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Add cocktail"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Cocktail list</h2>
                <p className="mt-2 text-sm text-white/60">
                  Current cocktails available in your workspace.
                </p>
              </div>
            </div>

            {isLoading ? (
              <p className="text-white/60">Loading cocktails...</p>
            ) : cocktails.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/50">
                No cocktails yet. Add your first cocktail item.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-sm text-white/50">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Description</th>
                      <th className="pb-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cocktails.map((cocktail) => (
                      <tr
                        key={cocktail.id}
                        className="rounded-2xl bg-[#111827] text-sm text-white"
                      >
                        <td className="rounded-l-2xl px-4 py-4 font-medium">
                          {cocktail.name}
                        </td>
                        <td className="px-4 py-4 text-white/70">
                          {cocktail.category || "—"}
                        </td>
                        <td className="px-4 py-4">{cocktail.salePrice}</td>
                        <td className="px-4 py-4">
                          <span
                            className={
                              cocktail.isActive
                                ? "text-emerald-400"
                                : "text-white/50"
                            }
                          >
                            {cocktail.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="max-w-[280px] px-4 py-4 text-white/70">
                          {cocktail.description || "—"}
                        </td>
                        <td className="rounded-r-2xl px-4 py-4">
                          <button
                            onClick={() => handleDelete(cocktail.id)}
                            className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
