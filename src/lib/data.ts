import "server-only";
import { db } from "./db";
import type { PostType, Role, SkillChip, SkillLevel, UserCard } from "./types";

/* ───────────────────────── helpers ───────────────────────── */

async function attachSkills<T extends { id: number }>(
  rows: T[],
): Promise<(T & { skills: SkillChip[] })[]> {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const skillRows = await db("user_skills as us")
    .join("skills as s", "s.id", "us.skill_id")
    .whereIn("us.user_id", ids)
    .select("us.user_id", "s.id", "s.name", "s.category", "us.level");
  const map = new Map<number, SkillChip[]>();
  for (const r of skillRows) {
    const list = map.get(r.user_id) ?? [];
    list.push({ id: r.id, name: r.name, category: r.category, level: r.level as SkillLevel });
    map.set(r.user_id, list);
  }
  const order: Record<string, number> = { mahir: 0, menengah: 1, pemula: 2 };
  return rows.map((r) => ({
    ...r,
    skills: (map.get(r.id) ?? []).sort((a, b) => order[a.level!] - order[b.level!]),
  }));
}

const CARD_COLS = [
  "u.id", "u.name", "u.username", "u.role", "u.university", "u.prodi", "u.headline",
  "u.is_verified", "u.open_to_collab",
] as const;

function toCard(r: Record<string, unknown> & { skills: SkillChip[] }): UserCard {
  return {
    id: r.id as number,
    name: r.name as string,
    username: r.username as string,
    role: r.role as Role,
    university: (r.university as string) ?? null,
    prodi: (r.prodi as string) ?? null,
    headline: (r.headline as string) ?? null,
    is_verified: !!r.is_verified,
    open_to_collab: !!r.open_to_collab,
    skills: r.skills,
  };
}

/* ───────────────────────── skills ───────────────────────── */

export async function getAllSkills(): Promise<SkillChip[]> {
  return db("skills").select("id", "name", "category").orderBy([{ column: "category" }, { column: "name" }]);
}

/* ───────────────────────── talenta ───────────────────────── */

export interface TalentFilters {
  q?: string;
  skills?: number[];
  prodi?: string;
  university?: string;
  interest?: string;
  role?: Role | "all";
  sort?: "relevan" | "terbaru" | "endorse";
  page?: number;
  pageSize?: number;
}

export async function searchTalents(f: TalentFilters) {
  const pageSize = f.pageSize ?? 12;
  const page = Math.max(1, f.page ?? 1);

  const base = db("users as u").where("u.role", f.role && f.role !== "all" ? f.role : "mahasiswa");

  if (f.q) {
    const like = `%${f.q.trim()}%`;
    base.where((b) =>
      b
        .where("u.name", "like", like)
        .orWhere("u.headline", "like", like)
        .orWhere("u.prodi", "like", like)
        .orWhereExists(
          db("user_skills as us2")
            .join("skills as s2", "s2.id", "us2.skill_id")
            .whereRaw("us2.user_id = u.id")
            .where("s2.name", "like", like),
        ),
    );
  }
  if (f.prodi) base.where("u.prodi", "like", `%${f.prodi}%`);
  if (f.university) base.where("u.university", f.university);
  if (f.interest) {
    base.whereExists(
      db("user_interests as ui").whereRaw("ui.user_id = u.id").where("ui.interest", f.interest),
    );
  }
  if (f.skills?.length) {
    // Harus punya SEMUA skill yang dipilih
    base.whereIn(
      "u.id",
      db("user_skills")
        .select("user_id")
        .whereIn("skill_id", f.skills)
        .groupBy("user_id")
        .havingRaw("COUNT(DISTINCT skill_id) = ?", [f.skills.length]),
    );
  }

  const [{ total }] = await base.clone().clearSelect().countDistinct({ total: "u.id" });

  const q = base.clone().select(...CARD_COLS).limit(pageSize).offset((page - 1) * pageSize);
  if (f.sort === "terbaru") q.orderBy("u.created_at", "desc");
  else if (f.sort === "endorse")
    q.select(db.raw("(SELECT COUNT(*) FROM skill_endorsements e WHERE e.user_id = u.id) AS endorse_count")).orderBy("endorse_count", "desc");
  else q.orderBy([{ column: "u.is_verified", order: "desc" }, { column: "u.id", order: "asc" }]);

  const rows = await attachSkills(await q);
  return { users: rows.map(toCard), total: Number(total), page, pageSize };
}

export async function getFilterOptions() {
  const [prodi, univ] = await Promise.all([
    db("users").where("role", "mahasiswa").whereNotNull("prodi").distinct("prodi").orderBy("prodi"),
    db("users").where("role", "mahasiswa").whereNotNull("university").distinct("university").orderBy("university"),
  ]);
  return {
    prodi: prodi.map((r) => r.prodi as string),
    universities: univ.map((r) => r.university as string),
  };
}

export async function getLandingTalents(limit = 6): Promise<UserCard[]> {
  const rows = await db("users as u")
    .where("u.role", "mahasiswa")
    .select(...CARD_COLS)
    .orderBy([{ column: "u.is_verified", order: "desc" }, { column: "u.id", order: "asc" }])
    .limit(limit);
  return (await attachSkills(rows)).map(toCard);
}

export async function getLandingStats() {
  const [[u], [p], [c], [campus]] = await Promise.all([
    db("users").where("role", "mahasiswa").count({ n: "*" }),
    db("posts").where("status", "open").count({ n: "*" }),
    db("challenges").where("status", "open").count({ n: "*" }),
    db("users").where("role", "mahasiswa").countDistinct({ n: "university" }),
  ]);
  return {
    talents: Number(u.n),
    openPosts: Number(p.n),
    challenges: Number(c.n),
    campuses: Number(campus.n),
  };
}

/* ───────────────────────── profil ───────────────────────── */

export async function getProfile(username: string, viewerId?: number) {
  const user = await db("users").where({ username }).first();
  if (!user) return null;

  const [skills, interests, experiences, portfolio, posts] = await Promise.all([
    db("user_skills as us")
      .join("skills as s", "s.id", "us.skill_id")
      .where("us.user_id", user.id)
      .select("s.id", "s.name", "s.category", "us.level"),
    db("user_interests").where({ user_id: user.id }).pluck("interest"),
    db("experiences").where({ user_id: user.id }).orderBy([{ column: "end_year", order: "desc" }, { column: "start_year", order: "desc" }]),
    db("portfolio_items").where({ user_id: user.id }).orderBy("id", "desc"),
    db("posts").where({ author_id: user.id, status: "open" }).orderBy("created_at", "desc").limit(5),
  ]);

  const counts = (await db("skill_endorsements")
    .where({ user_id: user.id })
    .select("skill_id")
    .count({ n: "*" })
    .groupBy("skill_id")) as unknown as { skill_id: number; n: string | number }[];
  const countMap = new Map(counts.map((c) => [c.skill_id as number, Number(c.n)]));

  let mine = new Set<number>();
  if (viewerId) {
    const e = await db("skill_endorsements").where({ endorser_id: viewerId, user_id: user.id }).pluck("skill_id");
    mine = new Set(e as number[]);
  }

  const order: Record<string, number> = { mahir: 0, menengah: 1, pemula: 2 };
  const skillList = skills
    .map((s) => ({
      id: s.id as number,
      name: s.name as string,
      category: s.category as string,
      level: s.level as SkillLevel,
      endorsements: countMap.get(s.id) ?? 0,
      endorsedByMe: mine.has(s.id),
    }))
    .sort((a, b) => b.endorsements - a.endorsements || order[a.level] - order[b.level]);

  return { user, skills: skillList, interests: interests as string[], experiences, portfolio, posts };
}

/* ───────────────────────── postingan (feed) ───────────────────────── */

export interface PostRow {
  id: number;
  title: string;
  description: string;
  type: PostType;
  deadline: Date | string | null;
  slots: number;
  status: "open" | "closed";
  created_at: Date | string;
  author: { id: number; name: string; username: string; role: Role; prodi: string | null; university: string | null; is_verified: boolean };
  skills: SkillChip[];
}

async function hydratePosts(rows: Record<string, unknown>[]): Promise<PostRow[]> {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id as number);
  const sk = await db("post_skills as ps")
    .join("skills as s", "s.id", "ps.skill_id")
    .whereIn("ps.post_id", ids)
    .select("ps.post_id", "s.id", "s.name", "s.category");
  const map = new Map<number, SkillChip[]>();
  for (const r of sk) {
    const l = map.get(r.post_id) ?? [];
    l.push({ id: r.id, name: r.name, category: r.category });
    map.set(r.post_id, l);
  }
  return rows.map((r) => ({
    id: r.id as number,
    title: r.title as string,
    description: r.description as string,
    type: r.type as PostType,
    deadline: r.deadline as string | null,
    slots: r.slots as number,
    status: r.status as "open" | "closed",
    created_at: r.created_at as string,
    author: {
      id: r.author_id as number,
      name: r.author_name as string,
      username: r.author_username as string,
      role: r.author_role as Role,
      prodi: (r.author_prodi as string) ?? null,
      university: (r.author_university as string) ?? null,
      is_verified: !!r.author_verified,
    },
    skills: map.get(r.id as number) ?? [],
  }));
}

const POST_COLS = [
  "p.id", "p.title", "p.description", "p.type", "p.deadline", "p.slots", "p.status", "p.created_at", "p.author_id",
  "u.name as author_name", "u.username as author_username", "u.role as author_role",
  "u.prodi as author_prodi", "u.university as author_university", "u.is_verified as author_verified",
] as const;

export async function getFeed(opts: { type?: string; q?: string; skillIds?: number[]; page?: number; pageSize?: number }) {
  const pageSize = opts.pageSize ?? 10;
  const page = Math.max(1, opts.page ?? 1);
  const base = db("posts as p").join("users as u", "u.id", "p.author_id").where("p.status", "open");
  if (opts.type) base.where("p.type", opts.type);
  if (opts.q) {
    const like = `%${opts.q.trim()}%`;
    base.where((b) => b.where("p.title", "like", like).orWhere("p.description", "like", like));
  }
  if (opts.skillIds?.length) {
    base.whereExists(
      db("post_skills as ps").whereRaw("ps.post_id = p.id").whereIn("ps.skill_id", opts.skillIds),
    );
  }
  const [{ total }] = await base.clone().count({ total: "p.id" });
  const rows = await base.clone().select(...POST_COLS).orderBy("p.created_at", "desc").limit(pageSize).offset((page - 1) * pageSize);
  return { posts: await hydratePosts(rows), total: Number(total), page, pageSize };
}

export async function getPost(id: number) {
  const row = await db("posts as p").join("users as u", "u.id", "p.author_id").where("p.id", id).select(...POST_COLS).first();
  if (!row) return null;
  const [post] = await hydratePosts([row]);
  return post;
}

/** Rekomendasi talenta untuk sebuah kebutuhan, diurutkan berdasarkan persentase kecocokan skill. */
export async function getMatchesForPost(post: PostRow, limit = 5): Promise<UserCard[]> {
  const needed = post.skills.map((s) => s.id);
  if (!needed.length) return [];
  const rows = (await db("users as u")
    .join("user_skills as us", "us.user_id", "u.id")
    .where("u.role", "mahasiswa")
    .whereNot("u.id", post.author.id)
    .whereIn("us.skill_id", needed)
    .groupBy(...CARD_COLS)
    .select(...CARD_COLS)
    .count({ hit: "us.skill_id" })
    .orderBy("hit", "desc")
    .limit(limit)) as unknown as (Record<string, unknown> & { id: number; hit: number | string })[];
  const withSkills = await attachSkills(rows);
  return withSkills.map((r) => ({ ...toCard(r), match: Math.round((Number(r.hit) / needed.length) * 100) }));
}

/** Postingan yang cocok dengan skill milik user (untuk "Untuk kamu"). */
export async function getRecommendedPosts(userId: number, limit = 4) {
  const rows = await db("posts as p")
    .join("users as u", "u.id", "p.author_id")
    .join("post_skills as ps", "ps.post_id", "p.id")
    .join("user_skills as us", function () {
      this.on("us.skill_id", "ps.skill_id").andOn("us.user_id", db.raw("?", [userId]));
    })
    .where("p.status", "open")
    .whereNot("p.author_id", userId)
    .groupBy("p.id", "u.id")
    .select(...POST_COLS)
    .count({ hit: "ps.skill_id" })
    .orderBy("hit", "desc")
    .limit(limit);
  return hydratePosts(rows);
}

/* ───────────────────────── tantangan (UMKM / organisasi) ───────────────────────── */

export interface ChallengeListItem {
  id: number;
  title: string;
  description: string;
  category: string;
  reward: string | null;
  deadline: Date | string | null;
  organizer_name: string;
  organizer_username: string;
  organizer_role: Role;
  organizer_verified: number | boolean;
  entries: number;
  skills: SkillChip[];
}

export async function getChallenges(): Promise<ChallengeListItem[]> {
  const rows = await db("challenges as c")
    .join("users as u", "u.id", "c.organizer_id")
    .where("c.status", "open")
    .select(
      "c.id", "c.title", "c.description", "c.category", "c.reward", "c.deadline",
      "u.name as organizer_name", "u.username as organizer_username", "u.role as organizer_role", "u.is_verified as organizer_verified",
    )
    .select(db.raw("(SELECT COUNT(*) FROM challenge_entries ce WHERE ce.challenge_id = c.id) AS entries"))
    .orderBy("c.deadline", "asc");
  const ids = rows.map((r) => r.id as number);
  const sk = ids.length
    ? await db("challenge_skills as cs").join("skills as s", "s.id", "cs.skill_id").whereIn("cs.challenge_id", ids).select("cs.challenge_id", "s.id", "s.name", "s.category")
    : [];
  return rows.map((r) => ({
    id: r.id as number,
    title: r.title as string,
    description: r.description as string,
    category: r.category as string,
    reward: (r.reward as string) ?? null,
    deadline: r.deadline as string | null,
    organizer_name: r.organizer_name as string,
    organizer_username: r.organizer_username as string,
    organizer_role: r.organizer_role as Role,
    organizer_verified: r.organizer_verified as number,
    entries: Number(r.entries),
    skills: sk.filter((x) => x.challenge_id === r.id).map((x) => ({ id: x.id as number, name: x.name as string, category: x.category as string })),
  }));
}

export async function getChallenge(id: number, viewerId?: number) {
  const list = await getChallenges();
  const base = list.find((c) => c.id === id);
  if (!base) {
    // bisa jadi sudah closed → ambil langsung
    const row = await db("challenges").where({ id }).first();
    if (!row) return null;
  }
  const row = await db("challenges as c")
    .join("users as u", "u.id", "c.organizer_id")
    .where("c.id", id)
    .select("c.*", "u.name as organizer_name", "u.username as organizer_username", "u.role as organizer_role", "u.is_verified as organizer_verified")
    .first();
  if (!row) return null;
  const skills = await db("challenge_skills as cs").join("skills as s", "s.id", "cs.skill_id").where("cs.challenge_id", id).select("s.id", "s.name", "s.category");
  const entries = await db("challenge_entries as ce")
    .join("users as u", "u.id", "ce.user_id")
    .where("ce.challenge_id", id)
    .select("u.id", "u.name", "u.username", "u.prodi", "u.university", "ce.note", "ce.created_at")
    .orderBy("ce.created_at", "desc");
  const joined = viewerId ? entries.some((e) => e.id === viewerId) : false;
  return { ...row, skills, entries, joined };
}

/* ───────────────────────── pesan ───────────────────────── */

export async function getConversations(userId: number) {
  const rows = await db("conversations as c")
    .where((b) => b.where("c.user_a_id", userId).orWhere("c.user_b_id", userId))
    .join("users as ua", "ua.id", "c.user_a_id")
    .join("users as ub", "ub.id", "c.user_b_id")
    .leftJoin("posts as p", "p.id", "c.post_id")
    .select(
      "c.id", "c.user_a_id", "c.user_b_id", "c.last_message_at", "c.a_read_at", "c.b_read_at",
      "ua.name as a_name", "ua.username as a_username", "ub.name as b_name", "ub.username as b_username",
      "p.title as post_title",
    )
    .orderBy("c.last_message_at", "desc");

  const ids = rows.map((r) => r.id as number);
  const last = ids.length
    ? await db("messages as m")
        .whereIn("m.conversation_id", ids)
        .whereRaw("m.id = (SELECT MAX(id) FROM messages WHERE conversation_id = m.conversation_id)")
        .select("m.conversation_id", "m.body", "m.sender_id")
    : [];
  const lastMap = new Map(last.map((l) => [l.conversation_id as number, l]));

  return rows.map((r) => {
    const iAmA = r.user_a_id === userId;
    const readAt = iAmA ? r.a_read_at : r.b_read_at;
    const lm = lastMap.get(r.id);
    return {
      id: r.id as number,
      other: iAmA ? { name: r.b_name as string, username: r.b_username as string } : { name: r.a_name as string, username: r.a_username as string },
      lastBody: (lm?.body as string) ?? "",
      lastFromMe: lm ? lm.sender_id === userId : false,
      lastAt: r.last_message_at as Date,
      postTitle: (r.post_title as string) ?? null,
      unread: !!lm && lm.sender_id !== userId && (!readAt || new Date(readAt) < new Date(r.last_message_at)),
    };
  });
}

export async function getConversation(convId: number, userId: number) {
  const c = await db("conversations").where({ id: convId }).first();
  if (!c || (c.user_a_id !== userId && c.user_b_id !== userId)) return null;
  const otherId = c.user_a_id === userId ? c.user_b_id : c.user_a_id;
  const other = await db("users").where({ id: otherId }).select("id", "name", "username", "headline", "prodi", "whatsapp", "role", "is_verified").first();
  const messages = await db("messages").where({ conversation_id: convId }).orderBy("id", "asc");
  const post = c.post_id ? await db("posts").where({ id: c.post_id }).select("id", "title").first() : null;
  await db("conversations")
    .where({ id: convId })
    .update(c.user_a_id === userId ? { a_read_at: db.fn.now() } : { b_read_at: db.fn.now() });
  return { conversation: c, other, messages, post };
}

export async function countUnread(userId: number): Promise<number> {
  // Satu query ringan (dipanggil di navbar pada setiap halaman).
  const [row] = await db("conversations as c")
    .where((b) => b.where("c.user_a_id", userId).orWhere("c.user_b_id", userId))
    .whereRaw(
      `(SELECT m.sender_id FROM messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) <> ?`,
      [userId],
    )
    .whereRaw(
      `(CASE WHEN c.user_a_id = ? THEN c.a_read_at ELSE c.b_read_at END IS NULL
        OR (CASE WHEN c.user_a_id = ? THEN c.a_read_at ELSE c.b_read_at END) < c.last_message_at)`,
      [userId, userId],
    )
    .count({ n: "*" });
  return Number(row?.n ?? 0);
}

/* ───────────────────────── dasbor ───────────────────────── */

export async function getMyPosts(userId: number) {
  const rows = await db("posts as p").join("users as u", "u.id", "p.author_id").where("p.author_id", userId).select(...POST_COLS).orderBy("p.created_at", "desc");
  return hydratePosts(rows);
}
