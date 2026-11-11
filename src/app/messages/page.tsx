import { MessageCircle } from "lucide-react";

export default function MessagesIndex() {
  return (
    <div className="grid flex-1 place-items-center p-10 text-center text-muted">
      <div>
        <MessageCircle className="mx-auto size-12 text-navy-100" />
        <p className="mt-3 font-display text-xl font-semibold text-navy-800">Pilih percakapan</p>
        <p className="text-sm">Atau mulai dari profil talenta mana pun.</p>
      </div>
    </div>
  );
}
