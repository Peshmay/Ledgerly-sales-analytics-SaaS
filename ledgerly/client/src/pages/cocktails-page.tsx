import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createCocktailRequest,
  deleteCocktailRequest,
  getCocktailsRequest,
} from "../api/cocktails.api";
import { getIngredientsRequest } from "../api/ingredients.api";
import {
  createRecipeItemRequest,
  deleteRecipeItemRequest,
  getRecipeByCocktailIdRequest,
} from "../api/recipes.api";
import { useAuth } from "../context/auth-context";
import type { Ingredient } from "../types/ingredient.types";
import type { Cocktail, CreateCocktailPayload } from "../types/cocktail.types";
import type { RecipeItem } from "../types/recipe.types";
import type { IngredientUnit } from "../types/ingredient.types";
import { getCocktailCostSummaryRequest } from "../api/cost-summary.api";
import type { CocktailCostSummary } from "../types/cost-summary.types";
const unitOptions: IngredientUnit[] = ["ML", "CL", "L", "G", "KG", "PCS"];

export function CocktailsPage() {
  const { logout, user } = useAuth();

  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipesByCocktail, setRecipesByCocktail] = useState<
    Record<string, RecipeItem[]>
  >({});
  const [expandedCocktailId, setExpandedCocktailId] = useState<string | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [costSummaries, setCostSummaries] = useState<
    Record<string, CocktailCostSummary>
  >({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    salePrice: "",
    category: "",
    imageUrl: "",
    isActive: true,
  });

  const [recipeForm, setRecipeForm] = useState({
    ingredientId: "",
    quantity: "",
    unit: "ML" as IngredientUnit,
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

  async function loadIngredients() {
    try {
      const response = await getIngredientsRequest();
      setIngredients(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadRecipe(cocktailId: string) {
    try {
      const response = await getRecipeByCocktailIdRequest(cocktailId);
      setRecipesByCocktail((prev) => ({
        ...prev,
        [cocktailId]: response.data,
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to load recipe items.");
    }
  }

  useEffect(() => {
    loadCocktails();
    loadIngredients();
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
        imageUrl: formData.imageUrl.trim() || undefined,  
        isActive: formData.isActive,
      };

      const response = await createCocktailRequest(payload);
      setCocktails((prev) => [response.data, ...prev]);

      setFormData({
        name: "",
        description: "",
        salePrice: "",
        category: "",
        imageUrl: "",
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

  async function handleAddRecipeItem(cocktailId: string) {
    try {
      setError("");

      if (!cocktailId) {
        setError("Missing cocktail ID.");
        return;
      }

      if (!recipeForm.ingredientId) {
        setError("Please select an ingredient.");
        return;
      }

      if (!recipeForm.quantity.trim()) {
        setError("Please enter a quantity.");
        return;
      }

      const parsedQuantity = Number(recipeForm.quantity.replace(",", "."));

      if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
        setError("Quantity must be greater than 0.");
        return;
      }

      const payload = {
        cocktailId,
        ingredientId: recipeForm.ingredientId,
        quantity: parsedQuantity,
        unit: recipeForm.unit,
      };

      console.log("recipe payload", payload);

      await createRecipeItemRequest(payload);

      setRecipeForm({
        ingredientId: "",
        quantity: "",
        unit: "ML",
      });

      await loadRecipe(cocktailId);
      await loadCostSummary(cocktailId);
    } catch (err: any) {
      console.error(err);

      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        "Failed to add recipe item.";

      setError(backendMessage);
    }
  }

  async function handleDeleteRecipeItem(
    cocktailId: string,
    recipeItemId: string,
  ) {
    try {
      await deleteRecipeItemRequest(recipeItemId);

      setRecipesByCocktail((prev) => ({
        ...prev,
        [cocktailId]: (prev[cocktailId] || []).filter(
          (item) => item.id !== recipeItemId,
        ),
      }));
    } catch (err: any) {
      console.error(err);

      const backendMessage =
        err?.response?.data?.message || "Failed to delete recipe item.";

      setError(backendMessage);
    }
  }

  async function handleToggleRecipe(cocktailId: string) {
    if (expandedCocktailId === cocktailId) {
      setExpandedCocktailId(null);
      return;
    }

    setExpandedCocktailId(cocktailId);

    if (!recipesByCocktail[cocktailId]) {
      await loadRecipe(cocktailId);
    }
    await loadCostSummary(cocktailId);
  }

  async function loadCostSummary(cocktailId: string) {
    try {
      const response = await getCocktailCostSummaryRequest(cocktailId);
      setCostSummaries((prev) => ({
        ...prev,
        [cocktailId]: response.data,
      }));
    } catch (err) {
      console.error(err);
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

            <Link
              to="/sales"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Sales
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
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                  placeholder="/cocktails/mojito.jpg"
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
              <div className="space-y-4">
                {cocktails.map((cocktail) => (
                  <div
                    key={cocktail.id}
                    className="rounded-2xl border border-white/10 bg-[#111827] p-5"
                  >
                    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.7fr_0.8fr_1.5fr_auto] lg:items-center">
                      <div>
                        <p className="text-sm text-white/50">Name</p>
                        <p className="mt-1 font-semibold">{cocktail.name}</p>
                      </div>

                      <div>
                        <p className="text-sm text-white/50">Category</p>
                        <p className="mt-1 text-white/80">
                          {cocktail.category || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-white/50">Price</p>
                        <p className="mt-1">{cocktail.salePrice.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-white/50">Status</p>
                        <p
                          className={`mt-1 ${
                            cocktail.isActive
                              ? "text-emerald-400"
                              : "text-white/50"
                          }`}
                        >
                          {cocktail.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-white/50">Description</p>
                        <p className="mt-1 text-white/80">
                          {cocktail.description || "—"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleRecipe(cocktail.id)}
                          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/5"
                        >
                          {expandedCocktailId === cocktail.id
                            ? "Hide recipe"
                            : "Recipe"}
                        </button>

                        <button
                          onClick={() => handleDelete(cocktail.id)}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {expandedCocktailId === cocktail.id ? (
                      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1220] p-4">
                        <h3 className="text-lg font-semibold">
                          Recipe builder
                        </h3>
                        <p className="mt-1 text-sm text-white/60">
                          Attach ingredients to this cocktail.
                        </p>

                        <div className="mt-4 grid gap-3 md:grid-cols-[1.3fr_0.8fr_0.7fr_auto]">
                          <select
                            value={recipeForm.ingredientId}
                            onChange={(e) =>
                              setRecipeForm((prev) => ({
                                ...prev,
                                ingredientId: e.target.value,
                              }))
                            }
                            className="rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                          >
                            <option value="">Select ingredient</option>
                            {ingredients.map((ingredient) => (
                              <option key={ingredient.id} value={ingredient.id}>
                                {ingredient.name}
                              </option>
                            ))}
                          </select>

                          <input
                            type="text"
                            inputMode="decimal"
                            value={recipeForm.quantity}
                            onChange={(e) =>
                              setRecipeForm((prev) => ({
                                ...prev,
                                quantity: e.target.value,
                              }))
                            }
                            className="rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                            placeholder="50"
                          />

                          <select
                            value={recipeForm.unit}
                            onChange={(e) =>
                              setRecipeForm((prev) => ({
                                ...prev,
                                unit: e.target.value as IngredientUnit,
                              }))
                            }
                            className="rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none"
                          >
                            {unitOptions.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleAddRecipeItem(cocktail.id)}
                            className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-medium text-black"
                          >
                            Add
                          </button>
                        </div>

                        {costSummaries[cocktail.id] ? (
                          <div className="mt-5 grid gap-3 md:grid-cols-4">
                            <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
                              <p className="text-xs uppercase tracking-wide text-white/50">
                                Recipe Cost
                              </p>
                              <p className="mt-2 text-lg font-semibold">
                                {costSummaries[cocktail.id].recipeCost.toFixed(
                                  2,
                                )}
                              </p>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
                              <p className="text-xs uppercase tracking-wide text-white/50">
                                Sale Price
                              </p>
                              <p className="mt-2 text-lg font-semibold">
                                {costSummaries[cocktail.id].salePrice.toFixed(
                                  2,
                                )}
                              </p>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
                              <p className="text-xs uppercase tracking-wide text-white/50">
                                Profit
                              </p>
                              <p className="mt-2 text-lg font-semibold text-emerald-400">
                                {costSummaries[cocktail.id].profit.toFixed(2)}
                              </p>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
                              <p className="text-xs uppercase tracking-wide text-white/50">
                                Margin
                              </p>
                              <p className="mt-2 text-lg font-semibold">
                                {costSummaries[
                                  cocktail.id
                                ].marginPercent.toFixed(1)}
                                %
                              </p>
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-5 space-y-3">
                          {(recipesByCocktail[cocktail.id] || []).length ===
                          0 ? (
                            <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-white/50">
                              No recipe items yet.
                            </div>
                          ) : (
                            (recipesByCocktail[cocktail.id] || []).map(
                              (item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between rounded-xl border border-white/10 bg-[#111827] px-4 py-3"
                                >
                                  <div className="text-sm">
                                    <span className="font-medium text-white">
                                      {item.ingredient.name}
                                    </span>
                                    <span className="ml-2 text-white/60">
                                      {item.quantity} {item.unit}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() =>
                                      handleDeleteRecipeItem(
                                        cocktail.id,
                                        item.id,
                                      )
                                    }
                                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-500/20"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ),
                            )
                          )}
                        </div>
                      </div>
                    ) : null}
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
