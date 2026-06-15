import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({ meta: [{ title: "Transactions — Fondeo" }] }),
  component: TxnPage,
});

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

function TxnPage() {
  const { user } = useAuth();
  const uid = user?.id;
  const { data } = useQuery({
    queryKey: ["transactions-all", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("*").eq("user_id", uid!).order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Transaction History</h1>
        <p className="text-sm text-muted-foreground">All deposits, investments, withdrawals and ROI payouts.</p>
      </header>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Note</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.length ?? 0) === 0 ? (
              <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">No transactions yet</td></tr>
            ) : data!.map((t) => (
              <tr key={t.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3 text-muted-foreground">{new Date(t.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 capitalize">{t.type}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.note ?? "—"}</td>
                <td className="px-4 py-3 text-right font-semibold">{fmt(Number(t.amount))}</td>
                <td className="px-4 py-3 text-right capitalize">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
