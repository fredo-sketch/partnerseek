import type { Knex } from "knex";

export function buildKnexConfig(): Knex.Config {
  const ssl = process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined;
  return {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST ?? "127.0.0.1",
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? "root",
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_NAME ?? "partnerseek",
      charset: "utf8mb4",
      // Semua waktu disimpan & dibaca sebagai UTC, supaya konsisten di lokal, Vercel, dan penyedia MySQL mana pun.
      timezone: "Z",
      ssl,
    },
    // Pool kecil: aman untuk serverless (Vercel) agar tidak menghabiskan koneksi MySQL.
    pool: {
      min: 0,
      // Di Vercel/serverless disarankan 1–2 (set DB_POOL_MAX=1) agar tidak menghabiskan koneksi database cloud.
      max: Math.max(1, Number(process.env.DB_POOL_MAX ?? 5) || 5),
      idleTimeoutMillis: 10_000,
      afterCreate: (
        conn: { query: (sql: string, cb: (err: Error | null) => void) => void },
        done: (err: Error | null, conn: unknown) => void,
      ) => conn.query("SET time_zone = '+00:00'", (err) => done(err, conn)),
    },
    migrations: {
      directory: "./db/migrations",
      extension: "ts",
      loadExtensions: [".ts"],
    },
    seeds: { directory: "./db/seeds", loadExtensions: [".ts"] },
  };
}
