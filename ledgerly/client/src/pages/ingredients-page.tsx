import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createIngredientRequest,
  deleteIngredientRequest,
  getIngredientsRequest,
} from "../api/ingredients.api";
import { useAuth } from "../context/auth-context";
import type {
  CreateIngredientPayload,
  Ingredient,
} from "../types/ingredient.types";

const unitOptions = ["ML", "CL", "L", "G", "KG", "PCS"] as const;

export function IngredientsPage() {
  const { logout, user } = useAuth();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateIngredientPayload>({
    name: "",
    unit: "ML",
    currentStock: 0,
    minimumStock: 0,
    costPerUnit: 0,
    supplier: "",
  });

  async function loadIngredients() {
    try {
      setIsLoading(true);
      setError("");
      const response = await getIngredientsRequest();
      setIngredients(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load ingredients.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadIngredients();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload: CreateIngredientPayload = {
        ...formData,
        supplier: formData.supplier?.trim() || undefined,
      };

      const response = await createIngredientRequest(payload);
      setIngredients((prev) => [response.data, ...prev]);

      setFormData({
        name: "",
        unit: "ML",
        currentStock: 0,
        minimumStock: 0,
        costPerUnit: 0,
        supplier: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create ingredient.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteIngredientRequest(id);
      setIngredients((prev) =>
        prev.filter((ingredient) => ingredient.id !== id),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete ingredient.");
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
              Ledgerly Ingredients
            </p>
            <h1 className="mt-3 text-4xl font-semibold">
              Manage bar inventory with clarity.
            </h1>
            <p className="mt-3 max-w-2xl text-white/70">
              Add ingredients, monitor stock levels, and keep your bar operation
              ready for service.
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
            <button
              onClick={logout}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Add ingredient</h2>
            <p className="mt-2 text-sm text-white/60">
              Create inventory items used in cocktails and recipes.
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
                  placeholder="Lime Juice"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      unit: e.target.value as CreateIngredientPayload["unit"],
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                >
                  {unitOptions.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Current stock
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.currentStock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentStock: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Minimum stock
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minimumStock}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minimumStock: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Cost per unit
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costPerUnit}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      costPerUnit: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Supplier
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      supplier: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-white/25"
                  placeholder="Fresh Citrus AB"
                />
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
                {isSubmitting ? "Saving..." : "Add ingredient"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Inventory list</h2>
                <p className="mt-2 text-sm text-white/60">
                  Current ingredients available in your workspace.
                </p>
              </div>
            </div>

            {isLoading ? (
              <p className="text-white/60">Loading ingredients...</p>
            ) : ingredients.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-white/50">
                No ingredients yet. Add your first inventory item.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-sm text-white/50">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Unit</th>
                      <th className="pb-2">Stock</th>
                      <th className="pb-2">Min stock</th>
                      <th className="pb-2">Cost/unit</th>
                      <th className="pb-2">Supplier</th>
                      <th className="pb-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ingredient) => (
                      <tr
                        key={ingredient.id}
                        className="rounded-2xl bg-[#111827] text-sm text-white"
                      >
                        <td className="rounded-l-2xl px-4 py-4 font-medium">
                          {ingredient.name}
                        </td>
                        <td className="px-4 py-4 text-white/70">
                          {ingredient.unit}
                        </td>
                        <td className="px-4 py-4">{ingredient.currentStock}</td>
                        <td className="px-4 py-4">{ingredient.minimumStock}</td>
                        <td className="px-4 py-4">{ingredient.costPerUnit}</td>
                        <td className="px-4 py-4 text-white/70">
                          {ingredient.supplier || "—"}
                        </td>
                        <td className="rounded-r-2xl px-4 py-4">
                          <button
                            onClick={() => handleDelete(ingredient.id)}
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
