import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({ label, error, hint, ...props }: { label: string; error?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = props.id ?? props.name;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} className="input" aria-invalid={!!error} {...props} />
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

export function TextArea({ label, error, hint, ...props }: { label: string; error?: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = props.id ?? props.name;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <textarea id={id} className="input min-h-28 resize-y" aria-invalid={!!error} {...props} />
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
