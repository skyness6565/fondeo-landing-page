import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus, LayoutGrid, Target, Shield, KeyRound, Wallet, ArrowRight } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Fondeo Funded Trading Process" },
      { name: "description", content: "Six clear steps from free account to funded trader: register, choose a program, pass the evaluation, manage risk, get funded, earn profit splits." },
      { property: "og:title", content: "How Fondeo Funding Works" },
      { property: "og:description", content: "Step-by-step process to qualify for simulated funded capital." },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  { n: 1, i: UserPlus, t: "Create a free account", d: "Sign up in under two minutes. No credit card required for the initial registration. Verify your email and you're inside the dashboard." },
  { n: 2, i: LayoutGrid, t: "Select a trading program", d: "Pick a one-step, two-step, or subscription challenge. Choose your account size from $10K to $200K depending on your style and risk tolerance." },
  { n: 3, i: Target, t: "Complete the evaluation", d: "Hit the profit target within the allowed drawdown. Trade as many days as you need — there is no time limit. Stay consistent and disciplined." },
  { n: 4, i: Shield, t: "Demonstrate risk management", d: "Respect daily and overall drawdown limits, place stop losses on every trade, and avoid prohibited strategies. Risk control is how you keep your funding." },
  { n: 5, i: KeyRound, t: "Receive access to funded capital", d: "Pass and you'll be promoted to a simulated funded account with the same trading objectives — minus the profit target. Trade live demo capital." },
  { n: 6, i: Wallet, t: "Earn profit splits", d: "Withdraw your profit share in USDT on bi-weekly cycles. Start at 80% and scale to 90% with consistent performance and risk management." },
];

function HowItWorks() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Process"
        title="How It Works"
        subtitle="From sign-up to your first payout in six clear steps. No hidden conditions, no surprises."
      />
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border/60 bg-card/40 p-8 transition-colors hover:border-primary/40">
              <div className="absolute right-6 top-6 font-display text-6xl font-bold text-primary/10">{s.n}</div>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.i className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">Step {s.n}: {s.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link to="/trading-programs" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]">
            Start your evaluation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
