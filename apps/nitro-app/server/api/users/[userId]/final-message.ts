import {
  createFinalMessageAugmentationPrompt,
  createLLMProviders,
  personaAndCommunicationStyleBlock
} from '~myjournai/chat-server';
import { generateText } from 'ai';
import { queryUserInfoBlock, queryUserProfileBlock } from '~myjournai/user-server';
import { kv } from '@vercel/kv';

export default defineEventHandler(async (event) => {
  const { groq, anthropic } = createLLMProviders(event);
  const userId = getRouterParam(event, 'userId');
  const currentUserFinalMessageKey = `${userId}-final-message-v0`;

  const [userProfileBlock, userInfoBlock] = await Promise.all([
    queryUserProfileBlock(userId),
    queryUserInfoBlock(userId)
  ]);

  const finalMessage = await kv.get(currentUserFinalMessageKey) as string | undefined | null;

  console.log(finalMessage)
  if (finalMessage && finalMessage.length > 0) {
    return {
      finalMessage
    };
  }

  const result = await generateText({
    model: groq('llama-3.1-70b-versatile'),
    prompt: `
    Your final task as a mentor is to write the user with a inspiring but very concise note with a farewell that
    includes a few sentence summary of what you learned about them, what you admire most about them, and what you wish for them as a mentor
    as they end the experiment:
    ${userProfileBlock}

    And these personal infos
    ${userInfoBlock}

    Response format is a quick personal note that's no longer than a few engaging paragraphs in markdown with the following voice:
    ${personaAndCommunicationStyleBlock}
    `
  });

  const finalResult = await generateText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    prompt: createFinalMessageAugmentationPrompt(``, result.text, userProfileBlock, userInfoBlock, `This is actually a final note you leave to your mentee. Keep it concise and heartfelt and authentic and end with something along the lines of: I'll always be cheering for you, Sam`)
  });

  await kv.set(currentUserFinalMessageKey, finalResult.text);

  return {
    finalMessage: finalResult.text
  };
});
