import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";

export const cohorts = pgTable('cohorts', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('name').unique(),
    created_at: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updated_at: timestamp('updated_at', {withTimezone: true})
});

export type Cohort = typeof cohorts.$inferSelect;
export type NewCohort = typeof cohorts.$inferInsert;
