import { integer, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { llmInteractions } from './llm-interactions';

export const llmInteractionToolCalls = pgTable('llm_interaction_tool_calls', {
  id: uuid('id').defaultRandom().primaryKey(),
  llmInteractionId: uuid('llm_interaction_id').notNull().references(() => llmInteractions.id),
  index: integer('index').default(0),
  type: varchar('type'),
  name: varchar('name'),
  args: text('args')
});

export const selectLLMInteractionToolCallSchema = createSelectSchema(llmInteractionToolCalls);
export const insertLLMInteractionToolCallSchema = createInsertSchema(llmInteractionToolCalls);

export type LLMInteractionToolCalls = z.infer<typeof selectLLMInteractionToolCallSchema>;
export type NewLLMInteractionToolCall = z.infer<typeof insertLLMInteractionToolCallSchema>
