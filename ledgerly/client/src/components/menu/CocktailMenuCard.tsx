import type { CocktailCostSummary } from "../../types/cost-summary.types";

type Props = {
  imageSrc: string;
  name: string;
  category?: string | null;
  salePrice: number;
  summary?: CocktailCostSummary;
  onServe: () => void;
};

export function CocktailMenuCard({
  imageSrc,
  name,
  category,
  salePrice,
  summary,
  onServe,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-black">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
        />
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {category ? (
              <span className="rounded-full bg-sky-500/20 px-2 py-1 text-xs font-medium text-sky-300">
                {category}
              </span>
            ) : null}

            <h3 className="mt-3 text-xl font-semibold text-white">{name}</h3>
          </div>
        </div>

        <div className="space-y-1 text-sm text-white/70">
          <p>
            Price:{" "}
            <span className="font-medium text-white">
              {salePrice.toFixed(2)}
            </span>
          </p>

          <p>
            Profit per drink:{" "}
            <span className="font-medium text-emerald-400">
              {summary ? summary.profit.toFixed(2) : "0.00"}
            </span>
          </p>
        </div>

        <button
          onClick={onServe}
          className="mt-4 w-full rounded-xl bg-emerald-500 px-4 py-3 font-medium text-black transition hover:bg-emerald-400"
        >
          Serve
        </button>
      </div>
    </div>
  );
}
