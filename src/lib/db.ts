import "server-only";
import knex, { type Knex } from "knex";
import { buildKnexConfig } from "./db-config";

declare global {
  var __partnerseekDb: Knex | undefined;
}

// Singleton supaya hot-reload dev tidak membuat banyak pool koneksi.
export const db: Knex = globalThis.__partnerseekDb ?? knex(buildKnexConfig());
if (process.env.NODE_ENV !== "production") globalThis.__partnerseekDb = db;
