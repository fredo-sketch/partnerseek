"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createChallengeAction, type FormState } from "@/lib/actions";
import { Field, TextArea } from "./Field";
import SkillPicker from "./SkillPicker";
import { track } from "@/lib/track";
import type { SkillChip } from "@/lib/types";

export default function ChallengeForm({ skills }: { skills: SkillChip[] }) {
  const [state, action, pending] = useActionState(createChallengeAction, {} as FormState);
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} onSubmit={() => track("form_submitted", { form: "create_challenge" })} className="space-y-5" noValidate>
      {state.error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{state.error}</p>}
      <Field label="Judul tantangan" name="title" required error={fe.title} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Kategori" name="category" placeholder="Desain, Produk, Konten…" error={fe.category} />
        <Field label="Hadiah / peluang" name="reward" placeholder="Rp1.000.000 + magang" />
        <Field label="Batas waktu" name="deadline" type="date" error={fe.deadline} />
      </div>
      <TextArea label="Deskripsi & kriteria penilaian" name="description" required error={fe.description} />
      <div>
        <p className="label">Skill yang relevan</p>
        <SkillPicker skills={skills} name="skills" open />
      </div>
      <button disabled={pending} className="btn btn-primary btn-lg">{pending && <Loader2 className="size-4 animate-spin" />} Buka tantangan</button>
    </form>
  );
}
