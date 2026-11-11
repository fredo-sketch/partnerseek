import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import Avatar from "@/components/Avatar";
import ChatBox from "@/components/ChatBox";
import { requireUser } from "@/lib/auth";
import { getConversation } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const me = await requireUser(`/messages/${id}`);
  const data = await getConversation(id, me.id);
  if (!data) notFound();
  const { other, messages, post } = data;
  const wa = other.whatsapp ? `https://wa.me/${other.whatsapp}` : null;

  return (
    <>
      <header className="flex items-center justify-between gap-3 border-b border-line p-4">
        <Link href={`/u/${other.username}`} className="flex min-w-0 items-center gap-3">
          <Avatar name={other.name} size={40} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-navy-800">{other.name}</p>
            <p className="truncate text-xs text-muted">{post ? `Terkait: ${post.title}` : other.headline}</p>
          </div>
        </Link>
        {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost !px-3 !py-2 text-xs"><Phone className="size-3.5" /> Lanjut ke WhatsApp</a>}
      </header>
      <ChatBox
        convId={id}
        meId={me.id}
        messages={messages.map((m) => ({ id: m.id, sender_id: m.sender_id, body: m.body, created_at: new Date(m.created_at).toISOString() }))}
      />
    </>
  );
}
