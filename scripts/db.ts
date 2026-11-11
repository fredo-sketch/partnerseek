/**
 * Runner migrasi & seed (lintas OS, cocok untuk Windows + MySQL Workbench).
 *
 *   npm run db:migrate   → buat/ubah tabel
 *   npm run db:seed      → isi data dummy
 *   npm run db:rollback  → batalkan batch terakhir
 *   npm run db:reset     → hapus semua tabel, migrate, lalu seed
 */
import { config } from "dotenv";
import knex from "knex";

config({ path: [".env.local", ".env"] });

async function main() {
  const { buildKnexConfig } = await import("../src/lib/db-config");
  const db = knex(buildKnexConfig());
  const cmd = process.argv[2] ?? "migrate";
  try {
    if (cmd === "migrate") {
      const [batch, log] = await db.migrate.latest();
      console.log(log.length ? `Batch ${batch}: ${log.join(", ")}` : "Database sudah up-to-date.");
    } else if (cmd === "rollback") {
      const [batch, log] = await db.migrate.rollback();
      console.log(`Rollback batch ${batch}: ${log.join(", ") || "(kosong)"}`);
    } else if (cmd === "seed") {
      await db.seed.run();
      console.log("Seed selesai. Semua akun dummy memakai password: partnerseek123");
    } else if (cmd === "reset") {
      await db.migrate.rollback(undefined, true);
      await db.migrate.latest();
      await db.seed.run();
      console.log("Reset selesai (migrate + seed).");
    } else {
      console.error(`Perintah tidak dikenal: ${cmd}`);
      process.exitCode = 1;
    }
  } finally {
    await db.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
