import { pgTable, pgEnum, timestamp, uuid } from 'drizzle-orm/pg-core';
import { cohorts } from './cohorts';
import { users } from './users';

export const cohorts_users_status = pgEnum('cohorts_users_status', ['ACTIVE', 'INACTIVE']);

export const cohorts_users = pgTable('cohorts_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  cohortId: uuid('cohort_id').notNull().references(() => cohorts.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  status: cohorts_users_status('status').default('ACTIVE'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export type CohortsUsersConnection = typeof cohorts_users.$inferSelect;
export type NewCohortsUsersConnection = typeof cohorts_users.$inferInsert;
