import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DollarSign, Link2, Users, Gift, TrendingUp } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Partner & Affiliate Program — Earn With Fondeo" },
      { name: "description", content: "Join the Fondeo affiliate program. Earn up to 20% commission on every referred trader. Real-time tracking and monthly USDT payouts." },
      { property: "og:title", content: "Become a Fondeo Partner" },
      { property: "og:description", content: "Earn recurring commissions by referring traders." },
    ],
  }),
  component: Partner,
});

const BENEFITS = [
  { i: DollarSign, t: "Up to 20% commission", d: "Earn a generous share of every evaluation fee paid by traders you refer." },
  { i: TrendingUp, t: "Recurring rewards", d: "When your referrals scale or re-take, you keep earning — no one-shot bounties." },
  { i: Link2, t: "Real-time tracking", d: "A live dashboard with clicks, signups, conversions and payout history." },
  { i: Users, t: "Co-marketing support", d: "Banners, copy, video assets and a dedicated partner manager for top affiliates." },
  { i: Gift, t: "Monthly USDT payouts", d: "Withdraw from $50 minimum. No invoices, no waiting on bank wires." },
];

function Partner() {
  const [done, setDone] = useState(false);
  return (
    <PageShell>
      <PageHero
        eyebrow="Affiliate program"
        title="Partner with Fondeo"
        subtitle="Refer traders, educators and trading communities. Earn recurring commission with transparent tracking."
      />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.t} className="rounded-2xl border border-border/60 bg-card/40 p-6">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <b.i className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="font-display text-3xl font-bold">Commission tiers</h2>
            <p className="mt-3 text-muted-foreground">
              The more active traders you bring, the higher your share on each evaluation fee.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-card/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3 text-left">Tier</th>
                    <th className="p-3 text-left">Active referrals / month</th>
                    <th className="p-3 text-left">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Starter", "1 – 9", "10%"],
                    ["Pro", "10 – 49", "15%"],
                    ["Elite", "50+", "20%"],
                  ].map((r) => (
                    <tr key={r[0]} className="border-t border-border/60">
                      <td className="p-3 font-semibold">{r[0]}</td>
                      <td className="p-3 text-muted-foreground">{r[1]}</td>
                      <td className="p-3 text-primary">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
            className="rounded-2xl border border-border/60 bg-card/40 p-6"
          >
            <h2 className="font-display text-2xl font-bold">Become a Partner</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tell us about your audience.</p>
            {done ? (
              <div className="mt-6 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm">
                Application received. We'll reach out within 48 hours.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <input required placeholder="Full name" className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
                <input required type="email" placeholder="Email" className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
                <input required placeholder="Website or social handle" className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
                <select required defaultValue="" className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm">
                  <option value="" disabled>Audience size</option>
                  <option>Under 1,000</option>
                  <option>1,000 – 10,000</option>
                  <option>10,000 – 100,000</option>
                  <option>100,000+</option>
                </select>
                <textarea required rows={4} placeholder="Tell us about your community" className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
                <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                  Submit application
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </PageShell>
  );
}
