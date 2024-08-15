import { integer, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const cidiSurveyTypes = pgEnum('cidi_survey_types', ['PRE', 'POST']);
export type CidiSurveyType = 'PRE' | 'POST'

export const cidiSurveyResponses = pgTable('cidi_survey_responses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: cidiSurveyTypes('type'),
  question10: integer('question_1_0'),
  question11: integer('question_1_1'),
  question12: integer('question_1_2'),
  question13: integer('question_1_3'),
  question14: integer('question_1_4'),
  question15: integer('question_1_5'),
  question16: integer('question_1_6'),
  question17: integer('question_1_7'),
  question20: integer('question_2_0'),
  question21: integer('question_2_1'),
  question22: integer('question_2_2'),
  question23: integer('question_2_3'),
  question24: integer('question_2_4'),
  question30: integer('question_3_0'),
  question31: integer('question_3_1'),
  question32: integer('question_3_2'),
  question33: integer('question_3_3'),
  question34: integer('question_3_4'),
  question35: integer('question_3_5'),
  question40: integer('question_4_0'),
  question41: integer('question_4_1'),
  question42: integer('question_4_2'),
  question50: integer('question_5_0'),
  question51: integer('question_5_1'),
  question52: integer('question_5_2'),
  question53: integer('question_5_3'),
  question54: integer('question_5_4'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const selectCidiSurveyResponsesSchema = createSelectSchema(cidiSurveyResponses);
export const insertCidiSurveyResponsesSchema = createInsertSchema(cidiSurveyResponses);

export type CidiSurveyResponses = z.infer<typeof selectCidiSurveyResponsesSchema>;
export type NewCidiSurveyResponses = z.infer<typeof insertCidiSurveyResponsesSchema>
