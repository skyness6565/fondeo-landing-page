import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useMemo } from "react";
import { Wallet, TrendingUp, ArrowDownToLine, Activity, ArrowUpRight, ShieldCheck, Sparkles, Globe2, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Fondeo" }] }),
  component: DashboardPage,
});

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
const fmtPrecise = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 6, maximumFractionDigits: 6 }).format(n || 0);


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

  // Live tick for real-time accruals
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Compute accrued (unrealized) profit from active investments, second-by-second
  const liveAccrued = useMemo(() => {
    if (!investments) return 0;
    return investments.reduce((sum, inv) => {
      if (inv.status !== "active") return sum;
      const amt = Number(inv.amount);
      const roi = Number(inv.daily_roi_percent);
      const days = Number(inv.duration_days);
      const target = (amt * roi * days) / 100;
      const totalSec = days * 86400;
      const elapsedSec = Math.max(0, (now - new Date(inv.start_date ?? inv.created_at).getTime()) / 1000);
      const earned = Math.min(target, (target * elapsedSec) / totalSec);
      return sum + earned;
    }, 0);
  }, [investments, now]);

  const liveBalance = Number(account?.balance ?? 0) + liveAccrued;
  const liveRoi = Number(account?.total_roi ?? 0) + liveAccrued;

  const stats = [
    { label: "Available Balance", value: fmtPrecise(liveBalance), icon: Wallet, color: "text-primary" },
    { label: "Total Invested", value: fmt(Number(account?.total_invested ?? 0)), icon: TrendingUp, color: "text-blue-400" },
    { label: "Total ROI Earned", value: fmtPrecise(liveRoi), icon: Activity, color: "text-green-400" },
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
          <div className="mt-4 space-y-3">
            {(investments?.length ?? 0) === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No investments yet</p>
            ) : investments!.map((inv) => (
              <InvestmentRow key={inv.id} inv={inv} now={now} />
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

type Investment = {
  id: string;
  plan_name: string;
  amount: number | string;
  daily_roi_percent: number | string;
  duration_days: number;
  status: string;
  start_date?: string | null;
  created_at: string;
};

function InvestmentRow({ inv, now }: { inv: Investment; now: number }) {
  const [open, setOpen] = useState(false);
  const amt = Number(inv.amount);
  const roi = Number(inv.daily_roi_percent);
  const days = Number(inv.duration_days);
  const target = (amt * roi * days) / 100;
  const totalSec = days * 86400;
  const perSec = totalSec > 0 ? target / totalSec : 0;
  const startMs = new Date(inv.start_date ?? inv.created_at).getTime();
  const isActive = inv.status === "active";
  const isCompleted = inv.status === "completed";
  const rawElapsed = Math.max(0, (now - startMs) / 1000);
  const elapsedSec = isActive ? Math.min(rawElapsed, totalSec) : isCompleted ? totalSec : 0;
  const progress = totalSec > 0 ? elapsedSec / totalSec : 0;
  const earned = perSec * elapsedSec;
  const elapsedDays = Math.floor(elapsedSec / 86400);
  const hh = String(Math.floor((elapsedSec % 86400) / 3600)).padStart(2, "0");
  const mm = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, "0");
  const ss = String(Math.floor(elapsedSec % 60)).padStart(2, "0");

  const milestones = (() => {
    if (!isActive && !isCompleted) return [] as { t: number; profit: number; label: string }[];
    const out: { t: number; profit: number; label: string }[] = [];
    const elapsedMin = Math.floor(elapsedSec / 60);
    const count = Math.min(20, elapsedMin + 1);
    for (let i = 0; i < count; i++) {
      const minMark = elapsedMin - i;
      const t = minMark * 60;
      if (t < 0) break;
      out.push({
        t,
        profit: perSec * t,
        label: new Date(startMs + t * 1000).toLocaleTimeString(),
      });
    }
    return out;
  })();

  return (
    <div className="rounded-lg border border-border/60 p-3 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">
            {inv.plan_name}
            <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] capitalize ${isActive ? "bg-green-500/10 text-green-400" : isCompleted ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"}`}>{inv.status}</span>
          </div>
          <div className="text-xs text-muted-foreground">{roi}% daily · {days}d · {fmt(amt)}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-green-400 tabular-nums">{fmtPrecise(earned)}</div>
          <div className="text-xs text-muted-foreground">of {fmt(target)}</div>
        </div>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-green-400 transition-all duration-1000 ease-linear"
          style={{ width: `${(progress * 100).toFixed(4)}%` }}
        />
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground tabular-nums">
        <span>Elapsed: <span className="text-foreground">{elapsedDays}d {hh}:{mm}:{ss}</span> / {days}d</span>
        <span className="text-center">Progress: <span className="text-foreground">{(progress * 100).toFixed(4)}%</span></span>
        <span className="text-right">Rate: <span className="text-foreground">{fmtPrecise(perSec)}/s</span></span>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground tabular-nums">
        <span>$0</span>
        <span className="text-green-400">{fmtPrecise(earned)} earned</span>
        <span>{fmt(target)} target</span>
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-2 text-[10px] uppercase tracking-wider text-primary hover:underline"
      >
        {open ? "Hide" : "Show"} earnings history
      </button>
      {open && (
        <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-border/60 bg-muted/30 p-2">
          {milestones.length === 0 ? (
            <p className="py-2 text-center text-[10px] text-muted-foreground">No accruals yet</p>
          ) : (
            <table className="w-full text-[10px] tabular-nums">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="text-left">Minute</th>
                  <th className="text-left">Time</th>
                  <th className="text-right">Cumulative Profit</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((m) => (
                  <tr key={m.t} className="border-t border-border/40">
                    <td className="py-0.5">+{Math.floor(m.t / 60)}m</td>
                    <td>{m.label}</td>
                    <td className="text-right text-green-400">{fmtPrecise(m.profit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
