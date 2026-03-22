export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
            Ledgerly
          </p>

          <h1 className="text-5xl font-semibold leading-tight md:text-7xl">
            Built for bars that want sharper control of sales, stock, and
            performance.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Ledgerly is a full-stack analytics SaaS for bar and restaurant
            management, helping teams track cocktails, ingredients, menu items,
            and sales through a modern dashboard.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-xl bg-emerald-500 px-5 py-3 font-medium text-black">
              View Dashboard
            </button>

            <button className="rounded-xl border border-white/15 px-5 py-3 font-medium">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
