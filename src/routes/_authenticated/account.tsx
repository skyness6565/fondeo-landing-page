import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Account — Fondeo" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = useAuth();
  const uid = user?.id;
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", uid!).maybeSingle();
      return data;
    },
  });

  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (profile?.full_name) setFullName(profile.full_name); }, [profile]);

  async function save() {
    if (!uid) return;
    setBusy(true);
    try {
      const { error } = await supabase.from("profiles").update({ full_name: fullName, updated_at: new Date().toISOString() }).eq("id", uid);
      if (error) throw error;
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["profile", uid] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally { setBusy(false); }
  }

  return (
    <div className="max-w-xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold">Account Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your profile information.</p>
      </header>
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div>
          <label className="text-xs text-muted-foreground">Email</label>
          <input value={user?.email ?? ""} disabled className="mt-1 w-full rounded-md border border-border bg-muted/40 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Full name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <button disabled={busy} onClick={save} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}
