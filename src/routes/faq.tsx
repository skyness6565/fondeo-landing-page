import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageShell, PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "F.A.Q. — Frequently Asked Questions | Fondeo" },
      { name: "description", content: "Answers to the 20+ most common questions about evaluations, rules, payouts, account scaling and our funded trading model." },
      { property: "og:title", content: "Fondeo F.A.Q." },
      { property: "og:description", content: "Everything you need to know before you start." },
    ],
  }),
  component: FAQ,
});

const QA = [
  ["What is Fondeo?", "Fondeo is a simulated funded trading platform. You pass an evaluation on a demo account and, once funded, earn a share of simulated profits."],
  ["Is this real money?", "No. All trading is performed on simulated demo accounts. Profit splits are paid out in real USDT, but the trading itself is not live market exposure."],
  ["Do you guarantee profits?", "No. We never guarantee profits and we never claim risk-free returns. Your earnings depend entirely on your trading performance within the rules."],
  ["How much does it cost to start?", "Evaluation fees start at $39 for a $5K account and go up to $1,099 for $200K, depending on the program type. The fee is refunded on your first payout."],
  ["What are the account sizes?", "We offer $10K, $25K, $50K, $100K and $200K simulated funded accounts."],
  ["What is the profit target?", "8% for one-step challenges, 8% then 5% for two-step. Subscription accounts have no profit target."],
  ["What are the drawdown limits?", "Maximum 5% daily and 10% overall drawdown, calculated on equity."],
  ["Is there a time limit?", "No. You can take as many days as you need to hit the target."],
  ["Do I have to trade every day?", "You need at least 5 active trading days and 3 trades per active day to qualify for payout."],
  ["What markets can I trade?", "BTC, ETH and 50+ crypto pairs, available 24/7."],
  ["What's the profit split?", "Starts at 80% and scales to 90% with consistent performance."],
  ["How and when do I get paid?", "Bi-weekly cycles, paid in USDT (TRC-20 or ERC-20). First payout includes a full refund of your evaluation fee."],
  ["Can my account grow?", "Yes. Your account scales by 25% per successful payout cycle, up to 4x the starting size."],
  ["What happens if I breach a rule?", "Breaching the daily or overall drawdown ends the evaluation. We never claim losses against your personal funds."],
  ["Can I use EAs or bots?", "Personal automated strategies are allowed. HFT, latency arbitrage and copy-trading from third parties are prohibited."],
  ["Can I hedge across accounts?", "No. Hedging across multiple Fondeo accounts is prohibited and will void the evaluation."],
  ["Do I need to verify my identity?", "Yes — KYC is required before your first payout, in line with standard compliance practice."],
  ["Can I trade from any country?", "We support traders in most jurisdictions. A short list of restricted countries is available in our terms."],
  ["What if I have a question about a trade?", "Our 24/7 support team responds in under 5 minutes on average via live chat or email."],
  ["Can I restart if I fail?", "Yes. You can purchase a new evaluation at any time, often with a discount for previous customers."],
  ["Is my data secure?", "Yes. We use industry-standard encryption and never share personal data with third parties without consent."],
  ["Where can I see the full rules?", "All rules are published on our Rules page and visible in your dashboard before you begin trading."],
];

function FAQ() {
  return (
    <PageShell>
      <PageHero eyebrow="Help" title="Frequently Asked Questions" subtitle="Answers to the most common questions about evaluations, rules and payouts." />
      <section className="mx-auto max-w-3xl px-4 py-16">
        <Accordion type="single" collapsible className="space-y-2">
          {QA.map(([q, a], i) => (
            <AccordionItem key={i} value={`i${i}`} className="rounded-xl border border-border/60 bg-card/40 px-5">
              <AccordionTrigger className="text-left font-display text-base font-semibold">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </PageShell>
  );
}
