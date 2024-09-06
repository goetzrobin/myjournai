import { CoreTool, GenerateTextResult } from 'ai';
import { db } from '~db/client';
import { llmInteractions, LLMInteractionScope, NewLLMInteraction } from '~db/schema/llm-interactions';
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
  currentStep?: number;
  stepRepetitions?: number;
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
                                                                                    toolResults,
                                                                                    currentStep,
                                                                                    stepRepetitions
                                                                                  }: StoreLLMInteractionArgs<TOOLS>) => {
  const stringifiedTools = JSON.stringify(tools ?? {});
  const finishedAt = new Date();
  const rawResponseText = JSON.stringify(rawResponse);
  const values: NewLLMInteraction = {
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
    promptTokens: isNaN(usage?.promptTokens) ? undefined : usage?.promptTokens,
    completionTokens: isNaN(usage?.completionTokens) ? undefined : usage?.completionTokens,
    totalTokens: isNaN(usage?.totalTokens) ? undefined : usage?.totalTokens,
    currentStep: !currentStep || isNaN(currentStep) ? undefined : currentStep,
    stepRepetitions: !stepRepetitions || isNaN(stepRepetitions) ? undefined : stepRepetitions,
  };
  console.log('inserting this bad boy', usage);
  await db.insert(llmInteractions).values(values);
  for (const warning of (warnings ?? [])) {
    const index = (warnings ?? []).indexOf(warning);
    await db.insert(llmInteractionWarnings).values({
      llmInteractionId,
      index,
      type: warning.type,
      setting: warning.type === 'unsupported-setting' ? warning.setting : undefined,
      details: warning.type === 'unsupported-setting' ? warning.details : undefined,
      message: warning.type === 'unsupported-setting' ? undefined : warning.message
    });
  }
  for (const toolCall of (toolCalls ?? [])) {
    const index = (toolCalls ?? []).indexOf(toolCall);
    await db.insert(llmInteractionToolCalls).values({
      id: toolCall.toolCallId,
      llmInteractionId,
      index,
      name: toolCall.toolName,
      type: toolCall.type,
      args: JSON.stringify(toolCall.args)
    });
  }
  for (const result of (toolResults ?? [])) {
    const index = (toolResults ?? []).indexOf(result);
    await db.insert(llmInteractionToolCallResults).values({
      id: result.toolCallId,
      llmInteractionId,
      index,
      name: result.toolName,
      type: result.type,
      args: JSON.stringify(result.args),
      result: JSON.stringify(result.result)
    });
  }
  console.log('inserted this bad boy successfully', llmInteractionId);

};
