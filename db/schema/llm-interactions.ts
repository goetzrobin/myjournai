import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';
import { messageRuns } from './message-runs';

export const llmInteractionFinishReason = pgEnum('llm_interaction_finish_reason', ['stop', 'length', 'content-filter', 'tool-calls', 'error', 'other', 'unknown']);
export const llmInteractionScope = pgEnum('llm_interaction_scope', ['internal', 'external']);

export const llmInteractions = pgTable('llm_interactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  messageRunId: uuid('message_run_id').references(() => messageRuns.id),
  type: varchar('type'),
  scope: llmInteractionScope('scope'),
  model: varchar('model'),
  prompt: text('prompt'),
  tools: text('tools'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
  finishReason: llmInteractionFinishReason('finish_reason'),
  generatedText: text('generated_text'),
  rawResponseText: text('raw_response'),
  promptTokens: integer('prompt_tokens'),
  completionTokens: integer('completion_tokens'),
  totalTokens: integer('total_tokens')
});

export const llmInteractionFinishReasonEnumSchema = z.enum(llmInteractionFinishReason.enumValues);
export const llmInteractionScopeEnumSchema = z.enum(llmInteractionScope.enumValues);
export const selectLLMInteractionSchema = createSelectSchema(llmInteractions);
export const insertLLMInteractionSchema = createInsertSchema(llmInteractions);

export type LLMInteractionFinishReason = z.infer<typeof llmInteractionFinishReasonEnumSchema>;
export type LLMInteractionScope = z.infer<typeof llmInteractionScopeEnumSchema>;
export type LLMInteraction = z.infer<typeof selectLLMInteractionSchema>;
export type NewLLMInteraction = z.infer<typeof insertLLMInteractionSchema>
