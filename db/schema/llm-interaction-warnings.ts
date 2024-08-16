import { integer, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { llmInteractions } from './llm-interactions';

export const llmInteractionWarnings = pgTable('llm_interaction_warnings', {
  id: uuid('id').defaultRandom().primaryKey(),
  llmInteractionId: uuid('llm_interaction_id').notNull().references(() => llmInteractions.id),
  index: integer('index').default(0),
  type: varchar('type'),
  setting: varchar('setting'),
  details: text('details'),
  message: text('message')
});

export const selectLLMInteractionWarningSchema = createSelectSchema(llmInteractionWarnings);
export const insertLLMInteractionWarningSchema = createInsertSchema(llmInteractionWarnings);

export type LLMInteractionWarning = z.infer<typeof selectLLMInteractionWarningSchema>;
export type NewLLMInteractionWarning = z.infer<typeof insertLLMInteractionWarningSchema>
