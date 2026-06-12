import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/trading-programs/")({
  head: () => ({
    meta: [
      { title: "Trading Programs — Funded Accounts $10K to $200K" },
      { name: "description", content: "Choose from $10K, $25K, $50K, $100K and $200K funded simulated trading accounts. One-step, two-step, and subscription challenges." },
      { property: "og:title", content: "Trading Programs — Fondeo" },
      { property: "og:description", content: "Funded account sizes from $10,000 to $200,000." },
    ],
  }),
  component: Programs,
});

const PROGRAMS = [
  { size: "$10,000", price: "$59", target: "8% / 5%", drawdown: "5% daily / 10% total", popular: false },
  { size: "$25,000", price: "$149", target: "8% / 5%", drawdown: "5% daily / 10% total", popular: false },
  { size: "$50,000", price: "$249", target: "8% / 5%", drawdown: "5% daily / 10% total", popular: true },
  { size: "$100,000", price: "$429", target: "8% / 5%", drawdown: "5% daily / 10% total", popular: false },
  { size: "$200,000", price: "$839", target: "8% / 5%", drawdown: "5% daily / 10% total", popular: false },
];

function Programs() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Funded accounts"
        title="Trading Programs"
        subtitle="Pick the simulated account size that matches your style. All evaluations follow the same transparent rules."
      />
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {PROGRAMS.map((p) => (
            <div
              key={p.size}
              className={`relative rounded-2xl border bg-card/40 p-6 transition-all hover:-translate-y-1 ${
                p.popular ? "border-primary shadow-[var(--shadow-glow)]" : "border-border/60"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Account size</div>
              <div className="mt-1 font-display text-3xl font-bold">{p.size}</div>
              <div className="mt-4 font-display text-2xl text-primary">{p.price}</div>
              <div className="text-xs text-muted-foreground">one-time evaluation fee</div>
              <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> Profit target {p.target}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> Drawdown {p.drawdown}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> Up to 90% profit split</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> Unlimited trading days</li>
              </ul>
              <Link
                to="/trading-programs/$size"
                params={{ size: p.size.replace(/[^0-9]/g, "") }}
                className="mt-6 inline-flex w-full items-center justify-center gap-1 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Learn more <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
