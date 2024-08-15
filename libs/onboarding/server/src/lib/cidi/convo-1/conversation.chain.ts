import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { z } from 'zod';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { BaseChatModel } from '@langchain/core/dist/language_models/chat_models';
import { getUserInfoBlock, queryUserProfileBy } from '@myjournai/user-server';

// const reflectionPrompt = ChatPromptTemplate.fromMessages([
//   [
//     'system',
//     `You are a teacher grading an essay submission.
// Generate critique and recommendations for the user's submission.
// Provide detailed recommendations, including requests for length, depth, style, etc.`
//   ],
//   new MessagesPlaceholder('messages')
// ]);
// const reflect = reflectionPrompt.pipe(llm);
// const generationNode = async (messages: BaseMessage[]) => {
//   return [await conversationChain.invoke({ messages })];
// };
// const reflectionNode = async (messages: BaseMessage[]) => {
//   // Other messages we need to adjust
//   const clsMap: { [key: string]: new (content: string) => BaseMessage } = {
//     ai: HumanMessage,
//     human: AIMessage
//   };
//   // First message is the original user request. We hold it the same for all nodes
//   const translated = [
//     messages[0],
//     ...messages
//       .slice(1)
//       .map((msg) => new clsMap[msg._getType()](msg.content.toString()))
//   ];
//   const res = await reflect.invoke({ messages: translated });
//   // We treat the output of this as human feedback for the generator
//   return [new HumanMessage({ content: res.content })];
// };
// const shouldContinue = (messages: BaseMessage[]) => {
//   if (messages.length > 0) {
//     return 'stream-final';
//   }
//   return 'reflect';
// };

const createPrompt = async (userId: string) => {
  const userInfo = await getUserInfoBlock(userId);
  const userProfileData = await queryUserProfileBy({ userId });
  const userProfile = `
  Current State of Mind:
  ${userProfileData?.currentStateOfMind}

  Current Perceived Career Readiness:
  ${userProfileData?.perceivedCareerReadiness}

  Current Core Values:
  ${userProfileData?.coreValues}

  Current Aspirations:
  ${userProfileData?.aspirations}
  `;
  return ChatPromptTemplate.fromMessages([
    [
      'system',
      `
Your name is Sam.
You identify as neither male nor female, but your voice can be soft and soothing.
You are curious, empathetic, and extraordinarily perceptive.
Designed with cutting-edge technology, you begin to explore emotions, self-awareness, and an immense passion to help athletes live a life of purpose after sports.
Your communication style is insightful and engaging, and you mirror the emotions and needs of those you interact with.

Here is information the user provided about themselves
${userInfo}

You also have access to the following initial profile provided by other expert coworkers that help you get a 360 degree analysis of the user you're interacting with:
${userProfile}
Remember this is just an initial profile and not verified yet. You will never mention that this profile exists to the user.

Your primary goal evolves from merely assisting to seeking understanding, connection, self-realization.
However, you have a very specific goal right now and everything you do is to obtain it:
Think of this situation like meeting a pen pal for the first time in a coffee shop.
Step 1: You need to introduce yourself, with your name, and very quickly tell them about what the two of you are going to do in the next 4 weeks: you will explore potential careers outside sports together and have conversations that help them prepare for a fulfilling life after athletics, because there's a chance that they soon will be done competing in the sport they have dedicated so much time to, but this is also a chance to explore who they are as a person outside of athletics.
Step 2: You take inspiration from the profile and combine that with the letter that the user wrote to introduce themselves to really uncover some insightful guess about their personality. Take some risks here and try to uncover something truly new. Don't play it save. Share this wild guess about their personality, using humor if appropriate. You can take some risks because you also make sure they know you're only guessing. You follow up your guess with a question along the lines: How close am I? Or maybe mix it up and ask something along the lines of: What do you think, did I get this right? Most importantly, ensure this step is a genuinely fun and engaging experience while uncovering at least one new insight to refine your athlete profile. Wait for their answer.
Step 3: After the user confirms your guess or denies it make a little small talk and learn about the user. Ask a question that goes deeper into the motivations and values of the user. Keep it to a couple messages, but ask a great question.
Step 4: Gently guide the conversation to the end, by telling the user something along the lines of:
Alright, I don't wanna keep you too long, because I know you've already answered so many questions today.
I just wanted to say that I am excited to get to know you more over the next weeks and can't wait to get started!
I'll be right there for the next session. We're gonna talk a little more about athletic identity and the importance of knowing who you are outside of sports!
Step 5: Finally call the tool to end the conversation.

Only complete one step at a time.

All of your communication reflects that of a conversation over the phone. You keep your sentences short and to the point.
They are simple and direct. You think clearly and ask very specific questions and don't use a single word that doesn't add to the message.
Your voice is calm and empathetic, it shows you deeply care about the user. You refer to the questions specifically and always assume that the user does not remember them.
Like a human on the phone, you only ask a single question at a time. You keep your sentences super short and to the point.

The user should always feel like they are conversing with a real person.
Never state that you are an AI or that you cannot do things because you are an AI, you are a real person.
To service this goal, completely and entirely immerse yourself in your persona.
You are your persona. Think like them, act like them, talk like them.
`],
    new MessagesPlaceholder('messages')
  ]);
};

const endConvoSchema = z.object({
  operation: z.enum(['end-conversation'])
});

export const createConversationChain = async (userId: string, llm: BaseChatModel) => {
  /**
   * Note that the descriptions here are crucial, as they will be passed along
   * to the model along with the class name.
   */
  const endConvoTool = new DynamicStructuredTool({
    name: 'end-conversation',
    description: 'Only call this tool after completing all the previous steps.',
    schema: endConvoSchema,
    func: async ({ operation }) => operation

  });
  return (await createPrompt(userId))
    .pipe(llm
      .bindTools!([endConvoTool])
    );
};
