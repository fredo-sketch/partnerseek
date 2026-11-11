"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction, type FormState } from "@/lib/actions";
import { Field } from "./Field";

export default function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, {} as FormState);
  const fe = state.fieldErrors ?? {};
  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      {state.error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{state.error}</p>}
      <Field label="Email" name="email" type="email" autoComplete="email" required error={fe.email} placeholder="kamu@email.com" />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required error={fe.password} />
      <button disabled={pending} className="btn btn-navy w-full">{pending && <Loader2 className="size-4 animate-spin" />} Masuk</button>
      <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">Demo: <b>rina.kusuma@example.com</b> / <b>partnerseek123</b></p>
    </form>
  );
}
