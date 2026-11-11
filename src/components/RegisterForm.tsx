"use client";

import { useActionState, useState } from "react";
import { Loader2 } from "lucide-react";
import { registerAction, type FormState } from "@/lib/actions";
import { track } from "@/lib/track";
import { Field } from "./Field";

const ROLES = [
  { v: "mahasiswa", t: "Mahasiswa", d: "Cari partner & tampilkan skill" },
  { v: "umkm", t: "UMKM / Startup", d: "Cari talenta & buka tantangan" },
  { v: "organisasi", t: "Organisasi kampus", d: "BEM, HIMA, UKM, panitia lomba" },
];

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, {} as FormState);
  const [role, setRole] = useState("mahasiswa");
  const fe = state.fieldErrors ?? {};

  return (
    <form
      action={action}
      onSubmit={() => track("form_submitted", { form: "register", role })}
      className="space-y-4"
      noValidate
    >
      <fieldset>
        <legend className="label">Saya mendaftar sebagai</legend>
        <div className="grid gap-2">
          {ROLES.map((r) => (
            <label key={r.v} className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 ring-1 transition ${role === r.v ? "bg-amber-50 ring-2 ring-amber-500" : "ring-line hover:bg-navy-50"}`}>
              <input type="radio" name="role" value={r.v} checked={role === r.v} onChange={() => setRole(r.v)} className="accent-navy-800" />
              <span><span className="block text-sm font-semibold text-navy-800">{r.t}</span><span className="block text-xs text-muted">{r.d}</span></span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field label={role === "mahasiswa" ? "Nama lengkap" : "Nama usaha / organisasi"} name="name" autoComplete="name" required error={fe.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" required error={fe.email} />
      <Field label="Password" name="password" type="password" autoComplete="new-password" required error={fe.password} hint="Minimal 8 karakter" />
      {role === "mahasiswa" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kampus" name="university" defaultValue="Universitas Negeri Semarang" error={fe.university} />
          <Field label="Program studi" name="prodi" placeholder="mis. Sistem Informasi" error={fe.prodi} />
        </div>
      )}
      <button disabled={pending} className="btn btn-primary w-full">{pending && <Loader2 className="size-4 animate-spin" />} Buat akun</button>
    </form>
  );
}
