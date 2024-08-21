import { H3Event } from 'h3';
import { useRuntimeConfig } from 'nitropack/runtime';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

export const createLLMProviders = (event: H3Event) => {
  const { openApiKey, anthropicApiKey, groqApiKey } = useRuntimeConfig(event as any);
  const openai = createOpenAI({
    apiKey: openApiKey
  });
  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: groqApiKey
  });
  const anthropic = createAnthropic({ apiKey: anthropicApiKey });
  return {openai, groq, anthropic}
}
