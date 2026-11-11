"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { sendMessageAction, type FormState } from "@/lib/actions";
import { track } from "@/lib/track";

export interface Msg { id: number; sender_id: number; body: string; created_at: string }

export default function ChatBox({ convId, meId, messages }: { convId: number; meId: number; messages: Msg[] }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(sendMessageAction.bind(null, convId), {} as FormState);
  const formRef = useRef<HTMLFormElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      track("send_message");
    }
  }, [state]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  // Polling ringan agar pesan baru muncul tanpa reload
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 6000);
    return () => clearInterval(t);
  }, [router]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto p-4" role="log" aria-live="polite">
        {messages.length === 0 && <p className="py-10 text-center text-sm text-muted">Mulai percakapan dengan menyapa 👋</p>}
        {messages.map((m) => {
          const mine = m.sender_id === meId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${mine ? "rounded-br-md bg-navy-800 text-white" : "rounded-bl-md bg-white ring-1 ring-line"}`}>
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p className={`mt-1 text-[10px] ${mine ? "text-white/60" : "text-muted"}`}>{new Date(m.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form ref={formRef} action={action} className="border-t border-line bg-white p-3">
        {state.error && <p role="alert" className="mb-2 text-xs font-medium text-red-500">{state.error}</p>}
        <div className="flex gap-2">
          <textarea
            name="body"
            rows={1}
            required
            maxLength={2000}
            placeholder="Tulis pesan…"
            aria-label="Pesan"
            className="input max-h-32 min-h-11 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <button disabled={pending} className="btn btn-primary !px-4" aria-label="Kirim"><Send className="size-4" /></button>
        </div>
      </form>
    </div>
  );
}
