import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";

const DETAILS: Record<string, { size: string; price: string; payout: string; target: string }> = {
  "10000": { size: "$10,000", price: "$59", payout: "$700", target: "8%" },
  "25000": { size: "$25,000", price: "$149", payout: "$1,750", target: "8%" },
  "50000": { size: "$50,000", price: "$249", payout: "$3,500", target: "8%" },
  "100000": { size: "$100,000", price: "$429", payout: "$7,000", target: "8%" },
  "200000": { size: "$200,000", price: "$839", payout: "$14,000", target: "8%" },
};

export const Route = createFileRoute("/trading-programs/$size")({
  head: ({ params }) => {
    const d = DETAILS[params.size];
    return {
      meta: [
        { title: `${d?.size ?? "Program"} Funded Account — Fondeo` },
        { name: "description", content: `Full details for the ${d?.size ?? ""} simulated funded trading program: targets, drawdowns, splits and fees.` },
      ],
    };
  },
  loader: ({ params }) => {
    if (!DETAILS[params.size]) throw notFound();
    return DETAILS[params.size];
  },
  component: ProgramDetail,
  notFoundComponent: () => (
    <PageShell>
      <PageHero title="Program not found" subtitle="That account size doesn't exist." />
    </PageShell>
  ),
});

function ProgramDetail() {
  const d = Route.useLoaderData();
  return (
    <PageShell>
      <PageHero eyebrow="Account detail" title={`${d.size} Funded Program`} subtitle={`Evaluation fee ${d.price} — target ${d.target} — first cycle payout up to ${d.payout}.`} />
      <section className="mx-auto max-w-4xl px-4 py-16">
        <Link to="/trading-programs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to programs
        </Link>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <h3 className="font-display text-lg font-semibold">Objectives</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                `Profit target: ${d.target} of starting balance`,
                "Max daily drawdown: 5%",
                "Max overall drawdown: 10%",
                "Minimum 5 trading days",
                "Stop loss mandatory on every position",
                "No weekend holding required",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
            <h3 className="font-display text-lg font-semibold">After you pass</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> 80% starting profit split (scales to 90%)</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Bi-weekly USDT payouts</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> +25% account scaling per successful cycle</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Evaluation fee refunded on first payout</li>
            </ul>
            <div className="mt-6 rounded-lg bg-primary/10 p-4 text-center">
              <div className="text-xs text-muted-foreground">Evaluation fee</div>
              <div className="font-display text-3xl font-bold text-primary">{d.price}</div>
            </div>
            <button className="mt-4 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
              Start {d.size} evaluation
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
