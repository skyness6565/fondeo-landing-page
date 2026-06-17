import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight, Shield, TrendingUp, Trophy, Users, Zap, Globe,
  CheckCircle2, Star, BarChart3, Wallet, HeadphonesIcon, Quote,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import danielImg from "@/assets/people/daniel.jpg";
import meiImg from "@/assets/people/mei.jpg";
import tomasImg from "@/assets/people/tomas.jpg";
import alexImg from "@/assets/people/alex.jpg";
import priyaImg from "@/assets/people/priya.jpg";
import marcoImg from "@/assets/people/marco.jpg";
import linaImg from "@/assets/people/lina.jpg";
import hassanImg from "@/assets/people/hassan.jpg";
import yukiImg from "@/assets/people/yuki.jpg";
import profitImg from "@/assets/profit-sharing.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fondeo — Trade Without Large Personal Capital" },
      { name: "description", content: "Qualify for funded trading opportunities by demonstrating skill and risk management. Demo capital up to $200,000 with up to 90% profit splits." },
      { property: "og:title", content: "Fondeo — Funded Trading Evaluations" },
      { property: "og:description", content: "Get access to simulated funded capital by passing our evaluation. No large personal capital required." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Counter({ to, suffix = "", duration = 1500 }: { to: number; suffix?: string; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.floor(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span>{n.toLocaleString()}{suffix}</span>;
}

function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:py-28 md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Zap className="h-3 w-3" /> Funded trading evaluations
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Trade Without <span className="text-primary">Large Personal Capital</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              Qualify for funded trading opportunities by demonstrating trading skill and risk
              management through our evaluation process. Get access to simulated capital up to
              $200,000 and earn through profit splits — no guaranteed returns, just real skill rewarded.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/trading-programs" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5">
                Start Evaluation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold hover:bg-muted">
                How It Works
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> No risk to personal capital</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Up to 90% profit split</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Crypto markets 24/7</div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-[var(--shadow-glow)] backdrop-blur">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>BTC / USDT — Demo</span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">+4.82%</span>
              </div>
              <div className="mt-4 font-display text-3xl font-bold">$68,420.55</div>
              <svg viewBox="0 0 300 120" className="mt-3 h-32 w-full">
                <defs>
                  <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.82 0.18 150)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="oklch(0.82 0.18 150)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,90 L30,70 L60,80 L90,55 L120,65 L150,40 L180,50 L210,30 L240,45 L270,20 L300,28 L300,120 L0,120 Z" fill="url(#g)" />
                <path d="M0,90 L30,70 L60,80 L90,55 L120,65 L150,40 L180,50 L210,30 L240,45 L270,20 L300,28" fill="none" stroke="oklch(0.82 0.18 150)" strokeWidth="2" />
              </svg>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                {[{ l: "Equity", v: "$104,820" }, { l: "P/L", v: "+$4,820" }, { l: "Trades", v: "27" }].map((s) => (
                  <div key={s.l} className="rounded-lg border border-border/60 bg-background/40 p-3">
                    <div className="text-muted-foreground">{s.l}</div>
                    <div className="mt-1 font-display font-semibold">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Wallet Partner Badge */}
      <section className="mx-auto max-w-7xl px-4 pt-10">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3375BB] text-white shadow-md">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
              <path d="M12 2L4 5v6c0 5 3.5 9.3 8 11 4.5-1.7 8-6 8-11V5l-8-3z" fill="currentColor" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">Official partner of Trust Wallet</div>
            <p className="text-xs text-muted-foreground">
              Secure on-chain settlement. Fund and receive payouts directly to your verified ETH address.
            </p>
          </div>
          <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Verified Partner
          </span>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Why Choose Us</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Built by traders for traders. Transparent rules, fast payouts, and a fair evaluation
            that respects your time.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { i: Shield, t: "Transparent Rules", d: "Clear drawdown, profit targets and risk limits — published up front, no hidden conditions." },
            { i: Zap, t: "Fast Evaluations", d: "Pass in as few as 5 trading days and move to a funded simulated account." },
            { i: Trophy, t: "Up to 90% Splits", d: "Keep the lion's share of simulated profits. Scale capital as you perform." },
            { i: Globe, t: "Crypto-Native", d: "Trade BTC, ETH and 50+ pairs around the clock from anywhere in the world." },
            { i: Wallet, t: "USDT Payouts", d: "Withdraw your profit share in stablecoin on a predictable schedule." },
            { i: HeadphonesIcon, t: "24/7 Support", d: "A real human team available whenever the market is open — which is always." },
          ].map((f) => (
            <div key={f.t} className="rounded-xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/40">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.i className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Funding Opportunities */}
      <section className="border-y border-border/60 bg-card/20 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Funding Opportunities</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Choose the account size that fits your trading style. All accounts are simulated.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {["$10,000", "$25,000", "$50,000", "$100,000", "$200,000"].map((a, i) => (
              <Link
                key={a}
                to="/trading-programs"
                className="group rounded-xl border border-border/60 bg-background p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/60"
              >
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Account</div>
                <div className="mt-2 font-display text-2xl font-bold">{a}</div>
                <div className="mt-3 text-xs text-primary">From ${[59, 149, 249, 429, 839][i]}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Profit Sharing */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Profit Sharing Model</h2>
            <p className="mt-4 text-muted-foreground">
              Once funded, every profitable cycle is split between you and the firm. You start at
              80% and scale up to 90% as you demonstrate consistency.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Bi-weekly payout cycles paid in USDT",
                "80% starting split — scale to 90% with consistency",
                "Capital increases of 25% per successful cycle (up to 4x)",
                "No fees on withdrawals",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40">
            <img src={profitImg} alt="Trading performance chart" loading="lazy" width={1024} height={768} className="h-48 w-full object-cover" />
            <div className="p-8">
              <div className="text-sm text-muted-foreground">Example payout</div>
              <div className="mt-2 font-display text-4xl font-bold">$8,000</div>
              <div className="text-xs text-muted-foreground">on a $100,000 account at 10% gain</div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
                <div className="flex h-full">
                  <div className="h-full bg-primary" style={{ width: "80%" }} />
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-primary">Trader 80%</span>
                <span className="text-muted-foreground">Firm 20%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="border-y border-border/60 bg-card/30 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {[
            { n: 28500, s: "+", l: "Traders funded" },
            { n: 12, s: "M+", l: "Paid out (USDT)" },
            { n: 50, s: "+", l: "Crypto pairs" },
            { n: 98, s: "%", l: "Payouts on time" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-4xl font-bold text-primary">
                <Counter to={s.n} suffix={s.s} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Success Stories</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Traders who demonstrated skill, passed our evaluation, and unlocked simulated capital.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { n: "Daniel R.", img: danielImg, c: "Argentina", a: "$100,000", p: "$8,420", q: "Passed the two-step in 18 days. The rules are strict but fair — that's exactly what disciplined traders need." },
            { n: "Mei L.", img: meiImg, c: "Singapore", a: "$50,000", p: "$4,180", q: "I run a scalping strategy on ETH. The 24/7 support team answered my payout question within 10 minutes." },
            { n: "Tomás G.", img: tomasImg, c: "Spain", a: "$200,000", p: "$16,900", q: "Three cycles in, scaled to $200K. The bi-weekly payouts let me reinvest into my own setup." },
          ].map((t) => (
            <div key={t.n} className="rounded-xl border border-border/60 bg-card/40 p-6">
              <div className="flex items-center gap-4">
                <img src={t.img} alt={t.n} loading="lazy" width={64} height={64} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/30" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.c}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Account</div>
                  <div className="font-display font-semibold">{t.a}</div>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-primary/10 p-3 text-center">
                <div className="text-xs text-muted-foreground">Latest payout</div>
                <div className="font-display text-xl font-bold text-primary">{t.p}</div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">"{t.q}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border/60 bg-card/20 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">What Traders Say</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "Alex K.", img: alexImg, r: "Day trader", q: "The evaluation criteria are clear from day one. No moving goalposts." },
              { n: "Priya S.", img: priyaImg, r: "Swing trader", q: "I appreciate that they say 'simulated' everywhere. No misleading marketing." },
              { n: "Marco T.", img: marcoImg, r: "Algo developer", q: "Fast execution on the demo terminal. Backtesting matched live behavior closely." },
              { n: "Lina O.", img: linaImg, r: "Crypto trader", q: "Withdrew in USDT in under 12 hours. Bookmarked for life." },
              { n: "Hassan B.", img: hassanImg, r: "Position trader", q: "The drawdown rules forced me to size properly — improved my own trading too." },
              { n: "Yuki M.", img: yukiImg, r: "Scalper", q: "Built for serious people. The dashboard is clean and the rules are sensible." },
            ].map((t) => (
              <div key={t.n} className="rounded-xl border border-border/60 bg-background p-6">
                <Quote className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">"{t.q}"</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={t.img} alt={t.n} loading="lazy" width={40} height={40} className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{t.n}</div>
                      <div className="text-xs text-muted-foreground truncate">{t.r}</div>
                    </div>
                  </div>
                  <div className="flex shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold">Contact Support</h2>
              <p className="mt-3 text-muted-foreground">
                Questions before you start? Our team is online 24/7 to walk you through programs,
                rules and payouts.
              </p>
              <div className="mt-6 space-y-2 text-sm">
                <div>📧 supportfondeo1help@gmail.com</div>
                <div>💬 Live chat on every page</div>
                <div>🕒 Average response: under 5 minutes</div>
              </div>
            </div>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks — our team will reply shortly.");
              }}
            >
              <input required placeholder="Your name" className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
              <input required type="email" placeholder="Email" className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
              <textarea required placeholder="How can we help?" rows={4} className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm" />
              <button className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
