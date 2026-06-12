import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-bold">Fondeo</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A simulated funded-trading platform for skilled traders. Demonstrate skill, manage risk,
            and earn from profit splits on funded demo capital.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
            <li><Link to="/trading-programs" className="hover:text-foreground">Trading Programs</Link></li>
            <li><Link to="/rules" className="hover:text-foreground">Rules</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about-us" className="hover:text-foreground">About Us</Link></li>
            <li><Link to="/partner" className="hover:text-foreground">Partner</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">F.A.Q.</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Disclaimer</h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            All trading is conducted on simulated demo accounts. Past performance is not indicative
            of future results. We do not guarantee profits or risk-free returns.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Fondeo. All rights reserved.</p>
          <p>Trading involves risk. For educational and evaluation purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
