import { createFileRoute, Outlet, redirect, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, TrendingUp, ArrowDownToLine, Receipt, LogOut, User as UserIcon, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => (
    <AuthProvider>
      <DashboardLayout />
    </AuthProvider>
  ),
});

const BASE_NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/invest", label: "Invest", icon: TrendingUp },
  { to: "/withdraw", label: "Withdraw", icon: ArrowDownToLine },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/account", label: "Account", icon: UserIcon },
] as const;

function DashboardLayout() {
  const router = useRouter();
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" });
      return !!data;
    },
  });

  const NAV = isAdmin
    ? [...BASE_NAV, { to: "/admin" as const, label: "Admin", icon: Shield }]
    : BASE_NAV;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-[env(safe-area-inset-bottom)]">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-3 sm:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <span className="truncate font-display font-bold">Fondeo</span>
          </Link>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground md:inline">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-6 px-3 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-4 sm:px-4 sm:py-6 lg:pb-6">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1">
            {NAV.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom tab bar (portrait + landscape) */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul
          className="mx-auto grid max-w-7xl"
          style={{ gridTemplateColumns: `repeat(${NAV.length}, minmax(0, 1fr))` }}
        >
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <li key={n.to} className="contents">
                <Link
                  to={n.to}
                  aria-label={n.label}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground active:bg-muted"}`}
                >
                  <n.icon className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform`} />
                  <span className="max-w-full truncate leading-tight">{n.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
