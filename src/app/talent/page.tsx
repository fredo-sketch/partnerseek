import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, SlidersHorizontal } from "lucide-react";
import TalentCard from "@/components/TalentCard";
import SkillPicker from "@/components/SkillPicker";
import Pagination from "@/components/Pagination";
import { getAllSkills, getFilterOptions, searchTalents } from "@/lib/data";
import { INTEREST_LABEL } from "@/lib/types";

export const metadata: Metadata = { title: "Cari Talenta" };
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function TalentPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const skillIds = (Array.isArray(sp.skill) ? sp.skill : sp.skill ? [sp.skill] : []).map(Number).filter(Boolean);
  const page = Number(one(sp.page)) || 1;
  const sort = (one(sp.sort) || "relevan") as "relevan" | "terbaru" | "endorse";

  const [skills, opts, res] = await Promise.all([
    getAllSkills(),
    getFilterOptions(),
    searchTalents({ q: one(sp.q), skills: skillIds, prodi: one(sp.prodi), university: one(sp.university), interest: one(sp.interest), sort, page }),
  ]);
  const picked = skills.filter((s) => skillIds.includes(s.id)).map((s) => s.name);
  const active = [one(sp.q), one(sp.prodi), one(sp.university), one(sp.interest), ...skillIds.map(String)].some(Boolean);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-4xl font-semibold text-navy-800">Cari talenta</h1>
        <p className="mt-1 text-muted">Temukan mahasiswa berdasarkan keahlian, program studi, dan minat kolaborasi.</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
        <form method="get" className="card h-fit space-y-5 p-5 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-navy-800"><SlidersHorizontal className="size-4" /> Filter</div>
          <div>
            <label htmlFor="q" className="label">Kata kunci</label>
            <input id="q" name="q" defaultValue={one(sp.q)} className="input" placeholder="nama, skill, jurusan…" />
          </div>
          <div>
            <p className="label">Keahlian <span className="font-normal text-muted">(harus punya semua)</span></p>
            <SkillPicker skills={skills} selected={skillIds} name="skill" />
          </div>
          <div>
            <label htmlFor="prodi" className="label">Program studi</label>
            <select id="prodi" name="prodi" defaultValue={one(sp.prodi)} className="input">
              <option value="">Semua prodi</option>
              {opts.prodi.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="university" className="label">Kampus</label>
            <select id="university" name="university" defaultValue={one(sp.university)} className="input">
              <option value="">Semua kampus</option>
              {opts.universities.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="interest" className="label">Minat kolaborasi</label>
            <select id="interest" name="interest" defaultValue={one(sp.interest)} className="input">
              <option value="">Semua</option>
              {Object.entries(INTEREST_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="label">Urutkan</label>
            <select id="sort" name="sort" defaultValue={sort} className="input">
              <option value="relevan">Terverifikasi dulu</option>
              <option value="endorse">Paling banyak endorsement</option>
              <option value="terbaru">Terbaru bergabung</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-navy flex-1">Terapkan</button>
            {active && <Link href="/talent" className="btn btn-ghost">Reset</Link>}
          </div>
        </form>

        <section aria-live="polite">
          <p className="mb-4 text-sm text-muted"><b className="text-navy-800">{res.total}</b> talenta ditemukan{picked.length ? <> dengan skill <b className="text-navy-800">{picked.join(" + ")}</b></> : null}</p>
          {res.users.length ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {res.users.map((u) => <TalentCard key={u.id} u={u} highlightSkills={picked} />)}
            </div>
          ) : (
            <div className="card grid place-items-center gap-3 p-14 text-center">
              <SearchX className="size-10 text-navy-100" />
              <p className="font-display text-xl font-semibold text-navy-800">Belum ada talenta yang cocok</p>
              <p className="text-sm text-muted">Coba kurangi filter skill atau ganti kata kunci.</p>
              <Link href="/talent" className="btn btn-navy">Reset filter</Link>
            </div>
          )}
          <Pagination page={res.page} total={res.total} pageSize={res.pageSize} params={sp} basePath="/talent" />
        </section>
      </div>
    </div>
  );
}
