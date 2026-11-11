"use client";

import { useActionState, useEffect, useRef } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { joinWaitlistAction, type FormState } from "@/lib/actions";
import { track } from "@/lib/track";

const initial: FormState = {};

export default function WaitlistForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [state, action, pending] = useActionState(joinWaitlistAction, initial);
  const tracked = useRef(false);

  useEffect(() => {
    if (state.ok && !tracked.current) {
      tracked.current = true;
      track("form_submitted", { form: "waitlist" });
      track("waitlist_signup", { method: "landing" });
    }
  }, [state.ok]);

  if (state.ok) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-2xl bg-white/95 p-5 text-navy-800 shadow-pop">
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-emerald-500" />
        <div>
          <p className="font-display text-lg font-semibold">Kamu sudah masuk!</p>
          <p className="text-sm text-muted">{state.message}</p>
        </div>
      </div>
    );
  }

  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-name" className={`label ${tone === "dark" ? "!text-white/80" : ""}`}>Nama</label>
          <input id="wl-name" name="name" className="input" placeholder="Nama lengkap" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="wl-campus" className={`label ${tone === "dark" ? "!text-white/80" : ""}`}>Kampus</label>
          <input id="wl-campus" name="campus" className="input" placeholder="mis. UNNES" />
        </div>
      </div>
      <div>
        <label htmlFor="wl-skill" className={`label ${tone === "dark" ? "!text-white/80" : ""}`}>Keahlian utama</label>
        <input id="wl-skill" name="skill" className="input" placeholder="mis. UI/UX, Fullstack, Copywriting" />
      </div>
      <div>
        <label htmlFor="wl-email" className={`label ${tone === "dark" ? "!text-white/80" : ""}`}>Email</label>
        <input id="wl-email" name="email" type="email" required className="input" placeholder="kamu@email.com" autoComplete="email" aria-invalid={!!fe.email} />
        {fe.email && <p className="mt-1 text-xs font-medium text-red-500">{fe.email}</p>}
      </div>
      <button type="submit" disabled={pending} className="btn btn-primary btn-lg w-full">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {pending ? "Mengirim…" : "Gabung daftar tunggu"}
      </button>
    </form>
  );
}
