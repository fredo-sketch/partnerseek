"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createPostAction, type FormState } from "@/lib/actions";
import { POST_TYPES, type SkillChip } from "@/lib/types";
import { Field, TextArea } from "./Field";
import SkillPicker from "./SkillPicker";
import { track } from "@/lib/track";

export default function PostForm({ skills }: { skills: SkillChip[] }) {
  const [state, action, pending] = useActionState(createPostAction, {} as FormState);
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} onSubmit={() => track("form_submitted", { form: "create_post" })} className="space-y-5" noValidate>
      <Field label="Judul kebutuhan" name="title" required error={fe.title} placeholder="mis. Cari UI/UX Designer untuk lomba aplikasi" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="type" className="label">Jenis</label>
          <select id="type" name="type" className="input" defaultValue="lomba">
            {POST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <Field label="Jumlah orang dicari" name="slots" type="number" min={1} max={20} defaultValue={1} error={fe.slots} />
        <Field label="Batas waktu" name="deadline" type="date" error={fe.deadline} />
      </div>
      <TextArea label="Deskripsi" name="description" required error={fe.description} placeholder="Jelaskan proyeknya, peran yang dicari, durasi, dan cara kerja tim…" />
      <div>
        <p className="label">Skill yang dibutuhkan</p>
        <SkillPicker skills={skills} name="skills" open />
        {fe.skills && <p className="mt-1 text-xs font-medium text-red-500">{fe.skills}</p>}
      </div>
      <button disabled={pending} className="btn btn-primary btn-lg">{pending && <Loader2 className="size-4 animate-spin" />} Publikasikan</button>
    </form>
  );
}
