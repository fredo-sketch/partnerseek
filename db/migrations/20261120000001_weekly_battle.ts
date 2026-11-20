import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("battles", (t) => {
    t.increments("id");
    t.integer("host_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.string("title", 180).notNullable();
    t.text("brief").notNullable();
    t.string("category", 60).notNullable();
    t.string("prize", 160).nullable();
    t.date("starts_at").notNullable();
    t.date("ends_at").notNullable();
    t.enu("status", ["open", "closed"]).notNullable().defaultTo("open");
    t.integer("winner_entry_id").unsigned().nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.index(["status", "ends_at"]);
  });

  await knex.schema.createTable("battle_skills", (t) => {
    t.integer("battle_id").unsigned().notNullable().references("id").inTable("battles").onDelete("CASCADE");
    t.integer("skill_id").unsigned().notNullable().references("id").inTable("skills").onDelete("CASCADE");
    t.primary(["battle_id", "skill_id"]);
  });

  await knex.schema.createTable("battle_entries", (t) => {
    t.increments("id");
    t.integer("battle_id").unsigned().notNullable().references("id").inTable("battles").onDelete("CASCADE");
    t.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.string("title", 160).notNullable();
    t.text("description").notNullable();
    t.string("link_url", 300).nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.unique(["battle_id", "user_id"]);
  });

  await knex.schema.createTable("battle_votes", (t) => {
    t.integer("entry_id").unsigned().notNullable().references("id").inTable("battle_entries").onDelete("CASCADE");
    t.integer("user_id").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.primary(["entry_id", "user_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  for (const t of ["battle_votes", "battle_entries", "battle_skills", "battles"]) await knex.schema.dropTableIfExists(t);
}
