import { getSession } from "@/lib/auth";
import { countUnread } from "@/lib/data";
import NavClient from "./NavClient";

export default async function Navbar() {
  const session = await getSession();
  let unread = 0;
  if (session) {
    try {
      unread = await countUnread(session.id);
    } catch {
      unread = 0;
    }
  }
  return (
    <header className="sticky top-0 z-40">
      <div className="relative mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavClient user={session ? { name: session.name, username: session.username } : null} unread={unread} />
      </div>
    </header>
  );
}
