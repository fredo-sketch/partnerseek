"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createBattleAction, type FormState } from "@/lib/actions";
import { Field, TextArea } from "./Field";
import SkillPicker from "./SkillPicker";
import { track } from "@/lib/track";
import type { SkillChip } from "@/lib/types";

export default function BattleForm({ skills }: { skills: SkillChip[] }) {
  const [state, action, pending] = useActionState(createBattleAction, {} as FormState);
  const fe = state.fieldErrors ?? {};
  const today = new Date().toISOString().slice(0, 10);
  return (
    <form action={action} onSubmit={() => track("form_submitted", { form: "create_battle" })} className="space-y-5" noValidate>
      {state.error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{state.error}</p>}
      <Field label="Judul battle" name="title" required error={fe.title} placeholder="Weekly Battle: Poster promo menu baru" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Kategori" name="category" placeholder="Desain, Konten, Produk…" error={fe.category} />
        <Field label="Hadiah" name="prize" placeholder="Rp500.000 + voucher" />
        <Field label="Mulai (berlangsung 7 hari)" name="starts_at" type="date" defaultValue={today} error={fe.starts_at} />
      </div>
      <TextArea label="Brief & kriteria penilaian" name="brief" required error={fe.brief} />
      <div>
        <p className="label">Skill yang relevan</p>
        <SkillPicker skills={skills} name="skills" open />
      </div>
      <button disabled={pending} className="btn btn-primary btn-lg">{pending && <Loader2 className="size-4 animate-spin" />} Buka battle</button>
    </form>
  );
}
