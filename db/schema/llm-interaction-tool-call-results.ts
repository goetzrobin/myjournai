import { integer, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { llmInteractions } from './llm-interactions';

export const llmInteractionToolCallResults = pgTable('llm_interaction_tool_calls', {
  id: uuid('id').defaultRandom().primaryKey(),
  llmInteractionId: uuid('llm_interaction_id').notNull().references(() => llmInteractions.id),
  index: integer('index').default(0),
  name: varchar('name'),
  args: text('args'),
  result: text('result'),
});

export const selectLLMInteractionToolCallResultSchema = createSelectSchema(llmInteractionToolCallResults);
export const insertLLMInteractionToolCallResultSchema = createInsertSchema(llmInteractionToolCallResults);

export type LLMInteractionToolCallResult = z.infer<typeof selectLLMInteractionToolCallResultSchema>;
export type NewLLMInteractionToolCallResult = z.infer<typeof insertLLMInteractionToolCallResultSchema>
