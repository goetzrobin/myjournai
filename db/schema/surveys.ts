import {pgTable, text, timestamp, varchar, uuid} from "drizzle-orm/pg-core";

export const surveys = pgTable('surveys', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name'),
    description: text('description'),
    created_at: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updated_at: timestamp('updated_at', {withTimezone: true})
});

export type Survey = typeof surveys.$inferSelect;
export type NewSurvey = typeof surveys.$inferInsert;