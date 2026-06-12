import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Shield, Target, TrendingDown, Wallet, XCircle } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "Trading Rules & Risk Management — Fondeo" },
      { name: "description", content: "Complete rulebook: drawdown limits, profit targets, payout rules, and prohibited trading activities." },
      { property: "og:title", content: "Trading Rules — Fondeo" },
      { property: "og:description", content: "Transparent rules for every funded program." },
    ],
  }),
  component: Rules,
});

const SECTIONS = [
  {
    i: Target, t: "Profit targets", items: [
      "One-step challenge: 8% of starting balance",
      "Two-step challenge: 8% (phase 1), 5% (phase 2)",
      "Subscription accounts: no profit target — earn while you trade",
      "No time limit to hit the target",
    ],
  },
  {
    i: TrendingDown, t: "Drawdown limits", items: [
      "Maximum daily drawdown: 5% of starting balance",
      "Maximum overall drawdown: 10% of starting balance",
      "Drawdown is calculated on equity, not just closed P/L",
      "Breaching either limit ends the evaluation immediately",
    ],
  },
  {
    i: Shield, t: "Risk management", items: [
      "A stop loss is mandatory on every open position",
      "Maximum risk per trade: 2% of account balance recommended",
      "Minimum 5 trading days before payout eligibility",
      "At least 3 trades per active day",
    ],
  },
  {
    i: Wallet, t: "Payout rules", items: [
      "Bi-weekly payout cycles paid in USDT (TRC-20 / ERC-20)",
      "80% starting split, scales to 90% with consistency",
      "First payout: evaluation fee refunded in full",
      "No fees on withdrawals — you receive the full split",
    ],
  },
  {
    i: XCircle, t: "Prohibited activities", items: [
      "Latency arbitrage, tick scalping, or HFT exploits",
      "Account sharing or copy-trading from third parties",
      "Use of internal data, leaks, or insider information",
      "Hedging across multiple accounts at the firm",
      "Reverse trading or grid martingale strategies",
    ],
  },
];

function Rules() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Rulebook"
        title="Trading Rules"
        subtitle="Every rule is published up front. Pass the evaluation by trading within them, and we keep the relationship transparent forever."
      />
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {SECTIONS.map((s) => (
            <div key={s.t} className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <s.i className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold">{s.t}</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {s.items.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> All accounts are simulated.
            We never guarantee profits and we never claim risk-free returns. Trading involves
            substantial risk; only participate if you understand the educational and evaluative
            nature of this platform.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
