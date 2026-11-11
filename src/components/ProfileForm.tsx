"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { updateProfileAction, type FormState } from "@/lib/actions";
import { INTEREST_LABEL, type SkillChip, type SkillLevel } from "@/lib/types";
import { Field, TextArea } from "./Field";
import SkillEditor from "./SkillEditor";

export interface ProfileInitial {
  name: string; headline: string; bio: string; university: string; prodi: string; faculty: string;
  angkatan: string; location: string; whatsapp: string; open_to_collab: boolean;
  role: string; skills: Record<number, SkillLevel>; interests: string[];
}

export default function ProfileForm({ initial, allSkills }: { initial: ProfileInitial; allSkills: SkillChip[] }) {
  const [state, action, pending] = useActionState(updateProfileAction, {} as FormState);
  const fe = state.fieldErrors ?? {};
  const isStudent = initial.role === "mahasiswa";
  return (
    <form action={action} className="space-y-8" noValidate>
      <section className="card space-y-4 p-6">
        <h2 className="font-display text-xl font-semibold text-navy-800">Informasi dasar</h2>
        <Field label={isStudent ? "Nama lengkap" : "Nama usaha / organisasi"} name="name" defaultValue={initial.name} required error={fe.name} />
        <Field label="Headline" name="headline" defaultValue={initial.headline} hint="Satu kalimat tentang keahlian utamamu" error={fe.headline} />
        <TextArea label="Tentang" name="bio" defaultValue={initial.bio} error={fe.bio} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kampus / kota" name="university" defaultValue={initial.university} />
          <Field label={isStudent ? "Program studi" : "Bidang"} name="prodi" defaultValue={initial.prodi} />
          {isStudent && <Field label="Fakultas" name="faculty" defaultValue={initial.faculty} />}
          {isStudent && <Field label="Angkatan" name="angkatan" type="number" defaultValue={initial.angkatan} placeholder="2023" />}
          <Field label="Lokasi" name="location" defaultValue={initial.location} />
          <Field label="Nomor WhatsApp" name="whatsapp" defaultValue={initial.whatsapp} hint="Untuk pintasan WhatsApp di profilmu (opsional)" />
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-navy-50/70 p-3">
          <input type="checkbox" name="open_to_collab" defaultChecked={initial.open_to_collab} className="size-4 accent-navy-800" />
          <span className="text-sm font-semibold text-navy-800">Terbuka untuk kolaborasi</span>
        </label>
      </section>

      {isStudent && (
        <section className="card space-y-4 p-6">
          <h2 className="font-display text-xl font-semibold text-navy-800">Keahlian</h2>
          <p className="text-sm text-muted">Pilih skill yang kamu kuasai lalu atur levelnya. Ini yang dipakai untuk pencarian dan kecocokan.</p>
          <SkillEditor all={allSkills} initial={initial.skills} />
        </section>
      )}

      <section className="card space-y-3 p-6">
        <h2 className="font-display text-xl font-semibold text-navy-800">Minat kolaborasi</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(INTEREST_LABEL).map(([v, l]) => (
            <label key={v} className="cursor-pointer">
              <input type="checkbox" name="interest" value={v} defaultChecked={initial.interests.includes(v)} className="peer sr-only" />
              <span className="chip cursor-pointer bg-white transition peer-checked:bg-amber-500 peer-checked:text-navy-900 peer-checked:ring-amber-500 peer-focus-visible:ring-2 peer-focus-visible:ring-navy-600">{l}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex items-center gap-3 rounded-2xl bg-white/90 p-3 shadow-pop ring-1 ring-line backdrop-blur">
        <button disabled={pending} className="btn btn-primary">{pending && <Loader2 className="size-4 animate-spin" />} Simpan profil</button>
        {state.ok && <span role="status" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600"><CheckCircle2 className="size-4" /> {state.message}</span>}
      </div>
    </form>
  );
}
