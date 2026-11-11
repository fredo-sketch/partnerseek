import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ChallengeForm from "@/components/ChallengeForm";
import { requireUser } from "@/lib/auth";
import { getAllSkills } from "@/lib/data";

export const metadata: Metadata = { title: "Buka tantangan" };
export const dynamic = "force-dynamic";

export default async function NewChallengePage() {
  const me = await requireUser("/challenges/new");
  if (me.role === "mahasiswa") redirect("/challenges");
  const skills = await getAllSkills();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-navy-800">Buka tantangan</h1>
      <p className="mt-1 text-muted">Tantang mahasiswa menyelesaikan kebutuhan nyata bisnis atau organisasimu.</p>
      <div className="card mt-8 p-6"><ChallengeForm skills={skills} /></div>
    </div>
  );
}
