import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Trading Insights, Market Analysis & Trader Stories" },
      { name: "description", content: "Crypto market analysis, trading education, success stories and industry news from the Fondeo team." },
      { property: "og:title", content: "Fondeo Blog" },
      { property: "og:description", content: "Education and analysis for funded crypto traders." },
    ],
  }),
  component: Blog,
});

const POSTS = [
  { c: "Education", t: "Why position sizing matters more than entry timing", d: "Most blown evaluations come from oversized positions, not bad signals. Here's how to think about risk in percent terms.", date: "Jun 8, 2026", read: "6 min" },
  { c: "Market analysis", t: "BTC weekly: navigating the post-halving consolidation", d: "Bitcoin has been ranging since the latest halving. We break down the levels worth watching this week.", date: "Jun 5, 2026", read: "8 min" },
  { c: "Success story", t: "From $5K evaluation to $200K funded — Daniel's 90-day journey", d: "An Argentinian trader walks us through his routine, his rules, and the trades that scaled his account.", date: "Jun 2, 2026", read: "10 min" },
  { c: "Education", t: "Stop loss discipline: the one habit funded traders never skip", d: "A stop on every trade isn't bureaucracy — it's the foundation that lets you stay funded for years.", date: "May 28, 2026", read: "5 min" },
  { c: "Crypto news", t: "Ethereum's next upgrade and what it means for traders", d: "Layer-2 settlement changes are coming. Here's how short-term price action might respond.", date: "May 24, 2026", read: "7 min" },
  { c: "Education", t: "Building a trading journal you'll actually keep", d: "A simple template plus the three metrics that matter most for finding edge in your data.", date: "May 20, 2026", read: "9 min" },
];

function Blog() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Insights"
        title="Blog"
        subtitle="Education, market analysis, trader stories and crypto news — written for serious traders."
      />
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <article key={p.t} className="group flex flex-col rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-primary/40">
              <div className="aspect-[16/9] rounded-lg" style={{ background: "var(--gradient-accent)" }} />
              <div className="mt-5 flex items-center gap-3 text-xs">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">{p.c}</span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {p.date} · {p.read}
                </span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{p.t}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.d}</p>
              <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
