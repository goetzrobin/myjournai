import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const cohorts = pgTable('cohorts', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name'),
    slug: text('slug').unique(),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow(),
    updatedAt: timestamp('updated_at', {withTimezone: true})
});

export type Cohort = typeof cohorts.$inferSelect;
export type NewCohort = typeof cohorts.$inferInsert;
