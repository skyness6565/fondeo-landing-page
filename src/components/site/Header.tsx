import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, TrendingUp, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const LINKS = [
  { to: "/how-it-works", label: "How It Works" },
  { to: "/trading-programs", label: "Trading Programs" },
  { to: "/rules", label: "Rules" },
  { to: "/blog", label: "Blog" },
  { to: "/partner", label: "Partner" },
  { to: "/about-us", label: "About Us" },
  { to: "/faq", label: "F.A.Q." },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);
  // Auto-close on route change & lock body scroll while open
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Fondeo</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "text-foreground bg-muted" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          ) : (
            <>
              <Link to="/auth" className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <Link
                to="/auth"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
              >
                Register
              </Link>
            </>
          )}
        </div>
        <button
          aria-label="Toggle menu"
          className="grid h-9 w-9 place-items-center rounded-md border border-border lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-foreground bg-muted" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={user ? "/dashboard" : "/auth"}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
            >
              {user ? "Dashboard" : "Sign in / Register"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
