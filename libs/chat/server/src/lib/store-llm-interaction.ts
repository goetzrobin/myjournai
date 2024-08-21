import { CoreTool, GenerateTextResult } from 'ai';
import { db } from '~db/client';
import { llmInteractions, LLMInteractionScope } from '~db/schema/llm-interactions';
import { llmInteractionWarnings } from '~db/schema/llm-interaction-warnings';
import { llmInteractionToolCalls } from '~db/schema/llm-interaction-tool-calls';
import { llmInteractionToolCallResults } from '~db/schema/llm-interaction-tool-call-results';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type StoreLLMInteractionArgs<TOOLS extends Record<string, CoreTool>> = Optional<Omit<GenerateTextResult<TOOLS> & {
  llmInteractionId: string;
  userId: string;
  runId: string;
  type: string;
  scope: LLMInteractionScope;
  model: string;
  createdAt: Date;
  prompt: string;
  tools?: TOOLS;
}, 'responseMessages' | 'roundtrips' | 'logprobs'>, 'toolCalls' | 'toolResults' | 'warnings'>;

export const storeLlmInteraction = async <TOOLS extends Record<string, CoreTool>>({
                                                                                    createdAt,
                                                                                    finishReason,
                                                                                    text,
                                                                                    rawResponse,
                                                                                    llmInteractionId,
                                                                                    userId,
                                                                                    runId,
                                                                                    model,
                                                                                    scope,
                                                                                    type,
                                                                                    usage,
                                                                                    prompt,
                                                                                    tools,
                                                                                    warnings,
                                                                                    toolCalls,
                                                                                    toolResults
                                                                                  }: StoreLLMInteractionArgs<TOOLS>) => {
  const stringifiedTools = JSON.stringify(tools ?? {});
  const finishedAt = new Date();
  const rawResponseText = JSON.stringify(rawResponse);
  console.log('inserting this bad boy', llmInteractionId)
  await db.insert(llmInteractions).values({
    id: llmInteractionId,
    userId,
    messageRunId: runId,
    type,
    scope,
    model,
    prompt,
    tools: stringifiedTools,
    createdAt,
    finishedAt,
    finishReason,
    generatedText: text,
    rawResponseText,
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    totalTokens: usage.totalTokens
  });
  (warnings ?? []).forEach((warning, index) => db.insert(llmInteractionWarnings).values({
    llmInteractionId,
    index,
    type: warning.type,
    setting: warning.type === 'unsupported-setting' ? warning.setting : undefined,
    details: warning.type === 'unsupported-setting' ? warning.details : undefined,
    message: warning.type === 'unsupported-setting' ? undefined : warning.message
  }));
  (toolCalls ?? []).forEach((toolCall, index) => db.insert(llmInteractionToolCalls).values({
    id: toolCall.toolCallId,
    llmInteractionId,
    index,
    name: toolCall.toolName,
    type: toolCall.type,
    args: JSON.stringify(toolCall.args)
  }));
  (toolResults ?? []).forEach((result, index) => db.insert(llmInteractionToolCallResults).values({
    id: result.toolCallId,
    llmInteractionId,
    index,
    name: result.toolName,
    type: result.type,
    args: JSON.stringify(result.args),
    result: JSON.stringify(result.result)
  }));
  console.log('inserted this bad boy successfully', llmInteractionId)

};
