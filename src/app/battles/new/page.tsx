import type { Metadata } from "next";
import { redirect } from "next/navigation";
import BattleForm from "@/components/BattleForm";
import { requireUser } from "@/lib/auth";
import { getAllSkills } from "@/lib/data";

export const metadata: Metadata = { title: "Buka Weekly Battle" };
export const dynamic = "force-dynamic";

export default async function NewBattlePage() {
  const me = await requireUser("/battles/new");
  if (me.role === "mahasiswa") redirect("/battles");
  const skills = await getAllSkills();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-navy-800">Buka Weekly Battle</h1>
      <p className="mt-1 text-muted">Beri mahasiswa satu brief singkat selama seminggu. Karya terbaik didukung komunitas, lalu kamu yang memilih juaranya.</p>
      <div className="card mt-8 p-6"><BattleForm skills={skills} /></div>
    </div>
  );
}
