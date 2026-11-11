"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Plus } from "lucide-react";
import { addExperienceAction, addPortfolioAction, type FormState } from "@/lib/actions";
import { Field, TextArea } from "./Field";

function useResetOnOk(ok?: boolean) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (ok) ref.current?.reset();
  }, [ok]);
  return ref;
}

export function PortfolioForm() {
  const [state, action, pending] = useActionState(addPortfolioAction, {} as FormState);
  const ref = useResetOnOk(state.ok);
  const fe = state.fieldErrors ?? {};
  return (
    <form ref={ref} action={action} className="space-y-3" noValidate>
      <Field label="Judul karya" name="title" required error={fe.title} />
      <TextArea label="Deskripsi singkat" name="description" error={fe.description} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Tautan (opsional)" name="link" type="url" placeholder="https://" error={fe.link} />
        <Field label="Tag" name="tags" placeholder="React, UI/UX, Riset" />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="btn btn-navy">{pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Tambah karya</button>
        {state.ok && <span role="status" className="text-sm font-semibold text-emerald-600">{state.message}</span>}
      </div>
    </form>
  );
}

export function ExperienceForm() {
  const [state, action, pending] = useActionState(addExperienceAction, {} as FormState);
  const ref = useResetOnOk(state.ok);
  const fe = state.fieldErrors ?? {};
  return (
    <form ref={ref} action={action} className="space-y-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="exp-type" className="label">Jenis</label>
          <select id="exp-type" name="type" className="input" defaultValue="pengalaman">
            <option value="pengalaman">Pengalaman</option>
            <option value="prestasi">Prestasi</option>
            <option value="pendidikan">Pendidikan</option>
          </select>
        </div>
        <Field label="Judul" name="title" required error={fe.title} />
      </div>
      <Field label="Organisasi / institusi" name="organization" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Tahun mulai" name="start_year" type="number" placeholder="2024" />
        <Field label="Tahun selesai" name="end_year" type="number" placeholder="Kosongkan jika berlangsung" />
      </div>
      <TextArea label="Deskripsi" name="description" />
      <div className="flex items-center gap-3">
        <button disabled={pending} className="btn btn-navy">{pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Tambah riwayat</button>
        {state.ok && <span role="status" className="text-sm font-semibold text-emerald-600">{state.message}</span>}
      </div>
    </form>
  );
}
