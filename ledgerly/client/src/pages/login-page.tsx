import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

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
    <main className="min-h-screen bg-[#0b0f19] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center">
        <div className="grid w-full gap-10 md:grid-cols-2">
          <section>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
              Ledgerly
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight">
              Sign in to manage bar performance with clarity.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Track sales, monitor inventory, and access operational insights
              from one modern dashboard.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold">Login</h2>
            <p className="mt-2 text-white/60">
              Enter your credentials to access Ledgerly.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-white/25"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
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
                  className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-white/25"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error ? (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-medium text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-sm text-white/60">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-emerald-400 hover:underline">
                Create one
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
