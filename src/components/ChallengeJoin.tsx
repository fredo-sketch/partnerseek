"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { joinChallengeAction, type FormState } from "@/lib/actions";
import { track } from "@/lib/track";

export default function ChallengeJoin({ challengeId, joined, loggedIn }: { challengeId: number; joined: boolean; loggedIn: boolean }) {
  const [state, action, pending] = useActionState(joinChallengeAction.bind(null, challengeId), {} as FormState);
  if (joined || state.ok)
    return <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700"><CheckCircle2 className="size-5" /> {state.message ?? "Kamu sudah bergabung di tantangan ini."}</p>;
  return (
    <form action={action} onSubmit={() => track("form_submitted", { form: "challenge_join" })} className="space-y-3">
      {state.error && <p role="alert" className="text-sm font-medium text-red-500">{state.error}</p>}
      <label htmlFor="note" className="label">Catatan untuk penyelenggara (opsional)</label>
      <textarea id="note" name="note" maxLength={300} rows={3} className="input" placeholder="Ceritakan singkat idemu atau tim yang kamu bawa" />
      <button disabled={pending} className="btn btn-primary btn-lg w-full">{pending && <Loader2 className="size-4 animate-spin" />} {loggedIn ? "Ikuti tantangan" : "Masuk untuk ikut"}</button>
    </form>
  );
}
