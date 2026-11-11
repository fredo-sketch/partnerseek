"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { createSession, destroySession, getSession, requireUser } from "./auth";
import { INTERESTS } from "./types";

export type FormState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
};

/* ───────────── util ───────────── */

function safeNext(v: unknown, fallback = "/feed") {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : fallback;
}

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of err.issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}

async function readUtm() {
  try {
    const raw = (await cookies()).get("ps_utm")?.value;
    if (!raw) return {};
    const o = JSON.parse(decodeURIComponent(raw));
    return {
      utm_source: String(o.utm_source ?? "").slice(0, 100) || null,
      utm_medium: String(o.utm_medium ?? "").slice(0, 100) || null,
      utm_campaign: String(o.utm_campaign ?? "").slice(0, 150) || null,
    };
  } catch {
    return {};
  }
}

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 36) || "user"
  );
}

async function uniqueUsername(name: string) {
  const base = slugify(name);
  let candidate = base;
  for (let i = 0; i < 20; i++) {
    const exists = await db("users").where({ username: candidate }).first("id");
    if (!exists) return candidate;
    candidate = `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  return `${base}-${Date.now()}`;
}

/* ───────────── auth ───────────── */

const registerSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter").max(120),
  email: z.string().trim().toLowerCase().email("Format email tidak valid").max(190),
  password: z.string().min(8, "Password minimal 8 karakter").max(72, "Password maksimal 72 karakter"),
  role: z.enum(["mahasiswa", "umkm", "organisasi"]),
  university: z.string().trim().max(120).optional(),
  prodi: z.string().trim().max(120).optional(),
});

export async function registerAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const dup = await db("users").where({ email: d.email }).first("id");
  if (dup) return { fieldErrors: { email: "Email sudah terdaftar. Silakan masuk." } };

  const utm = await readUtm();
  const username = await uniqueUsername(d.name);
  const [id] = await db("users").insert({
    name: d.name,
    username,
    email: d.email,
    password_hash: await bcrypt.hash(d.password, 10),
    role: d.role,
    university: d.university || (d.role === "mahasiswa" ? "Universitas Negeri Semarang" : null),
    prodi: d.prodi || null,
    ...utm,
  });

  await createSession({ id, name: d.name, username, role: d.role });
  redirect("/settings/profile?welcome=1");
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function loginAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const user = await db("users").where({ email: parsed.data.email }).first();
  const ok = user && (await bcrypt.compare(parsed.data.password, user.password_hash));
  if (!user || !ok) return { error: "Email atau password salah." };
  await createSession({ id: user.id, name: user.name, username: user.username, role: user.role });
  redirect(safeNext(fd.get("next")));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

/* ───────────── waitlist ───────────── */

const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format email tidak valid").max(190),
  name: z.string().trim().max(120).optional(),
  campus: z.string().trim().max(120).optional(),
  skill: z.string().trim().max(120).optional(),
});

export async function joinWaitlistAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = waitlistSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;
  const utm = await readUtm();
  try {
    await db("waitlist").insert({
      email: d.email,
      name: d.name || null,
      campus: d.campus || null,
      skill: d.skill || null,
      ...utm,
    });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "ER_DUP_ENTRY") {
      return { ok: true, message: "Email ini sudah ada di daftar tunggu. Kami akan kabari kamu!" };
    }
    throw e;
  }
  return { ok: true, message: "Berhasil! Kamu sudah masuk daftar tunggu PartnerSeek." };
}

/* ───────────── postingan ───────────── */

const postSchema = z.object({
  title: z.string().trim().min(10, "Judul minimal 10 karakter").max(180),
  description: z.string().trim().min(30, "Deskripsi minimal 30 karakter").max(3000),
  type: z.enum(["lomba", "pkm", "proyek", "freelance", "startup"]),
  slots: z.coerce.number().int().min(1).max(20),
  deadline: z.string().optional(),
});

export async function createPostAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireUser("/posts/new");
  const parsed = postSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const skillIds = fd.getAll("skills").map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 8);
  if (!skillIds.length) return { fieldErrors: { skills: "Pilih minimal 1 skill yang dibutuhkan" } };
  const d = parsed.data;

  const id = await db.transaction(async (trx) => {
    const [pid] = await trx("posts").insert({
      author_id: me.id,
      title: d.title,
      description: d.description,
      type: d.type,
      slots: d.slots,
      deadline: d.deadline || null,
    });
    await trx("post_skills").insert(skillIds.map((s) => ({ post_id: pid, skill_id: s })));
    return pid;
  });
  revalidatePath("/feed");
  redirect(`/posts/${id}`);
}

export async function togglePostStatusAction(postId: number) {
  const me = await requireUser();
  const p = await db("posts").where({ id: postId, author_id: me.id }).first();
  if (!p) return;
  await db("posts").where({ id: postId }).update({ status: p.status === "open" ? "closed" : "open" });
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/feed");
  revalidatePath("/dashboard");
}

/* ───────────── pesan ───────────── */

export async function startConversationAction(username: string, postId?: number) {
  const me = await requireUser(`/u/${username}`);
  const other = await db("users").where({ username }).first("id");
  if (!other || other.id === me.id) redirect(`/u/${username}`);
  const [a, b] = [me.id, other.id].sort((x, y) => x - y);
  let conv = await db("conversations").where({ user_a_id: a, user_b_id: b }).first("id");
  if (!conv) {
    const [id] = await db("conversations").insert({ user_a_id: a, user_b_id: b, post_id: postId ?? null });
    conv = { id };
  }
  redirect(`/messages/${conv.id}`);
}

export async function sendMessageAction(convId: number, _prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireUser();
  const body = String(fd.get("body") ?? "").trim();
  if (!body) return { error: "Pesan tidak boleh kosong." };
  if (body.length > 2000) return { error: "Pesan terlalu panjang (maks 2000 karakter)." };
  const c = await db("conversations").where({ id: convId }).first();
  if (!c || (c.user_a_id !== me.id && c.user_b_id !== me.id)) return { error: "Percakapan tidak ditemukan." };
  await db.transaction(async (trx) => {
    await trx("messages").insert({ conversation_id: convId, sender_id: me.id, body });
    await trx("conversations")
      .where({ id: convId })
      .update({ last_message_at: trx.fn.now(), ...(c.user_a_id === me.id ? { a_read_at: trx.fn.now() } : { b_read_at: trx.fn.now() }) });
  });
  revalidatePath(`/messages/${convId}`);
  revalidatePath("/messages");
  return { ok: true };
}

/* ───────────── endorsement ───────────── */

export async function toggleEndorseAction(userId: number, skillId: number, username: string) {
  const me = await requireUser(`/u/${username}`);
  if (me.id === userId) return;
  const where = { endorser_id: me.id, user_id: userId, skill_id: skillId };
  const exists = await db("skill_endorsements").where(where).first("endorser_id");
  if (exists) await db("skill_endorsements").where(where).delete();
  else {
    const has = await db("user_skills").where({ user_id: userId, skill_id: skillId }).first("user_id");
    if (has) await db("skill_endorsements").insert(where);
  }
  revalidatePath(`/u/${username}`);
}

/* ───────────── profil ───────────── */

const profileSchema = z.object({
  name: z.string().trim().min(3).max(120),
  headline: z.string().trim().max(160).optional(),
  bio: z.string().trim().max(1500).optional(),
  university: z.string().trim().max(120).optional(),
  prodi: z.string().trim().max(120).optional(),
  faculty: z.string().trim().max(120).optional(),
  angkatan: z.string().optional(),
  location: z.string().trim().max(100).optional(),
  whatsapp: z.string().trim().max(30).optional(),
});

export async function updateProfileAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireUser("/settings/profile");
  const parsed = profileSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;
  const angkatan = Number(d.angkatan);
  const wa = (d.whatsapp ?? "").replace(/[^\d]/g, "").replace(/^0/, "62");

  // format: "skillId:level"
  const skillPairs = fd
    .getAll("skill")
    .map(String)
    .map((s) => s.split(":"))
    .filter(([id, lv]) => Number.isInteger(Number(id)) && ["pemula", "menengah", "mahir"].includes(lv))
    .slice(0, 15);
  const interests = fd.getAll("interest").map(String).filter((i) => INTERESTS.includes(i));

  await db.transaction(async (trx) => {
    await trx("users").where({ id: me.id }).update({
      name: d.name,
      headline: d.headline || null,
      bio: d.bio || null,
      university: d.university || null,
      prodi: d.prodi || null,
      faculty: d.faculty || null,
      angkatan: angkatan >= 2000 && angkatan <= 2100 ? angkatan : null,
      location: d.location || null,
      whatsapp: wa || null,
      open_to_collab: fd.get("open_to_collab") === "on",
    });
    await trx("user_skills").where({ user_id: me.id }).delete();
    if (skillPairs.length)
      await trx("user_skills").insert(skillPairs.map(([id, level]) => ({ user_id: me.id, skill_id: Number(id), level })));
    await trx("user_interests").where({ user_id: me.id }).delete();
    if (interests.length) await trx("user_interests").insert(interests.map((interest) => ({ user_id: me.id, interest })));
  });

  // Segarkan nama pada sesi
  await createSession({ id: me.id, name: d.name, username: me.username, role: me.role });
  revalidatePath(`/u/${me.username}`);
  return { ok: true, message: "Profil berhasil disimpan." };
}

const portfolioSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(160),
  description: z.string().trim().max(600).optional(),
  link: z.string().trim().url("Tautan harus berupa URL lengkap (https://…)").max(300).optional().or(z.literal("")),
  tags: z.string().trim().max(200).optional(),
});

export async function addPortfolioAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireUser("/settings/profile");
  const parsed = portfolioSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;
  await db("portfolio_items").insert({
    user_id: me.id,
    title: d.title,
    description: d.description || null,
    link: d.link || null,
    tags: d.tags || null,
    hue: Math.floor(Math.random() * 360),
  });
  revalidatePath(`/u/${me.username}`);
  revalidatePath("/settings/profile");
  return { ok: true, message: "Karya ditambahkan." };
}

export async function deletePortfolioAction(id: number) {
  const me = await requireUser();
  await db("portfolio_items").where({ id, user_id: me.id }).delete();
  revalidatePath(`/u/${me.username}`);
  revalidatePath("/settings/profile");
}

const expSchema = z.object({
  type: z.enum(["pendidikan", "pengalaman", "prestasi"]),
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(160),
  organization: z.string().trim().max(160).optional(),
  start_year: z.string().optional(),
  end_year: z.string().optional(),
  description: z.string().trim().max(600).optional(),
});

export async function addExperienceAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireUser("/settings/profile");
  const parsed = expSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;
  const yr = (v?: string) => {
    const n = Number(v);
    return n >= 1990 && n <= 2100 ? n : null;
  };
  await db("experiences").insert({
    user_id: me.id,
    type: d.type,
    title: d.title,
    organization: d.organization || null,
    start_year: yr(d.start_year),
    end_year: yr(d.end_year),
    description: d.description || null,
  });
  revalidatePath(`/u/${me.username}`);
  revalidatePath("/settings/profile");
  return { ok: true, message: "Riwayat ditambahkan." };
}

export async function deleteExperienceAction(id: number) {
  const me = await requireUser();
  await db("experiences").where({ id, user_id: me.id }).delete();
  revalidatePath(`/u/${me.username}`);
  revalidatePath("/settings/profile");
}

/* ───────────── tantangan ───────────── */

export async function joinChallengeAction(challengeId: number, _prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireUser(`/challenges/${challengeId}`);
  const note = String(fd.get("note") ?? "").trim().slice(0, 300);
  const ch = await db("challenges").where({ id: challengeId, status: "open" }).first("id");
  if (!ch) return { error: "Tantangan sudah ditutup." };
  try {
    await db("challenge_entries").insert({ challenge_id: challengeId, user_id: me.id, note: note || null });
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "ER_DUP_ENTRY") return { ok: true, message: "Kamu sudah terdaftar di tantangan ini." };
    throw e;
  }
  revalidatePath(`/challenges/${challengeId}`);
  return { ok: true, message: "Berhasil bergabung! Penyelenggara bisa melihat profilmu." };
}

export async function leaveChallengeAction(challengeId: number) {
  const me = await getSession();
  if (!me) return;
  await db("challenge_entries").where({ challenge_id: challengeId, user_id: me.id }).delete();
  revalidatePath(`/challenges/${challengeId}`);
}

/* ───────────── buat tantangan (mitra) ───────────── */

const challengeSchema = z.object({
  title: z.string().trim().min(10, "Judul minimal 10 karakter").max(180),
  description: z.string().trim().min(40, "Deskripsi minimal 40 karakter").max(4000),
  category: z.string().trim().min(2, "Kategori wajib diisi").max(60),
  reward: z.string().trim().max(160).optional(),
  deadline: z.string().min(1, "Batas waktu wajib diisi"),
});

export async function createChallengeAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireUser("/challenges/new");
  if (me.role === "mahasiswa") return { error: "Hanya akun UMKM/organisasi yang dapat membuka tantangan." };
  const parsed = challengeSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const skillIds = fd.getAll("skills").map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, 8);
  const d = parsed.data;
  const id = await db.transaction(async (trx) => {
    const [cid] = await trx("challenges").insert({
      organizer_id: me.id, title: d.title, description: d.description, category: d.category,
      reward: d.reward || null, deadline: d.deadline,
    });
    if (skillIds.length) await trx("challenge_skills").insert(skillIds.map((s) => ({ challenge_id: cid, skill_id: s })));
    return cid;
  });
  revalidatePath("/challenges");
  redirect(`/challenges/${id}`);
}
