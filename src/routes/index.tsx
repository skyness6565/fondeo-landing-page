import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bot, Zap, LineChart, Shield, TrendingUp, Trophy, Headphones,
  Check, Star, Sparkles, ArrowRight, Globe, ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fondeo Clone — Crypto Prop Firm | Trade Funded, Earn 90%" },
      { name: "description", content: "Crypto prop firm landing page. Trade demo accounts up to $200K, keep up to 90% of simulated profits. One-step, two-step or subscription challenges." },
      { property: "og:title", content: "Fondeo Clone — Crypto Prop Firm" },
      { property: "og:description", content: "Monetize your trading strategies without risk. Funded accounts up to $200K." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

type ChallengeKind = "subscription" | "one" | "two";

const PRICING: Record<ChallengeKind, { capital: string; price: string; payout: string }[]> = {
  subscription: [
    { capital: "5,000 USDT", price: "$49.00/mo", payout: "$250" },
    { capital: "50,000 USDT", price: "$150.00/mo", payout: "$2,500" },
    { capital: "100,000 USDT", price: "$300.00/mo", payout: "$5,000" },
  ],
  one: [
    { capital: "5,000 USDT", price: "$59", payout: "$350" },
    { capital: "25,000 USDT", price: "$199", payout: "$1,750" },
    { capital: "50,000 USDT", price: "$329", payout: "$3,500" },
    { capital: "100,000 USDT", price: "$579", payout: "$7,000" },
    { capital: "200,000 USDT", price: "$1,099", payout: "$14,000" },
  ],
  two: [
    { capital: "5,000 USDT", price: "$39", payout: "$225" },
    { capital: "25,000 USDT", price: "$149", payout: "$1,125" },
    { capital: "50,000 USDT", price: "$249", payout: "$2,250" },
    { capital: "100,000 USDT", price: "$429", payout: "$4,500" },
    { capital: "200,000 USDT", price: "$839", payout: "$9,000" },
  ],
};

const RULES = [
  { label: "Trading period", one: "Unlimited", two: "Unlimited", sub: "Unlimited" },
  { label: "Minimum trading days", one: "10 days", two: "5 days", sub: "—" },
  { label: "Minimum trades per day", one: "3 trades", two: "3 trades", sub: "3 trades" },
  { label: "Daily activity requirement", one: "±1%", two: "±1%", sub: "±1%" },
  { label: "Stop loss obligation", one: "Yes", two: "Yes", sub: "Yes" },
  { label: "Daily drawdown", one: "5%", two: "5%", sub: "5%" },
  { label: "Maximum loss", one: "10%", two: "5%", sub: "10%" },
  { label: "Profit target", one: "10%", two: "5%", sub: "—" },
  { label: "Minimum order size", one: "5%", two: "5%", sub: "5%" },
  { label: "Risk per trade", one: "3%", two: "3%", sub: "3%" },
  { label: "Win rate", one: "50%", two: "50%", sub: "—" },
  { label: "Profit consistency", one: "Max 40%", two: "Max 40%", sub: "—" },
  { label: "Refundable fee", one: "Challenge entry fee", two: "Free", sub: "Refund" },
];

const PARTNERS = ["TradingView", "Binance", "CoinMarketCap", "Markets Insider", "Digital Journal", "BeInCrypto"];

const FEATURES = [
  { icon: TrendingUp, title: "70–90% Profit Share", desc: "Earn up to 90% of profits with daily payouts in USDT or USDC. $100 minimum threshold.", tag: "70–90%" },
  { icon: Bot, title: "Revolutionary AI Coach", desc: "World's first AI trading coach. Analyzes every trade, identifies patterns, delivers personalized strategies 24/7.", tag: "AI Powered" },
  { icon: LineChart, title: "Live Market Data", desc: "Trade crypto perpetuals with live data from top exchanges. Authentic market conditions, zero financial risk.", tag: "Real-time" },
  { icon: Zap, title: "1:100 Leverage", desc: "Up to 1:100 leverage with no position size restrictions. Institutional-grade execution.", tag: "Max 1:100" },
  { icon: Trophy, title: "4-Month Scaling Path", desc: "Stay consistently profitable for four months and unlock invitations to larger accounts.", tag: "4 Months" },
  { icon: Shield, title: "$1M+ Payouts", desc: "Join traders who have collectively earned over $1 million in profit payouts.", tag: "$1M+" },
  { icon: Headphones, title: "24/7 Trading Support", desc: "Dedicated trading pros available around the clock via email and live chat.", tag: "24/7" },
  { icon: Sparkles, title: "Fondeo Terminal", desc: "Trade directly on Fondeo — no API keys, no setup. TradingView charts built in.", tag: "New" },
];

const REVIEWS = [
  { name: "Alexei Volkov", flag: "🇷🇺", title: "Seamless Experience & Prompt Payouts", body: "The interface is incredibly intuitive. Payouts are prompt, which is a huge plus." },
  { name: "Priya Sharma", flag: "🇮🇳", title: "Legitimate and Educational", body: "The educational resources helped me refine my strategy, and I passed my challenge." },
  { name: "Benjamin Carter", flag: "🇺🇸", title: "Outstanding Community", body: "Whenever I had a question, the community was quick to respond with helpful answers." },
  { name: "Sofia Rossi", flag: "🇮🇹", title: "Top-Notch Trading Conditions", body: "Tight spreads and fast execution. Perfect for serious traders." },
  { name: "Kenji Tanaka", flag: "🇯🇵", title: "Motivating Path for Growth", body: "Their scaling plan provides a clear path for growth that feels rewarding." },
  { name: "Fatima Al-Fassi", flag: "🇲🇦", title: "Transparent and Trustworthy", body: "The transparency in their rules and profit-sharing model builds a lot of trust." },
];

const FAQ_GROUPS = [
  {
    title: "Getting Started",
    items: [
      { q: "What is Fondeo and how does it work?", a: "Fondeo is a crypto prop firm. You pay a one-time or monthly fee, prove your skills on a demo account, then earn up to 90% of simulated profits." },
      { q: "How do I create an account?", a: "Click Sign up, verify your email, choose a challenge, and connect Bybit or trade on Fondeo Terminal." },
      { q: "What account sizes are available?", a: "From 5,000 USDT up to 200,000 USDT across One-Step, Two-Step and Subscription tracks." },
    ],
  },
  {
    title: "Trading Rules & Requirements",
    items: [
      { q: "What are the trading challenge rules?", a: "Hit the profit target, respect daily drawdown (5%) and maximum loss (5–10%) while trading at least the minimum number of days." },
      { q: "What is the minimum trading day requirement?", a: "10 days on One-Step evaluation, 5 days on the Two-Step evaluation, none on Subscription funded accounts." },
      { q: "What happens if I break the trading rules?", a: "Your challenge ends. Subscription accounts auto-reset while your plan is active." },
    ],
  },
  {
    title: "Risk Management",
    items: [
      { q: "What is the maximum drawdown allowed?", a: "5% daily drawdown and 5–10% maximum loss depending on the challenge type." },
      { q: "Can I risk more than 3% per position?", a: "No. Risk per trade is capped at 3% of starting balance to enforce discipline." },
      { q: "What happens if I exceed the daily loss limit?", a: "The account is breached and trading is paused. Subscription accounts can reset on the next cycle." },
    ],
  },
];

function Landing() {
  const [kind, setKind] = useState<ChallengeKind>("subscription");
  const [selected, setSelected] = useState(0);
  const tiers = PRICING[kind];
  const tier = tiers[Math.min(selected, tiers.length - 1)];

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      <Nav />
      <Hero />
      <PartnerMarquee />
      <HowItWorks />
      <Environment />
      <Terminal />
      <AICoach />
      <Stats />
      <WhyChoose />
      <Pricing kind={kind} setKind={setKind} selected={selected} setSelected={setSelected} tiers={tiers} tier={tier} />
      <RulesTable />
      <Reviews />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  const links = ["How It Works", "Trading Programs", "Rules", "Blog", "Partner", "About Us", "F.A.Q."];
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="font-display font-bold tracking-widest text-lg">FONDEO</a>
        <nav className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground">
          {links.map(l => (
            <a key={l} href="#" className={`hover:text-foreground transition ${l === "Partner" ? "text-primary" : ""}`}>{l}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full border border-border text-muted-foreground hover:text-foreground"><Globe className="w-4 h-4" /></button>
          <button className="px-4 h-9 rounded-md border border-border text-sm hover:bg-card">Sign in</button>
          <button className="px-4 h-9 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90">Sign up now!</button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs text-primary mb-8">
          <Trophy className="w-3.5 h-3.5" /> Awarded "Top Crypto Prop Firm 2025"
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
          Crypto Prop Firm
          <br />
          <span className="text-muted-foreground">Monetize your trading strategies without risk.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl">
          Trade on a demo account with up to $200K and get a reward of 90% of your simulated profits.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#pricing" className="inline-flex items-center gap-2 px-6 h-12 rounded-md bg-foreground text-background font-medium hover:opacity-90">
            Start Your Challenge <ArrowRight className="w-4 h-4" />
          </a>
          <a href="#" className="inline-flex items-center px-6 h-12 rounded-md border border-border hover:bg-card font-medium">Sign up now!</a>
        </div>
        <div className="mt-10 flex items-center gap-4">
          <div className="flex -space-x-2">
            {["#22c55e", "#06b6d4", "#a855f7", "#f59e0b", "#ef4444"].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background" style={{ background: c }} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
            <span className="font-semibold">5.0</span>
            <span className="text-sm text-muted-foreground">from 200+ reviews</span>
          </div>
        </div>
      </div>
      <DashboardMock />
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="relative">
      <div className="absolute inset-0 blur-3xl rounded-full" style={{ background: "var(--gradient-accent)", opacity: 0.18 }} />
      <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur p-1 shadow-2xl">
        <div className="rounded-xl bg-background p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-card">Two Step · $5000</span>
              <span className="text-muted-foreground">Trade · Markets · Portfolio</span>
            </div>
            <span className="text-muted-foreground">Settings</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">ETHUSDT</span>
                <span className="text-primary">$1,986.70</span>
                <span className="text-primary text-[10px]">+2.13%</span>
              </div>
              <div className="h-56 rounded-md bg-gradient-to-br from-card to-background relative overflow-hidden">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                  <polyline fill="none" stroke="oklch(0.82 0.18 150)" strokeWidth="1.5"
                    points="0,40 30,55 60,30 90,70 120,90 150,120 180,100 210,140 240,110 270,150 300,130" />
                  {Array.from({ length: 30 }).map((_, i) => {
                    const up = Math.random() > 0.5;
                    const h = 10 + Math.random() * 50;
                    return <rect key={i} x={i * 10} y={80 + Math.random() * 40} width="6" height={h}
                      fill={up ? "oklch(0.82 0.18 150)" : "oklch(0.65 0.22 25)"} opacity="0.85" />;
                  })}
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-[10px]">
                <Stat label="Positions" value="$8,264" />
                <Stat label="Open Orders" value="3 active" />
                <Stat label="Order History" value="142" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="rounded bg-card p-3">
                <div className="text-[10px] text-muted-foreground">Portfolio</div>
                <div className="text-base font-semibold">$4,994.55</div>
                <div className="text-primary text-[10px]">+90.97%</div>
              </div>
              <button className="w-full py-2 rounded bg-primary text-primary-foreground font-semibold">Buy / Long</button>
              <button className="w-full py-2 rounded bg-destructive/80 text-foreground font-semibold">Sell / Short</button>
              <div className="rounded bg-card p-2">
                <div className="text-[10px] text-muted-foreground">Leverage</div>
                <div className="font-semibold">10×</div>
              </div>
              <button className="w-full py-2 rounded bg-accent text-accent-foreground font-semibold">Place Market</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-card p-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function PartnerMarquee() {
  const items = [...PARTNERS, ...PARTNERS, ...PARTNERS];
  return (
    <section className="border-y border-border/50 bg-background/50 py-6 overflow-hidden">
      <div className="flex gap-12 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
        {items.map((p, i) => (
          <span key={i} className="text-muted-foreground/60 font-display font-semibold tracking-wide">{p}</span>
        ))}
      </div>
      <style>{`@keyframes scroll { from {transform: translateX(0)} to {transform: translateX(-50%)} }`}</style>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "STEP 1", t: "Complete The Evaluation", d: "Demonstrate your trading skills by meeting profit targets while managing risk effectively." },
    { n: "STEP 2", t: "Earn as a Funded Trader", d: "Get a funded demo account up to $200,000. Trade with the same risk rules and earn up to 90% of your profits." },
    { n: "STEP 3", t: "Receive Your Payout", d: "Receive payouts as soon as 24 hours after your first trade. Fast daily payouts with up to 90% profit share." },
  ];
  return (
    <section id="how" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold">How Our Funding Program Works</h2>
        <p className="mt-4 text-muted-foreground">Demonstrate your trading skills by meeting profit targets while managing risk effectively.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card/60 p-8 hover:border-primary/40 transition">
            <div className="text-xs tracking-widest text-primary font-semibold">{s.n}</div>
            <h3 className="mt-3 text-2xl font-bold">{s.t}</h3>
            <p className="mt-3 text-muted-foreground">{s.d}</p>
            {i === 1 && (
              <div className="mt-6 rounded-xl bg-background p-4 border border-border">
                <div className="text-xs text-muted-foreground">Account Balance</div>
                <div className="text-2xl font-bold">$109,200</div>
                <div className="text-primary text-sm mt-1">↗ +$12,000 · Consistent Growth</div>
              </div>
            )}
            {i === 2 && (
              <div className="mt-6 rounded-xl bg-background p-4 border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Payout Received</div>
                  <div className="text-2xl font-bold text-primary">$7,500</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-muted-foreground">24 hours</div>
                  <div className="text-primary">90% share</div>
                </div>
              </div>
            )}
            {i === 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {["1-Step", "2-Step", "Subscription"].map(x => (
                  <span key={x} className="px-3 py-1 rounded-full text-xs bg-background border border-border">{x}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Environment() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-xs tracking-widest text-primary font-semibold">TRADING ENVIRONMENT</div>
        <h2 className="mt-3 text-4xl md:text-5xl font-bold">Risk-Free Demo Trading</h2>
        <p className="mt-4 text-muted-foreground">Connect Bybit to trade virtual funds in real market conditions. Fondeo monitors performance in real time.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card/60 p-8">
          <div className="text-xs tracking-widest text-primary mb-2">LIVE DASHBOARD</div>
          <h3 className="text-2xl font-bold">Fondeo · Performance Monitoring</h3>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[["P&L", "+$2,340"], ["Win Rate", "78%"], ["Drawdown", "1.2%"], ["Risk Score", "Low"]].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-background p-4 border border-border">
                <div className="text-xs text-muted-foreground">{l}</div>
                <div className="text-xl font-bold text-primary">{v}</div>
              </div>
            ))}
          </div>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><Check className="w-4 h-4 text-primary" /> Real-time performance tracking</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-primary" /> Risk management analysis</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-primary" /> Automated evaluation system</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-8">
          <div className="text-xs tracking-widest text-primary mb-2">DEMO ACCOUNT</div>
          <h3 className="text-2xl font-bold">Bybit Demo · Virtual Trading</h3>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[["Balance", "$100K"], ["Market", "Real Data"], ["Platform", "Full Access"], ["Risk", "Zero"]].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-background p-4 border border-border">
                <div className="text-xs text-muted-foreground">{l}</div>
                <div className="text-xl font-bold">{v}</div>
              </div>
            ))}
          </div>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><Check className="w-4 h-4 text-primary" /> Real market conditions</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-primary" /> Professional trading tools</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-primary" /> Mobile & desktop access</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Terminal() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-card/80 to-background p-10 md:p-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-xs">New Launch</div>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">Introducing Fondeo Terminal</h2>
          <p className="mt-4 text-muted-foreground">Trade directly on Fondeo — no external platforms, no API keys, no setup. Go from purchase to first trade in seconds.</p>
          <ul className="mt-8 space-y-4">
            {[
              ["Instant Activation", "No exchange accounts or API keys needed."],
              ["Professional Charts", "Full TradingView integration with order book, depth, and live trades."],
              ["Built-in Risk Management", "Take profit, stop loss, leverage up to 100x in the order panel."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <div className="mt-1 w-8 h-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center"><Check className="w-4 h-4" /></div>
                <div><div className="font-semibold">{t}</div><div className="text-sm text-muted-foreground">{d}</div></div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-3">
            <a href="#" className="px-5 h-11 rounded-md bg-foreground text-background font-medium inline-flex items-center">Try Terminal</a>
            <a href="#" className="px-5 h-11 rounded-md border border-border inline-flex items-center">Read More</a>
          </div>
        </div>
        <DashboardMock />
      </div>
    </section>
  );
}

function AICoach() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-3xl mx-auto">
        <div className="text-xs tracking-widest text-primary font-semibold">WORLD'S FIRST AI TRADING COACH</div>
        <h2 className="mt-3 text-4xl md:text-5xl font-bold">Your AI Trading Coach That Never Sleeps</h2>
        <p className="mt-4 text-muted-foreground">
          Imagine a $10,000/hour mentor analyzing every move, learning your patterns, and giving personalized strategies in real time. That's Fondeo's revolutionary AI Coach.
        </p>
        <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-primary/30 bg-primary/10">
          <span className="text-3xl font-bold text-primary">3.5x</span>
          <span className="text-sm text-left">Faster Success Rate<br /><span className="text-muted-foreground text-xs">vs traders without AI Coach</span></span>
        </div>
      </div>
      <div className="grid md:grid-cols-4 gap-4 mt-14">
        {[
          { t: "Deep Learning Analysis", d: "Analyzes 10,000+ data points per trade." },
          { t: "Precision Insights", d: "Personalized strategies based on your style." },
          { t: "Risk Prevention", d: "Predicts costly mistakes before they happen." },
          { t: "Performance Boost", d: "Traders pass 3.5x faster on average." },
        ].map(c => (
          <div key={c.t} className="rounded-2xl border border-border bg-card/60 p-6">
            <Bot className="w-6 h-6 text-primary" />
            <h3 className="mt-3 font-bold">{c.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-4">
        {[
          ["01", "Analyzes Your Trades", "Every position, decision, pattern. Processes millions of data points to learn your trading DNA."],
          ["02", "Identifies Hidden Patterns", "Spots opportunities and risks across timeframes, correlations, and trends."],
          ["03", "Delivers Actionable Insights", "Crystal-clear recommendations to improve win rate, reduce drawdowns, pass faster."],
        ].map(([n, t, d]) => (
          <div key={n} className="rounded-2xl border border-border bg-card/40 p-8">
            <div className="text-5xl font-display font-bold text-primary/40">{n}</div>
            <h3 className="mt-3 text-xl font-bold">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <div className="text-xs tracking-widest text-primary font-semibold">REWARDING EXCELLENCE</div>
        <h2 className="mt-3 text-4xl md:text-5xl font-bold">Rewarding our best traders</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[["12K+", "Fondeo Accounts"], ["1K+", "Rewarded Traders"], ["$1M+", "Total Rewarded"]].map(([v, l]) => (
          <div key={l} className="rounded-2xl border border-border bg-card/60 p-10 text-center">
            <div className="text-5xl md:text-6xl font-display font-bold text-primary">{v}</div>
            <div className="mt-2 text-muted-foreground">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-bold">Why Traders Choose Fondeo</h2>
        <p className="mt-4 text-muted-foreground">The complete crypto trading ecosystem — from demo accounts to funded trading.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map(f => (
          <div key={f.title} className="rounded-2xl border border-border bg-card/60 p-6 hover:border-primary/40 transition">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                <f.icon className="w-5 h-5" />
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-background border border-border text-primary">{f.tag}</span>
            </div>
            <h3 className="mt-4 font-bold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing({ kind, setKind, selected, setSelected, tiers, tier }: {
  kind: ChallengeKind; setKind: (k: ChallengeKind) => void;
  selected: number; setSelected: (n: number) => void;
  tiers: typeof PRICING["one"]; tier: typeof PRICING["one"][number];
}) {
  const kinds: { id: ChallengeKind; label: string; badge?: string }[] = [
    { id: "subscription", label: "Subscription", badge: "NEW!" },
    { id: "one", label: "One-Step" },
    { id: "two", label: "Two-Step" },
  ];
  const kindCopy: Record<ChallengeKind, string> = {
    subscription: "Pay monthly and reset your account on failure — keep trading as long as your subscription is active!",
    one: "Pass one phase, get funded. Fastest path to a live demo account up to $200K.",
    two: "Two phases, lower entry price. Best value for disciplined traders.",
  };
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-bold">Choose Your Challenge</h2>
        <p className="mt-4 text-muted-foreground">Select a challenge type and trading capital to start your funded trading journey.</p>
      </div>
      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="rounded-3xl border border-border bg-card/60 p-8">
          <h3 className="font-semibold mb-4">Challenge Type</h3>
          <div className="flex flex-wrap gap-2 p-1 rounded-xl bg-background border border-border w-fit">
            {kinds.map(k => (
              <button key={k.id} onClick={() => { setKind(k.id); setSelected(0); }}
                className={`px-5 h-10 rounded-lg text-sm font-medium relative transition ${
                  kind === k.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}>
                {k.label}
                {k.badge && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-foreground text-background">{k.badge}</span>}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{kindCopy[kind]}</p>

          <h3 className="font-semibold mt-8 mb-4">Trading Capital</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tiers.map((t, i) => (
              <button key={t.capital} onClick={() => setSelected(i)}
                className={`text-left rounded-xl border p-5 transition ${
                  selected === i ? "border-primary bg-primary/5 shadow-[var(--shadow-glow)]" : "border-border bg-background hover:border-primary/40"
                }`}>
                <div className="text-lg font-bold">{t.capital}</div>
                <div className="mt-1 text-sm text-muted-foreground">Price</div>
                <div className="text-xl font-display font-bold text-primary">{t.price}</div>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">With {tier.capital} trading capital, average payout is <span className="text-primary font-semibold">{tier.payout}</span>.</p>
        </div>

        <aside className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card to-background p-8 h-fit sticky top-20">
          <h3 className="font-semibold">Summary</h3>
          <div className="mt-4 text-4xl font-display font-bold text-primary">{tier.price}</div>
          <div className="mt-1 text-sm text-muted-foreground capitalize">{kind === "one" ? "One-Step" : kind === "two" ? "Two-Step" : "Subscription"} · {tier.capital}</div>
          <p className="mt-4 text-sm text-muted-foreground">Receive a funded challenge account with a starting balance of {tier.capital}.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              `${tier.capital} Starting Balance`,
              "Up to 90% Profit Share",
              kind === "subscription" ? "$0 Funding Fee" : "Refundable Entry Fee",
              kind === "subscription" ? "Reset on Failure (while subscribed)" : "Bybit & Fondeo Terminal",
              "🤖 AI Trading Coach Included",
              "Personal Support",
            ].map(x => (
              <li key={x} className="flex gap-2"><Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {x}</li>
            ))}
          </ul>
          <button className="mt-8 w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 inline-flex items-center justify-center gap-2">
            Start Challenge <ArrowRight className="w-4 h-4" />
          </button>
        </aside>
      </div>
    </section>
  );
}

function RulesTable() {
  return (
    <section id="rules" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-4xl md:text-5xl font-bold">Account Rules and Objectives</h2>
        <p className="mt-4 text-muted-foreground">Clear rules designed to help you manage risk, maintain discipline, and become a funded trader.</p>
      </div>
      <div className="rounded-3xl border border-border overflow-hidden">
        <div className="grid grid-cols-4 bg-card font-semibold">
          <div className="p-4 text-muted-foreground">Rule</div>
          <div className="p-4 text-center">One-Step</div>
          <div className="p-4 text-center">Two-Step</div>
          <div className="p-4 text-center">Subscription</div>
        </div>
        {RULES.map((r, i) => (
          <div key={r.label} className={`grid grid-cols-4 ${i % 2 ? "bg-card/40" : "bg-background/30"}`}>
            <div className="p-4 text-sm">{r.label}</div>
            <div className="p-4 text-center text-sm text-primary">{r.one}</div>
            <div className="p-4 text-center text-sm text-primary">{r.two}</div>
            <div className="p-4 text-center text-sm text-primary">{r.sub}</div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <a href="#" className="text-primary hover:underline">Read the complete trading rules documentation →</a>
      </p>
    </section>
  );
}

function Reviews() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-bold">Real reviews on Trustpilot</h2>
        <p className="mt-4 text-muted-foreground">Hear from traders who have found success with our platform.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REVIEWS.map(r => (
          <div key={r.name} className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
            <h3 className="mt-3 font-bold">{r.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs">
                {r.name.split(" ").map(n => n[0]).join("")}
              </span>
              <span>{r.name}</span>
              <span>{r.flag}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-12">
        <div className="text-xs tracking-widest text-primary font-semibold">AI-POWERED SUPPORT</div>
        <h2 className="mt-3 text-4xl md:text-5xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-4 text-muted-foreground">Find answers or chat with our AI assistant for personalized help.</p>
      </div>
      <div className="space-y-8">
        {FAQ_GROUPS.map(g => (
          <div key={g.title}>
            <h3 className="text-xl font-bold mb-3">{g.title}</h3>
            <div className="space-y-2">
              {g.items.map(it => {
                const id = g.title + it.q;
                const isOpen = open === id;
                return (
                  <button key={id} onClick={() => setOpen(isOpen ? null : id)}
                    className="w-full text-left rounded-xl border border-border bg-card/60 p-5 hover:border-primary/40 transition">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium">{it.q}</span>
                      <ChevronDown className={`w-4 h-4 transition ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                    </div>
                    {isOpen && <p className="mt-3 text-sm text-muted-foreground">{it.a}</p>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="rounded-3xl border border-primary/30 p-12 md:p-20 text-center" style={{ background: "var(--gradient-accent)" }}>
        <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground">Ready to Start Your Funded Trading Journey?</h2>
        <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
          Join thousands of traders who have taken their career to the next level with Fondeo's funded accounts.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a href="#pricing" className="px-6 h-12 inline-flex items-center rounded-md bg-background text-foreground font-semibold">Start Your Challenge</a>
          <a href="#" className="px-6 h-12 inline-flex items-center rounded-md border border-primary-foreground/30 text-primary-foreground font-semibold">Learn More</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="font-display font-bold tracking-widest text-foreground">FONDEO</div>
        <div>© {new Date().getFullYear()} Fondeo Clone. For demonstration purposes only.</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
