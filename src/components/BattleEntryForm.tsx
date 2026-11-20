"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitBattleEntryAction, type FormState } from "@/lib/actions";
import { Field, TextArea } from "./Field";
import { track } from "@/lib/track";

export default function BattleEntryForm({
  battleId, loggedIn, current,
}: { battleId: number; loggedIn: boolean; current: { title: string; description: string; link_url: string | null } | null }) {
  const [state, action, pending] = useActionState(submitBattleEntryAction.bind(null, battleId), {} as FormState);
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} onSubmit={() => track("form_submitted", { form: "battle_entry" })} className="space-y-3" noValidate>
      {state.ok && <p role="status" className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="size-5" /> {state.message}</p>}
      {state.error && <p role="alert" className="text-sm font-medium text-red-500">{state.error}</p>}
      <Field label="Judul karya" name="title" defaultValue={current?.title} error={fe.title} />
      <TextArea label="Ceritakan karyamu" name="description" defaultValue={current?.description} error={fe.description} />
      <Field label="Tautan karya (opsional)" name="link_url" placeholder="https://…" defaultValue={current?.link_url ?? ""} error={fe.link_url} />
      <button disabled={pending} className="btn btn-primary btn-lg w-full">
        {pending && <Loader2 className="size-4 animate-spin" />} {!loggedIn ? "Masuk untuk ikut" : current ? "Perbarui karya" : "Kirim karya"}
      </button>
    </form>
  );
}
