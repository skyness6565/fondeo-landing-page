import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/PageShell";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in or Create Account — Fondeo" }] }),
  component: AuthPage,
});

const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
});
const ethAddress = z
  .string()
  .trim()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Enter a valid Ethereum (ETH) address from Trust Wallet (0x… 42 chars)");
const registerSchema = loginSchema.extend({
  full_name: z.string().trim().min(2).max(80),
  eth_address: ethAddress,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "", eth_address: "" });

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const parsed = (mode === "register" ? registerSchema : loginSchema).safeParse(form);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0].message);
        return;
      }
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.full_name,
              eth_address: form.eth_address.trim(),
            },
          },
        });
        if (error) {
          const raw = error.message || "";
          const isDup =
            /ETH address already registered/i.test(raw) ||
            /duplicate key value/i.test(raw) ||
            /profiles_eth_address_unique/i.test(raw) ||
            (error as { code?: string }).code === "23505";
          if (isDup) {
            toast.error(
              "This ETH address is already linked to an active account. Each Trust Wallet address can only register one account. Sign in with the original email, or use a different ETH address.",
            );
            return;
          }
          throw error;
        }
        // Auto-confirm is enabled, so sign in immediately — no email verification.
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInErr) throw signInErr;
        toast.success("Account created. Welcome!");
        navigate({ to: "/dashboard" });

      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }


  return (
    <PageShell>
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
          <h1 className="font-display text-2xl font-bold">
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Access your dashboard, investments and withdrawals."
              : "Start your funded trading journey in minutes."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Full name</label>
                <input
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  required
                />
              </div>
            )}
            {mode === "register" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  ETH Address (Trust Wallet)
                </label>
                <input
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0x…"
                  value={form.eth_address}
                  onChange={(e) => setForm({ ...form, eth_address: e.target.value })}
                  required
                  spellCheck={false}
                  autoComplete="off"
                />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Paste your Ethereum (ERC-20) address from Trust Wallet. Must start with 0x and be 42 characters.
                </p>
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <button
              disabled={busy}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <button onClick={() => setMode("register")} className="text-primary hover:underline">
                  Register
                </button>
              </>
            ) : (
              <>Already registered?{" "}
                <button onClick={() => setMode("login")} className="text-primary hover:underline">
                  Sign in
                </button>
              </>
            )}
          </div>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">← Back to home</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
