import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10 blur-2xl pointer-events-none" />

        {/* LEFT SIDE */}
        <div className="relative z-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-[#11cdd4] uppercase">
            DATA-DRIVEN HOSPITALITY
          </p>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
            Run Your Bar or Restaurant
            <br />
            <span className="text-emerald-400">From One Smart Dashboard</span>
          </h1>

          <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
            Track sales, control inventory, and maximize profit with real-time
            insights designed for modern hospitality teams.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-emerald-500 px-6 py-3 font-medium text-black transition hover:bg-emerald-400 hover:scale-[1.03] shadow-lg shadow-emerald-500/20"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-white/20 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              View Dashboard
            </Link>
          </div>

          {/* TRUST LINE */}
          <p className="mt-6 text-sm text-white/50">
            Built for modern bars and restaurants
          </p>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="relative z-10 flex justify-center">
          <div className="rounded-2xl border border-white/10 bg-[#111827] p-2 shadow-2xl">
            <img
              src="/hero-dashboard.png"
              alt="Dashboard preview"
              className="rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 pb-24 grid md:grid-cols-4 gap-6">
        {[
          {
            title: "Real-time sales",
            desc: "Track every transaction instantly",
          },
          {
            title: "Smart inventory",
            desc: "Automatic stock deduction",
          },
          {
            title: "Profit insights",
            desc: "Understand margins clearly",
          },
          {
            title: "Low stock alerts",
            desc: "Never run out of ingredients",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-white/10 bg-[#111827] p-6 hover:border-emerald-500/30 transition"
          >
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-white/60">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
