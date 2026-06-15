import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/withdraw")({
  head: () => ({ meta: [{ title: "Withdraw — Fondeo" }] }),
  component: WithdrawPage,
});

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

const schema = z.object({
  amount: z.number().positive().max(1_000_000),
  wallet_address: z.string().trim().min(10).max(120),
});

function WithdrawPage() {
  const { user } = useAuth();
  const uid = user?.id;
  const qc = useQueryClient();

  const { data: account } = useQuery({
    queryKey: ["account", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("accounts").select("*").eq("user_id", uid!).maybeSingle();
      return data;
    },
  });

  const { data: history } = useQuery({
    queryKey: ["withdrawals", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("withdrawals").select("*").eq("user_id", uid!).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault();
    if (!uid) return;
    const parsed = schema.safeParse({ amount: Number(amount), wallet_address: wallet });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const amt = parsed.data.amount;
    const bal = Number(account?.balance ?? 0);
    if (amt > bal) return toast.error("Insufficient balance");
    setBusy(true);
    try {
      const { error } = await supabase.from("withdrawals").insert({
        user_id: uid, amount: amt, wallet_address: parsed.data.wallet_address,
      });
      if (error) throw error;
      await supabase.from("transactions").insert({ user_id: uid, type: "withdrawal", amount: amt, status: "pending", note: parsed.data.wallet_address });
      await supabase.from("accounts").update({
        balance: bal - amt,
        total_withdrawn: Number(account?.total_withdrawn ?? 0) + amt,
        updated_at: new Date().toISOString(),
      }).eq("user_id", uid);
      toast.success("Withdrawal request submitted");
      setAmount(""); setWallet("");
      qc.invalidateQueries();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Withdrawal failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Withdraw Funds</h1>
        <p className="text-sm text-muted-foreground">Submit a withdrawal to your crypto wallet. Processing takes up to 24h.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form onSubmit={handleWithdraw} className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="rounded-lg bg-muted/50 p-3 text-sm">
            Available balance: <span className="font-semibold">{fmt(Number(account?.balance ?? 0))}</span>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Amount (USD)</label>
            <input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} required
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Wallet Address (USDT/TRC20 or BTC)</label>
            <input value={wallet} onChange={(e) => setWallet(e.target.value)} required
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono" />
          </div>
          <button disabled={busy} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-60">
            {busy ? "Submitting..." : "Request Withdrawal"}
          </button>
        </form>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold">Withdrawal History</h2>
          <div className="mt-4 space-y-2">
            {(history?.length ?? 0) === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No withdrawals yet</p>
            ) : history!.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold">{fmt(Number(w.amount))}</div>
                  <div className="truncate font-mono text-xs text-muted-foreground">{w.wallet_address}</div>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${w.status === "completed" ? "bg-green-500/10 text-green-400" : w.status === "rejected" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                    {w.status}
                  </span>
                  <div className="mt-1 text-xs text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
