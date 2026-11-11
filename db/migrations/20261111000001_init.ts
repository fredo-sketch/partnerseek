import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (t) => {
    t.increments("id");
    t.string("name", 120).notNullable();
    t.string("username", 50).notNullable().unique();
    t.string("email", 190).notNullable().unique();
    t.string("password_hash", 120).notNullable();
    t.enu("role", ["mahasiswa", "umkm", "organisasi"]).notNullable().defaultTo("mahasiswa");
    t.string("university", 120).nullable();
    t.string("prodi", 120).nullable();
    t.string("faculty", 120).nullable();
    t.smallint("angkatan").nullable();
    t.string("headline", 160).nullable();
    t.text("bio").nullable();
    t.string("location", 100).nullable();
    t.string("whatsapp", 30).nullable();
    t.boolean("open_to_collab").notNullable().defaultTo(true);
    t.boolean("is_verified").notNullable().defaultTo(false);
    t.string("utm_source", 100).nullable();
    t.string("utm_medium", 100).nullable();
    t.string("utm_campaign", 150).nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.index(["role"]);
    t.index(["university"]);
  });

  await knex.schema.createTable("skills", (t) => {
    t.increments("id");
    t.string("name", 80).notNullable().unique();
    t.string("category", 60).notNullable();
    t.index(["category"]);
  });

  await knex.schema.createTable("user_skills", (t) => {
    t.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.integer("skill_id").unsigned().notNullable().references("id").inTable("skills").onDelete("CASCADE");
    t.enu("level", ["pemula", "menengah", "mahir"]).notNullable().defaultTo("menengah");
    t.primary(["user_id", "skill_id"]);
  });

  await knex.schema.createTable("user_interests", (t) => {
    t.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.string("interest", 40).notNullable(); // lomba | pkm | proyek | freelance | startup | organisasi
    t.primary(["user_id", "interest"]);
  });

  await knex.schema.createTable("skill_endorsements", (t) => {
    t.integer("endorser_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.integer("skill_id").unsigned().notNullable().references("id").inTable("skills").onDelete("CASCADE");
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.primary(["endorser_id", "user_id", "skill_id"]);
    t.index(["user_id", "skill_id"]);
  });

  await knex.schema.createTable("experiences", (t) => {
    t.increments("id");
    t.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.enu("type", ["pendidikan", "pengalaman", "prestasi"]).notNullable();
    t.string("title", 160).notNullable();
    t.string("organization", 160).nullable();
    t.smallint("start_year").nullable();
    t.smallint("end_year").nullable();
    t.text("description").nullable();
    t.index(["user_id"]);
  });

  await knex.schema.createTable("portfolio_items", (t) => {
    t.increments("id");
    t.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.string("title", 160).notNullable();
    t.text("description").nullable();
    t.string("link", 300).nullable();
    t.string("tags", 200).nullable();
    t.smallint("hue").notNullable().defaultTo(220);
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.index(["user_id"]);
  });

  await knex.schema.createTable("posts", (t) => {
    t.increments("id");
    t.integer("author_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.string("title", 180).notNullable();
    t.text("description").notNullable();
    t.enu("type", ["lomba", "pkm", "proyek", "freelance", "startup"]).notNullable();
    t.date("deadline").nullable();
    t.smallint("slots").notNullable().defaultTo(1);
    t.enu("status", ["open", "closed"]).notNullable().defaultTo("open");
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.index(["status", "created_at"]);
    t.index(["type"]);
  });

  await knex.schema.createTable("post_skills", (t) => {
    t.integer("post_id").unsigned().notNullable().references("id").inTable("posts").onDelete("CASCADE");
    t.integer("skill_id").unsigned().notNullable().references("id").inTable("skills").onDelete("CASCADE");
    t.primary(["post_id", "skill_id"]);
  });

  await knex.schema.createTable("conversations", (t) => {
    t.increments("id");
    t.integer("user_a_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.integer("user_b_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.integer("post_id").unsigned().nullable().references("id").inTable("posts").onDelete("SET NULL");
    t.timestamp("last_message_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("a_read_at").nullable();
    t.timestamp("b_read_at").nullable();
    t.unique(["user_a_id", "user_b_id"]);
  });

  await knex.schema.createTable("messages", (t) => {
    t.increments("id");
    t.integer("conversation_id").unsigned().notNullable().references("id").inTable("conversations").onDelete("CASCADE");
    t.integer("sender_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.text("body").notNullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.index(["conversation_id", "id"]);
  });

  await knex.schema.createTable("challenges", (t) => {
    t.increments("id");
    t.integer("organizer_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.string("title", 180).notNullable();
    t.text("description").notNullable();
    t.string("category", 60).notNullable();
    t.string("reward", 160).nullable();
    t.date("deadline").nullable();
    t.enu("status", ["open", "closed"]).notNullable().defaultTo("open");
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.index(["status", "deadline"]);
  });

  await knex.schema.createTable("challenge_skills", (t) => {
    t.integer("challenge_id").unsigned().notNullable().references("id").inTable("challenges").onDelete("CASCADE");
    t.integer("skill_id").unsigned().notNullable().references("id").inTable("skills").onDelete("CASCADE");
    t.primary(["challenge_id", "skill_id"]);
  });

  await knex.schema.createTable("challenge_entries", (t) => {
    t.integer("challenge_id").unsigned().notNullable().references("id").inTable("challenges").onDelete("CASCADE");
    t.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.string("note", 300).nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.primary(["challenge_id", "user_id"]);
  });

  await knex.schema.createTable("waitlist", (t) => {
    t.increments("id");
    t.string("email", 190).notNullable().unique();
    t.string("name", 120).nullable();
    t.string("campus", 120).nullable();
    t.string("skill", 120).nullable();
    t.string("utm_source", 100).nullable();
    t.string("utm_medium", 100).nullable();
    t.string("utm_campaign", 150).nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  const tables = [
    "waitlist",
    "challenge_entries",
    "challenge_skills",
    "challenges",
    "messages",
    "conversations",
    "post_skills",
    "posts",
    "portfolio_items",
    "experiences",
    "skill_endorsements",
    "user_interests",
    "user_skills",
    "skills",
    "users",
  ];
  for (const t of tables) await knex.schema.dropTableIfExists(t);
}
