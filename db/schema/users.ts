import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').unique(),
    full_name: text('full_name'),
    onboarding_completed_at: timestamp('onboarding_completed_at', {withTimezone: true}),
    created_at: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updated_at: timestamp('updated_at', {withTimezone: true})
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;