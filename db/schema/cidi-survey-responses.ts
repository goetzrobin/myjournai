import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const cidiSurveyTypes = pgEnum('cidi_survey_types', ['PRE', 'POST']);

export const cidiSurveyResponses = pgTable('cidi_survey_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id),
  type: cidiSurveyTypes('type'),
  question_1_0: integer('question_1_0'),
  question_1_1: integer('question_1_1'),
  question_1_2: integer('question_1_2'),
  question_1_3: integer('question_1_3'),
  question_1_4: integer('question_1_4'),
  question_1_5: integer('question_1_5'),
  question_1_6: integer('question_1_6'),
  question_1_7: integer('question_1_7'),
  question_2_0: integer('question_2_0'),
  question_2_1: integer('question_2_1'),
  question_2_2: integer('question_2_2'),
  question_2_3: integer('question_2_3'),
  question_2_4: integer('question_2_4'),
  question_3_1: integer('question_3_1'),
  question_3_2: integer('question_3_2'),
  question_3_3: integer('question_3_3'),
  question_3_4: integer('question_3_4'),
  question_3_5: integer('question_3_5'),
  question_4_0: integer('question_4_0'),
  question_4_1: integer('question_4_1'),
  question_4_2: integer('question_4_2'),
  question_5_0: integer('question_5_0'),
  question_5_1: integer('question_5_1'),
  question_5_2: integer('question_5_2'),
  question_5_3: integer('question_5_3'),
  question_5_4: integer('question_5_4'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
});

export const selectCidiSurveyResponsesSchema = createSelectSchema(users);
export const insertCidiSurveyResponsesSchema = createInsertSchema(cidiSurveyResponses);

export type CidiSurveyResponses = z.infer<typeof selectCidiSurveyResponsesSchema>;
export type NewCidiSurveyResponses = z.infer<typeof insertCidiSurveyResponsesSchema>
