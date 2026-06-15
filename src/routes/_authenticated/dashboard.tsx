import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Wallet, TrendingUp, ArrowDownToLine, Activity, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Fondeo" }] }),
  component: DashboardPage,
});

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

function DashboardPage() {
  const { user } = useAuth();
  const uid = user?.id;

  const { data: account } = useQuery({
    queryKey: ["account", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("accounts").select("*").eq("user_id", uid!).maybeSingle();
      return data;
    },
  });

  const { data: investments } = useQuery({
    queryKey: ["investments", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("investments").select("*").eq("user_id", uid!).order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
  });

  const { data: txns } = useQuery({
    queryKey: ["txns-recent", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("*").eq("user_id", uid!).order("created_at", { ascending: false }).limit(6);
      return data || [];
    },
  });

  const stats = [
    { label: "Available Balance", value: fmt(Number(account?.balance ?? 0)), icon: Wallet, color: "text-primary" },
    { label: "Total Invested", value: fmt(Number(account?.total_invested ?? 0)), icon: TrendingUp, color: "text-blue-400" },
    { label: "Total ROI Earned", value: fmt(Number(account?.total_roi ?? 0)), icon: Activity, color: "text-green-400" },
    { label: "Total Withdrawn", value: fmt(Number(account?.total_withdrawn ?? 0)), icon: ArrowDownToLine, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/invest" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
            New Investment
          </Link>
          <Link to="/withdraw" className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
            Withdraw
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <div className="mt-3 font-display text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Active Investments</h2>
            <Link to="/invest" className="text-xs text-primary hover:underline">View all <ArrowUpRight className="inline h-3 w-3" /></Link>
          </div>
          <div className="mt-4 space-y-2">
            {(investments?.length ?? 0) === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No investments yet</p>
            ) : investments!.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3 text-sm">
                <div>
                  <div className="font-medium">{inv.plan_name}</div>
                  <div className="text-xs text-muted-foreground">{inv.daily_roi_percent}% daily · {inv.duration_days}d</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{fmt(Number(inv.amount))}</div>
                  <div className="text-xs text-green-400 capitalize">{inv.status}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Transactions</h2>
            <Link to="/transactions" className="text-xs text-primary hover:underline">View all <ArrowUpRight className="inline h-3 w-3" /></Link>
          </div>
          <div className="mt-4 space-y-2">
            {(txns?.length ?? 0) === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No transactions yet</p>
            ) : txns!.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3 text-sm">
                <div>
                  <div className="font-medium capitalize">{t.type}</div>
                  <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{fmt(Number(t.amount))}</div>
                  <div className="text-xs capitalize text-muted-foreground">{t.status}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
