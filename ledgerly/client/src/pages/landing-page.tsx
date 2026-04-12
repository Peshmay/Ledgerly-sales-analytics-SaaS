import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main className="h-screen overflow-hidden bg-[#0b0f19] text-white">
      {/* HEADER */}
      <header className="absolute left-0 top-0 z-20 w-full px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <Link
            className="text-xl font-semibold tracking-tight text-white"
            to="/"
          >
            Ledgerly
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="flex h-screen flex-col md:flex-row">
        {/* LEFT SIDE (TEXT) */}
        <div className="flex w-full items-center justify-center px-6 py-20 md:w-1/2 md:px-8 md:py-0 lg:px-16">
          <div className="w-full max-w-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#11cdd4] sm:text-sm">
              Data-driven hospitality
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl xl:text-6xl">
              Run Your Bar or Restaurant
              <span className="mt-2 block text-emerald-400">
                From One Smart Dashboard
              </span>
            </h1>

            <p className="mt-4 text-sm text-white/70 sm:text-base lg:text-lg">
              Track sales, control inventory, and maximize profit in real time.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/register"
                className="inline-block rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-400 sm:px-6 sm:py-3 sm:text-base"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="inline-block rounded-xl border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 sm:px-6 sm:py-3 sm:text-base"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (VIDEO FULL HALF) */}
        <div className="relative h-1/2 w-full md:h-full md:w-1/2">
          <video
            src="/landing/hero-dashboard.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        </div>
      </section>
    </main>
  );
}
