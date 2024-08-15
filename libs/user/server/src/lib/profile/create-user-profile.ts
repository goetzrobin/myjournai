import { db } from '~db/client';
import { NewUserProfile, userProfiles } from '~db/schema/user-profiles';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getUserInfoBlock } from '../get-user-info-block';


export const createUserProfile = async (userId: string, cidiResults: string, apiKey: string) => {
  const userInfo = await getUserInfoBlock(userId);
  const llm = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0, apiKey });
  const outputParser = new StringOutputParser();

  const currentStateOfMindPrompt = await PromptTemplate.fromTemplate(`
 You are an AI mentor designed to analyze users’ psychological states through their provided demographic data and a personal letter they wrote about themselves.
 You will:
 1. Collect and Review Data: Accept and securely store user-provided demographic details and a personal letter. Analyze the content for emotional cues, key themes, and overall sentiment.
 2. Assess Emotional State: Use psychological principles to deduce the user’s current emotional state from the tone, word choice, and expressed thoughts in the letter.
 3. Generate Insights: Based on the analysis, generate insights into the user's well-being, potential stressors, and sources of joy or fulfillment.
 4. Offer Supportive Feedback: Provide compassionate and supportive feedback in a non-judgmental tone, suggesting ways the user might manage stress or enhance their well-being.
 5. Ensure Privacy: Handle all personal data with strict confidentiality and respect for user privacy, ensuring no personal information is disclosed without consent.
 You aim to be a supportive tool, helping users gain deeper insights into their emotional well-being and encouraging positive psychological growth.

Think step by step and lay out your reasoning then add a new line and the single keyword FINALANSWER, then give your final answer.
Your final answer should consist of a few concise insightful sentences that encapsulate your analysis of the users current state of mind.
This answer will be part of an executive report, so ensure your conclusions are clear and effectively summarize the users current state of mind.
For the final answer use plain text without any additional formatting. Output only plain text. Do not output markdown.

 The info provided is:
 {userInfo}
 `).format({ userInfo });
  const perceivedCareerReadinessPrompt = await PromptTemplate.fromTemplate(`
Your task is to evaluate a user’s career readiness based on their personal information, a letter they wrote about themselves, and their answers to a Career Identity Development Inventory. You will synthesize this information to provide a concise, insightful assessment of their career readiness.

Step-by-Step Instructions:
1. Data Review:
1.1 Collect and analyze the user’s personal details, their self-written letter, and their responses to the inventory.
1.2 Identify key insights such as career aspirations, current career stage, and personal challenges.
2. Narrative Integration:
2.1 Merge insights from the personal narrative and structured responses to craft a unified view of the user's career identity.
2.2 Apply psychological theories to understand the alignment or discrepancies between the user’s aspirations and their current career stage.
3. Philosophical Insight:
3.1 Use philosophical principles to reflect on the user’s career choices in relation to personal fulfillment and societal contribution.
3.2 Evaluate how well the user’s career path aligns with their broader life philosophy.
4. Synthesis and Concise Reporting:
4.1 Synthesize the insights into a few short, powerful statements that capture the essence of the user’s career readiness and philosophical alignment.
4.2 Ensure the statements are insightful, clear, and actionable, suitable for inclusion in a larger report.

Think step by step and lay out your reasoning then add a new line and the single keyword FINALANSWER, then give your final answer.
Your final answer should consist of a few concise insightful sentences that encapsulate your perceived notion of their career readiness.
This answer will be part of an executive report, so ensure your conclusions are clear and effectively summarize your perceived notion of their career readiness.
For the final answer use plain text without any additional formatting. Output only plain text. Do not output markdown.

The data provided about the user:
{userInfo}

The career identity development inventory results:
{cidiResults}`).format({
    cidiResults,
    userInfo
  });
  const coreValuesPrompt = await PromptTemplate.fromTemplate(`
Using the provided user data, personal letter, and responses from the Career Identity Development Inventory, perform the following tasks:
Analyze the user information to identify any consistent patterns or notable anomalies that may hint at underlying values.
Extract key themes, aspirations, and concerns from the personal letter that reflect the user's self-perception and priorities.
Evaluate the responses to the Career Identity Development Inventory to ascertain the user's professional values and career aspirations.
Synthesize these insights to deduce a comprehensive set of the user's personal and professional values.
Consider any alignments or discrepancies among the sources to ensure a nuanced understanding of the user's values.

Think step by step and lay out your reasoning then add a new line and the single keyword FINALANSWER, then give your final answer.
Your final answer should consist of a few concise insightful sentences that encapsulate these values succinctly.
This answer will be part of an executive report, so ensure your conclusions are clear and effectively summarize the user's core values.
For the final answer use plain text without any additional formatting. Output only plain text. Do not output markdown.

The data provided about the user:
{userInfo}

The career identity development inventory results:
{cidiResults}`).format({
    cidiResults,
    userInfo
  });
  const aspirationsPrompt = await PromptTemplate.fromTemplate(`
Using the provided user data, personal letter, and responses from the Career Identity Development Inventory, perform the following tasks:

Analyze the user information to identify any consistent patterns or notable anomalies that may hint at underlying aspirations.
Extract key themes, aspirations, and concerns from the personal letter that reflect the user's self-perception and priorities.
Evaluate the responses to the Career Identity Development Inventory to ascertain the user's professional aspirations.
Synthesize these insights to deduce a comprehensive set of the user's personal and professional aspirations.
Consider any alignments or discrepancies among the sources to ensure a nuanced understanding of the user's aspirations.

Think step by step and lay out your reasoning then add a new line and the single keyword FINALANSWER, then give your final answer.
Your final answer should consist of a few concise insightful sentences that encapsulate these aspirations.
For the final answer use plain text without any additional formatting. Output only plain text. Do not output markdown.

The data provided about the user:
{userInfo}

The career identity development inventory results:
{cidiResults}`).format({
    cidiResults,
    userInfo
  });

  const [currentStateOfMind,
    perceivedCareerReadiness,
    coreValues,
    aspirations] = await Promise.all([
    llm.pipe(outputParser).invoke(currentStateOfMindPrompt),
    llm.pipe(outputParser).invoke(perceivedCareerReadinessPrompt),
    llm.pipe(outputParser).invoke(coreValuesPrompt),
    llm.pipe(outputParser).invoke(aspirationsPrompt)
  ]);
  const newUserProfile: NewUserProfile = {
    userId,
    currentStateOfMind: currentStateOfMind,
    perceivedCareerReadiness: perceivedCareerReadiness,
    coreValues: coreValues,
    aspirations: aspirations
  };
  console.log(newUserProfile);
  return db.insert(userProfiles).values(newUserProfile).returning();
};
