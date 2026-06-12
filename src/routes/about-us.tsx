import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Heart } from "lucide-react";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us — The Fondeo Mission" },
      { name: "description", content: "Fondeo helps talented traders access simulated funded capital without risking their own money. Learn about our mission, vision and funding model." },
      { property: "og:title", content: "About Fondeo" },
      { property: "og:description", content: "Our mission, vision and funding philosophy." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Our story"
        title="About Us"
        subtitle="Fondeo exists to remove capital as the barrier between skilled traders and a real opportunity."
      />

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { i: Target, t: "Mission", d: "Give every disciplined trader, anywhere in the world, access to simulated capital they can prove themselves on." },
            { i: Eye, t: "Vision", d: "A global community where trading talent is judged by performance and risk management — not by personal net worth." },
            { i: Heart, t: "Values", d: "Transparency, fairness and respect. Rules are published, support is human, and payouts are predictable." },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl border border-border/60 bg-card/40 p-6 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <b.i className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 space-y-8 text-base leading-relaxed text-muted-foreground">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Our funding model</h2>
            <p className="mt-3">
              Fondeo operates a simulated funded trading model. Traders pay a one-time evaluation
              fee to demonstrate skill on a demo account. Those who pass are promoted to a funded
              simulated account where profits are shared on a bi-weekly cycle in USDT. We are not
              a broker, we are not an investment fund, and we do not promise returns. We reward
              proven trading discipline.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Why we built this</h2>
            <p className="mt-3">
              Most great traders are gated by capital, not by skill. Margins are too small to be
              meaningful on personal accounts, and the leverage to compensate is dangerous. A
              funded program flips the equation: prove you can manage risk on substantial demo
              capital, and the payouts become economically meaningful — without ever risking your
              savings.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Our commitment</h2>
            <p className="mt-3">
              We publish our rules openly, respond to support within minutes, and pay every cycle
              on time. We will never advertise guaranteed profits, claim risk-free returns, or
              hide the fact that all trading on our platform is simulated.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
