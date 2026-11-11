import type { Metadata } from "next";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import ProfileForm from "@/components/ProfileForm";
import { ExperienceForm, PortfolioForm } from "@/components/SmallForms";
import ViewTracker from "@/components/ViewTracker";
import { requireUser } from "@/lib/auth";
import { getAllSkills, getProfile } from "@/lib/data";
import { deleteExperienceAction, deletePortfolioAction } from "@/lib/actions";
import type { SkillLevel } from "@/lib/types";

export const metadata: Metadata = { title: "Edit profil" };
export const dynamic = "force-dynamic";

export default async function SettingsProfilePage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const me = await requireUser("/settings/profile");
  const { welcome } = await searchParams;
  const [profile, allSkills] = await Promise.all([getProfile(me.username, me.id), getAllSkills()]);
  if (!profile) return null;
  const u = profile.user;
  const isStudent = u.role === "mahasiswa";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {welcome && <ViewTracker event="sign_up" params={{ method: "email", role: u.role }} />}
      {welcome && (
        <div className="mb-6 rounded-2xl bg-amber-100 p-5 text-navy-900">
          <p className="font-display text-xl font-semibold">Selamat datang di PartnerSeek, {u.name.split(" ")[0]}! 🎉</p>
          <p className="mt-1 text-sm">Lengkapi profil dan pilih keahlianmu agar mudah ditemukan dan dapat rekomendasi yang pas.</p>
        </div>
      )}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold text-navy-800">Edit profil</h1>
        <Link href={`/u/${u.username}`} className="btn btn-ghost">Lihat profil</Link>
      </div>

      <ProfileForm
        allSkills={allSkills}
        initial={{
          name: u.name, headline: u.headline ?? "", bio: u.bio ?? "", university: u.university ?? "", prodi: u.prodi ?? "",
          faculty: u.faculty ?? "", angkatan: u.angkatan ? String(u.angkatan) : "", location: u.location ?? "",
          whatsapp: u.whatsapp ?? "", open_to_collab: !!u.open_to_collab, role: u.role,
          skills: Object.fromEntries(profile.skills.map((s) => [s.id, s.level as SkillLevel])),
          interests: profile.interests,
        }}
      />

      {isStudent && (
        <>
          <section className="card mt-8 space-y-5 p-6">
            <h2 className="font-display text-xl font-semibold text-navy-800">Portofolio</h2>
            {profile.portfolio.length > 0 && (
              <ul className="space-y-2">
                {profile.portfolio.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl bg-navy-50/60 px-4 py-3">
                    <span className="truncate text-sm font-semibold text-navy-800">{p.title}</span>
                    <form action={deletePortfolioAction.bind(null, p.id)}><button className="text-red-500 hover:text-red-600" aria-label={`Hapus ${p.title}`}><Trash2 className="size-4" /></button></form>
                  </li>
                ))}
              </ul>
            )}
            <PortfolioForm />
          </section>

          <section className="card mt-8 space-y-5 p-6">
            <h2 className="font-display text-xl font-semibold text-navy-800">Pendidikan, pengalaman & prestasi</h2>
            {profile.experiences.length > 0 && (
              <ul className="space-y-2">
                {profile.experiences.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 rounded-xl bg-navy-50/60 px-4 py-3">
                    <span className="min-w-0 truncate text-sm"><b className="text-navy-800">{e.title}</b> <span className="text-muted">· {e.type}</span></span>
                    <form action={deleteExperienceAction.bind(null, e.id)}><button className="text-red-500 hover:text-red-600" aria-label={`Hapus ${e.title}`}><Trash2 className="size-4" /></button></form>
                  </li>
                ))}
              </ul>
            )}
            <ExperienceForm />
          </section>
        </>
      )}
    </div>
  );
}
