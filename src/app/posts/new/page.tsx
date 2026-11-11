import type { Metadata } from "next";
import PostForm from "@/components/PostForm";
import { getAllSkills } from "@/lib/data";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Buat kebutuhan partner" };
export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  await requireUser("/posts/new");
  const skills = await getAllSkills();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-semibold text-navy-800">Buat kebutuhan partner</h1>
      <p className="mt-1 text-muted">Ceritakan siapa yang kamu cari. Sistem akan merekomendasikan talenta yang cocok.</p>
      <div className="card mt-8 p-6"><PostForm skills={skills} /></div>
    </div>
  );
}
