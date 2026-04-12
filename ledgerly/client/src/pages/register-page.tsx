import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import authBg from "../assets/auth-bg.jpg";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
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
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Try a different email.");
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

      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.16),transparent_28%)]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <section className="hidden lg:block">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">
            Ledgerly
          </p>

          <h1 className="mt-6 max-w-2xl text-6xl font-semibold leading-tight">
            Create your workspace and start managing smarter.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
            Set up your account to access sales insights, ingredient tracking,
            and bar operations data in one premium dashboard.
          </p>

          <div className="mt-10 flex gap-8 text-sm text-white/65">
            <div>
              <p className="text-2xl font-semibold text-white">Setup</p>
              <p className="mt-1">Create your workspace fast</p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-white">Control</p>
              <p className="mt-1">Organize stock and recipes</p>
            </div>

            <div>
              <p className="text-2xl font-semibold text-white">Growth</p>
              <p className="mt-1">Track performance over time</p>
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

            <h2 className="mt-2 text-3xl font-semibold">Create account</h2>
            <p className="mt-2 text-white/65">
              Set up your account to start using Ledgerly.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/75">
                  Full name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-emerald-400/60"
                  placeholder="Patience Evertsson"
                  required
                />
              </div>

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
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-white/65">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
