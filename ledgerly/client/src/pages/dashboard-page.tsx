import { useAuth } from "../context/auth-context";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-[#0b0f19] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
              Ledgerly Dashboard
            </p>

            <h1 className="mt-3 text-4xl font-semibold">
              Welcome back{user ? `, ${user.fullName}` : ""}.
            </h1>

            <p className="mt-3 text-white/70">
              You are authenticated and ready to continue building Ledgerly.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/ingredients"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Ingredients
            </Link>

            <Link
              to="/cocktails"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Cocktails
            </Link>

            <Link
              to="/sales"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Sales
            </Link>

            <button
              onClick={logout}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Role</p>
            <h2 className="mt-3 text-2xl font-semibold">{user?.role}</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Email</p>
            <h2 className="mt-3 text-lg font-semibold break-all">
              {user?.email}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/60">Status</p>
            <h2 className="mt-3 text-2xl font-semibold text-emerald-400">
              Authenticated
            </h2>
          </div>
        </div>
      </div>
    </main>
  );
}
