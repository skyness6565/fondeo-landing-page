import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Fondeo" }] }),
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth" });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) throw redirect({ to: "/dashboard" });
  },
  component: AdminPage,
});

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

function AdminPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"users" | "plans" | "investments">("users");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Manage users, balances, ROI rates, and active investments.</p>
      </header>

      <div className="flex gap-2 border-b border-border">
        {(["users", "plans", "investments"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm capitalize ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "users" && <UsersTab qc={qc} />}
      {tab === "plans" && <PlansTab qc={qc} />}
      {tab === "investments" && <InvestmentsTab qc={qc} />}
    </div>
  );
}

function UsersTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { data } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const [profilesRes, accountsRes] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("accounts").select("*"),
      ]);
      const profiles = profilesRes.data || [];
      const accounts = accountsRes.data || [];
      return profiles.map((p) => ({
        ...p,
        account: accounts.find((a) => a.user_id === p.id),
      }));
    },
  });

  const [amounts, setAmounts] = useState<Record<string, string>>({});

  async function adjust(userId: string, delta: number, label: string) {
    const acct = data?.find((u) => u.id === userId)?.account;
    if (!acct) return toast.error("No account");
    const newBal = Math.max(0, Number(acct.balance) + delta);
    const { error } = await supabase
      .from("accounts")
      .update({ balance: newBal, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
    if (error) return toast.error(error.message);
    await supabase.from("transactions").insert({
      user_id: userId,
      type: delta > 0 ? "deposit" : "adjustment",
      amount: Math.abs(delta),
      note: `Admin ${label}`,
      status: "completed",
    });
    toast.success("Balance updated");
    setAmounts((s) => ({ ...s, [userId]: "" }));
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  async function setROI(userId: string, roi: number) {
    const acct = data?.find((u) => u.id === userId)?.account;
    if (!acct) return;
    const { error } = await supabase
      .from("accounts")
      .update({ total_roi: roi, updated_at: new Date().toISOString() })
      .eq("user_id", userId);
    if (error) return toast.error(error.message);
    toast.success("ROI updated");
    qc.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="p-3">User</th>
            <th className="p-3">Balance</th>
            <th className="p-3">Invested</th>
            <th className="p-3">Total ROI</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((u) => {
            const amt = Number(amounts[u.id] || 0);
            return (
              <tr key={u.id} className="border-b border-border/50">
                <td className="p-3">
                  <div className="font-medium">{u.full_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{u.id.slice(0, 8)}…</div>
                </td>
                <td className="p-3 font-semibold">{fmt(Number(u.account?.balance ?? 0))}</td>
                <td className="p-3">{fmt(Number(u.account?.total_invested ?? 0))}</td>
                <td className="p-3">
                  <input
                    type="number"
                    defaultValue={Number(u.account?.total_roi ?? 0)}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v !== Number(u.account?.total_roi ?? 0)) setROI(u.id, v);
                    }}
                    className="w-28 rounded-md border border-border bg-background px-2 py-1 text-xs"
                  />
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={amounts[u.id] || ""}
                      onChange={(e) => setAmounts((s) => ({ ...s, [u.id]: e.target.value }))}
                      className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs"
                    />
                    <button
                      onClick={() => amt > 0 && adjust(u.id, amt, "credit")}
                      className="rounded-md bg-green-600 px-2 py-1 text-xs font-semibold text-white"
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => amt > 0 && adjust(u.id, -amt, "debit")}
                      className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white"
                    >
                      − Remove
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PlansTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { data: plans } = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: async () => (await supabase.from("investment_plans").select("*").order("min_amount")).data || [],
  });

  const [newPlan, setNewPlan] = useState({ name: "", daily_roi_percent: "", duration_days: "", min_amount: "", max_amount: "" });

  async function updatePlan(id: string, field: string, value: number) {
    const { error } = await supabase.from("investment_plans").update({ [field]: value }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Plan updated");
    qc.invalidateQueries({ queryKey: ["admin", "plans"] });
    qc.invalidateQueries({ queryKey: ["plans"] });
  }

  async function deletePlan(id: string) {
    if (!confirm("Delete this plan?")) return;
    const { error } = await supabase.from("investment_plans").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "plans"] });
  }

  async function createPlan() {
    const payload = {
      name: newPlan.name,
      daily_roi_percent: Number(newPlan.daily_roi_percent),
      duration_days: Number(newPlan.duration_days),
      min_amount: Number(newPlan.min_amount),
      max_amount: Number(newPlan.max_amount),
    };
    if (!payload.name || !payload.daily_roi_percent) return toast.error("Fill in all fields");
    const { error } = await supabase.from("investment_plans").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Plan created");
    setNewPlan({ name: "", daily_roi_percent: "", duration_days: "", min_amount: "", max_amount: "" });
    qc.invalidateQueries({ queryKey: ["admin", "plans"] });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="mb-3 font-semibold">Create New Plan</h3>
        <div className="grid gap-2 sm:grid-cols-5">
          <input placeholder="Name" value={newPlan.name} onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
          <input placeholder="Daily ROI %" type="number" step="0.01" value={newPlan.daily_roi_percent} onChange={(e) => setNewPlan({ ...newPlan, daily_roi_percent: e.target.value })} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
          <input placeholder="Duration (days)" type="number" value={newPlan.duration_days} onChange={(e) => setNewPlan({ ...newPlan, duration_days: e.target.value })} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
          <input placeholder="Min $" type="number" value={newPlan.min_amount} onChange={(e) => setNewPlan({ ...newPlan, min_amount: e.target.value })} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
          <input placeholder="Max $" type="number" value={newPlan.max_amount} onChange={(e) => setNewPlan({ ...newPlan, max_amount: e.target.value })} className="rounded-md border border-border bg-background px-2 py-1.5 text-sm" />
        </div>
        <button onClick={createPlan} className="mt-3 rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
          Add Plan
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Daily ROI %</th>
              <th className="p-3">Duration (days)</th>
              <th className="p-3">Min</th>
              <th className="p-3">Max</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {plans?.map((p) => (
              <tr key={p.id} className="border-b border-border/50">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">
                  <input type="number" step="0.01" defaultValue={p.daily_roi_percent} onBlur={(e) => { const v = Number(e.target.value); if (v !== p.daily_roi_percent) updatePlan(p.id, "daily_roi_percent", v); }} className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs" />
                </td>
                <td className="p-3">
                  <input type="number" defaultValue={p.duration_days} onBlur={(e) => { const v = Number(e.target.value); if (v !== p.duration_days) updatePlan(p.id, "duration_days", v); }} className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs" />
                </td>
                <td className="p-3">
                  <input type="number" defaultValue={p.min_amount} onBlur={(e) => { const v = Number(e.target.value); if (v !== p.min_amount) updatePlan(p.id, "min_amount", v); }} className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs" />
                </td>
                <td className="p-3">
                  <input type="number" defaultValue={p.max_amount} onBlur={(e) => { const v = Number(e.target.value); if (v !== p.max_amount) updatePlan(p.id, "max_amount", v); }} className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs" />
                </td>
                <td className="p-3">
                  <button onClick={() => deletePlan(p.id)} className="rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InvestmentsTab({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { data } = useQuery({
    queryKey: ["admin", "investments"],
    queryFn: async () =>
      (await supabase.from("investments").select("*").order("created_at", { ascending: false })).data || [],
  });

  async function update(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("investments").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin", "investments"] });
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="p-3">Plan</th>
            <th className="p-3">User</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Daily ROI %</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((inv) => (
            <tr key={inv.id} className="border-b border-border/50">
              <td className="p-3 font-medium">{inv.plan_name}</td>
              <td className="p-3 text-xs text-muted-foreground">{inv.user_id.slice(0, 8)}…</td>
              <td className="p-3">{fmt(Number(inv.amount))}</td>
              <td className="p-3">
                <input
                  type="number"
                  step="0.01"
                  defaultValue={inv.daily_roi_percent}
                  onBlur={(e) => { const v = Number(e.target.value); if (v !== inv.daily_roi_percent) update(inv.id, { daily_roi_percent: v }); }}
                  className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs"
                />
              </td>
              <td className="p-3">
                <select
                  defaultValue={inv.status}
                  onChange={(e) => update(inv.id, { status: e.target.value })}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                >
                  <option value="pending">pending</option>
                  <option value="active">active</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
