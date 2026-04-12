import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import authBg from "../assets/auth-bg.jpg";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Check your email and password.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${authBg})` }}
      />

      <div className="absolute inset-0 bg-black/65" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.18),transparent_28%)]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <section className="hidden lg:block">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">
            Ledgerly
          </p>

          <h1 className="mt-6 max-w-2xl text-6xl font-semibold leading-tight">
            Run your bar with sharper control, cleaner numbers, and better
            visibility.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
            Track sales, manage cocktails, monitor stock, and unlock operational
            insights through one modern dashboard built for bar teams.
          </p>

          <div className="mt-10 flex gap-8 text-sm text-white/65">
            <div>
              <p className="text-2xl font-semibold text-white">Sales</p>
              <p className="mt-1">Track daily performance</p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-white">Inventory</p>
              <p className="mt-1">Control ingredients and stock</p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-white">Insights</p>
              <p className="mt-1">See trends that matter</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <Link to="/" className="text-sm text-white/70 hover:text-white">
                ← Home
              </Link>
            </div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400 lg:hidden">
              Ledgerly
            </p>

            <h2 className="mt-2 text-3xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-white/65">
              Sign in to access your bar analytics dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/75">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-emerald-400/60"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/75">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-emerald-400/60"
                  placeholder="••••••••"
                  required
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
                className="w-full rounded-2xl bg-emerald-500 px-5 py-3 font-medium text-black transition hover:scale-[1.01] hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-white/65">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-emerald-400 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
