import { pgTable, uuid, text, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const planFeatures = pgTable("plan_features", {
	id: uuid("id").defaultRandom().primaryKey(),
	planId: uuid("plan_id").notNull(),
	key: text("key").notNull(),
	enabled: boolean("enabled").notNull().default(true),
	hardLimit: integer("hard_limit"),
	softLimit: integer("soft_limit"),
	metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const featureFlags = pgTable("feature_flags", {
	id: uuid("id").defaultRandom().primaryKey(),
	tenantId: uuid("tenant_id").notNull(),
	key: text("key").notNull(),
	enabled: boolean("enabled").notNull().default(true),
	value: jsonb("value").$type<Record<string, unknown>>().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
