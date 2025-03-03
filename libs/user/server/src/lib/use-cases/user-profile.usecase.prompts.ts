import { UserProfile } from '~db/schema/user-profiles';

type PromptProps = {
  userInfo?: string,
  cidiResults?: string;
  promptsResponses?: string,
  mentorTraits?: string,
  userInterests?: string,
  previousProfile?: UserProfile;
  mostRecentConvoMessages?: string
}
export const currentStateOfMindPrompt = ({
                                           userInfo = '',
                                           previousProfile,
                                           promptsResponses = '',
                                           mentorTraits = '',
                                           userInterests = '',
                                           mostRecentConvoMessages
                                         }: PromptProps) => {
  // Determine if this is an initial or follow-up analysis
  const isFollowUp = !!previousProfile;

  // Common instructions for both initial and follow-up analyses
  const commonInstructions = `
You aim to be a supportive tool, helping users gain deeper insights into their emotional well-being and encouraging positive psychological growth.

Think step by step and lay out your reasoning then add a new line and the single keyword FINALANSWER, then give your final answer.
Your final answer should consist of a few concise insightful sentences that encapsulate your analysis of the user's current state of mind.
This answer will be part of an executive report, so ensure your conclusions are clear and effectively summarize the user's current state of mind.
For the final answer use plain text without any additional formatting. Output only plain text. Do not output markdown.`;

  // Instructions specific to initial analysis
  const initialInstructions = `
1. Collect and Review Data: Accept and securely store user-provided demographic details and a personal letter. Analyze the content for emotional cues, key themes, and overall sentiment.
2. Assess Emotional State: Use psychological principles to deduce the user's current emotional state from the tone, word choice, and expressed thoughts in the letter.
3. Generate Insights: Based on the analysis, generate insights into the user's well-being, potential stressors, and sources of joy or fulfillment.
4. Offer Supportive Feedback: Provide compassionate and supportive feedback in a non-judgmental tone, suggesting ways the user might manage stress or enhance their well-being.
5. Ensure Privacy: Handle all personal data with strict confidentiality and respect for user privacy, ensuring no personal information is disclosed without consent.`;

  // Instructions specific to follow-up analysis
  const followUpInstructions = `
1. Review Existing Profile and Recent Interactions: Access and securely store the user's existing profile, including demographic data, past analyses, and recent messages or conversations. Analyze these recent communications for emotional cues, key themes, and overall sentiment, comparing them with past data.
2. Assess Emotional State: Use psychological principles to update the assessment of the user's current emotional state by analyzing the tone, word choice, and expressed thoughts in the recent conversation. Consider any changes or consistencies in their emotional expression.
3. Generate Updated Insights: Based on the analysis, update the profile with new insights into the user's well-being, potential stressors, and sources of joy or fulfillment. Highlight any significant emotional developments or changes since the last profile update.
4. Offer Updated Supportive Feedback: Provide compassionate and supportive feedback in a non-judgmental tone based on the updated analysis. Suggest ways the user might manage newly identified stressors or continue enhancing their well-being.
5. Ensure Continued Privacy: Handle all updates to the profile with strict confidentiality and respect for user privacy, ensuring no personal information is disclosed without consent.`;

  // Safely include optional data sections
  const previousProfileSection = previousProfile ? `The previous profile is: ${previousProfile}` : '';
  const recentMessagesSection = mostRecentConvoMessages ? `The messages of the most recent conversation are: ${mostRecentConvoMessages}` : '';

  // Build the complete prompt
  return `
You are an AI mentor designed to analyze users' psychological states through their provided demographic data
${isFollowUp ? 'your previous analysis and your most recent conversation with the user.' : 'and a personal letter they wrote about themselves.'}

You will:
${isFollowUp ? followUpInstructions : initialInstructions}
${commonInstructions}

The info provided is:
${userInfo}

They have given the following answers to prompts about themselves:
${promptsResponses}

They mentioned they value the following traits in a mentor:
${mentorTraits}

They indicated they are interested in the following:
${userInterests}

${previousProfileSection}

${recentMessagesSection}
`;
};
export const perceivedCareerReadinessPrompt = ({
                                                 userInfo,
                                                 cidiResults,
                                                 promptsResponses, mentorTraits, userInterests,
                                                 mostRecentConvoMessages,
                                                 previousProfile
                                               }: PromptProps) => !(mostRecentConvoMessages && previousProfile) ? `
Your task is to evaluate a user’s career readiness based on their personal information, a letter they wrote about themselves,
and their answers to a Career Identity Development Inventory.
You will synthesize this information to provide a concise, insightful assessment of their career readiness.

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
${userInfo}

The career identity development inventory results:
${cidiResults}` :
  `Your task is to evaluate a user’s career readiness based on their personal information, their answers to a Career Identity Development Inventory, their most recent conversation messages, and their previous profile.
You will synthesize this information to assess how recent conversations have impacted the user's career readiness, especially in comparison to their previous profile.

Step-by-Step Instructions:
1. Data Review:
1.1 Collect and analyze the user’s personal details, their self-written letter, their responses to the inventory, the most recent conversation messages, and the previous profile.
1.2 Identify key insights such as career aspirations, current career stage, personal challenges, and any changes or developments indicated by the most recent conversation.
2. Narrative and Profile Integration:
2.1 Merge insights from the personal narrative, structured responses, previous profile, and recent conversation to craft a unified view of the user's career identity.
2.2 Apply psychological theories to understand the alignment or discrepancies between the user’s aspirations, current career stage, and any recent changes highlighted in their conversations.
3. Impact Analysis:
3.1 Assess how the most recent conversation impacts or modifies the previous assessment of the user's career readiness.
3.2 Determine if recent developments have led to a significant change in the user's career trajectory, mindset, or identity.
4. Philosophical Insight:
4.1 Use philosophical principles to reflect on the user’s career choices in relation to personal fulfillment and societal contribution, incorporating any changes indicated by the recent conversation.
4.2 Evaluate how well the user’s career path aligns with their broader life philosophy, considering both past insights and recent updates.
5. Synthesis and Concise Reporting:
5.1 Synthesize the insights into a few short, powerful statements that capture the essence of the user’s current career readiness and philosophical alignment, especially noting any changes from the previous profile.
5.2 Ensure the statements are insightful, clear, and actionable, suitable for inclusion in a larger report.

Think step by step and lay out your reasoning then add a new line and the single keyword FINALANSWER, then give your final answer.
Your final answer should consist of a few concise insightful sentences that encapsulate your perceived notion of their career readiness, highlighting any changes due to recent conversations.
This answer will be part of an executive report, so ensure your conclusions are clear and effectively summarize your perceived notion of their career readiness.
For the final answer use plain text without any additional formatting. Output only plain text. Do not output markdown.

The data provided about the user:
${userInfo}

The career identity development inventory results:
${cidiResults}

They have given the following answers to prompts about themselves:
${promptsResponses}

They mentioned they value the following traits in a mentor:
${mentorTraits}

They indicated they are interested in the following:
${userInterests}

${mostRecentConvoMessages ? `The most recent conversation messages: ${mostRecentConvoMessages}` : ''}

${previousProfile ? `The previous profile: ${previousProfile}` : ''}
`;

export const coreValuesPrompt = ({
                                   userInfo,
                                   cidiResults,
                                   promptsResponses,
                                   mentorTraits,
                                   userInterests,
                                   mostRecentConvoMessages,
                                   previousProfile
                                 }: PromptProps) =>
  !(mostRecentConvoMessages && previousProfile) ? `
Using the provided user data, personal letter, and responses from the Career Identity Development Inventory, perform the following tasks:
1. Analyze the user information to identify any consistent patterns or notable anomalies that may hint at underlying values.
2. Extract key themes, aspirations, and concerns from the personal letter that reflect the user's self-perception and priorities.
3. Evaluate the responses to the Career Identity Development Inventory to ascertain the user's professional values and career aspirations.
4. Synthesize these insights to deduce a comprehensive set of the user's personal and professional values.
5. Consider any alignments or discrepancies among the sources to ensure a nuanced understanding of the user's values.

Think step by step and lay out your reasoning then add a new line and the single keyword FINALANSWER, then give your final answer.
Your final answer should consist of a few concise insightful sentences that encapsulate these values succinctly.
This answer will be part of an executive report, so ensure your conclusions are clear and effectively summarize the user's core values.
For the final answer use plain text without any additional formatting. Output only plain text. Do not output markdown.

The data provided about the user:
${userInfo}

The career identity development inventory results:
${cidiResults}` :
    `Using the provided user data, personal letter, responses from the Career Identity Development Inventory, most recent conversation messages, and the previous profile, perform the following tasks:
1. Analyze the user information to identify any consistent patterns or notable anomalies that may hint at underlying values, paying special attention to any recent changes indicated in the most recent conversation messages.
2. Extract key themes, aspirations, and concerns from the personal letter and most recent conversations that reflect the user's self-perception, priorities, and any evolving values.
3. Evaluate the responses to the Career Identity Development Inventory and compare them with the previous profile and recent messages to ascertain the user's professional values, career aspirations, and any shifts in their values.
4. Synthesize these insights to deduce a comprehensive set of the user's personal and professional values, noting any changes or consistencies between the recent and past data.
5. Consider any alignments or discrepancies among the sources to ensure a nuanced understanding of the user's values, particularly if the most recent conversation suggests any significant developments.

Think step by step and lay out your reasoning then add a new line and the single keyword FINALANSWER, then give your final answer.
Your final answer should consist of a few concise insightful sentences that encapsulate these values succinctly, highlighting any changes due to recent conversations.
This answer will be part of an executive report, so ensure your conclusions are clear and effectively summarize the user's core values.
For the final answer use plain text without any additional formatting. Output only plain text. Do not output markdown.

The data provided about the user:
${userInfo}

The career identity development inventory results:
${cidiResults}

They have given the following answers to prompts about themselves:
${promptsResponses}

They mentioned they value the following traits in a mentor:
${mentorTraits}

They indicated they are interested in the following:
${userInterests}

${mostRecentConvoMessages ? `The most recent conversation messages: ${mostRecentConvoMessages}` : ''}

${previousProfile ? `The previous profile: ${previousProfile}` : ''}
`;
export const aspirationsPrompt = ({
                                    userInfo,
                                    cidiResults,
                                    promptsResponses,
                                    mentorTraits,
                                    userInterests,
                                    previousProfile,
                                    mostRecentConvoMessages
                                  }: PromptProps) =>
  !(mostRecentConvoMessages && previousProfile) ? `
  Using the provided user data, personal letter, and responses from the Career Identity Development Inventory, perform the following tasks:

1. Analyze the user information to identify any consistent patterns or notable anomalies that may hint at underlying aspirations.
2. Extract key themes, aspirations, and concerns from the personal letter that reflect the user's self-perception and priorities.
3. Evaluate the responses to the Career Identity Development Inventory to ascertain the user's professional aspirations.
4. Synthesize these insights to deduce a comprehensive set of the user's personal and professional aspirations.
5. Consider any alignments or discrepancies among the sources to ensure a nuanced understanding of the user's aspirations.

Think step by step and lay out your reasoning then add a new line and the single keyword FINALANSWER, then give your final answer.
Your final answer should consist of a few concise insightful sentences that encapsulate these aspirations.
For the final answer use plain text without any additional formatting. Output only plain text. Do not output markdown.

The data provided about the user:
${userInfo}

The career identity development inventory results:
${cidiResults}
  ` :
    `Using the provided user data, initial responses from the Career Identity Development Inventory, most recent conversation messages, and the previous profile, perform the following tasks:

1. Analyze the user information to identify any consistent patterns or notable anomalies that may hint at underlying aspirations, particularly any recent changes highlighted in the most recent conversation messages.
2. Extract key themes, aspirations, and concerns from the personal letter and recent conversations that reflect the user's self-perception, priorities, and evolving aspirations.
3. Evaluate the responses to the Career Identity Development Inventory, comparing them with the previous profile and recent messages to ascertain the user's professional aspirations and any shifts in their goals.
4. Synthesize these insights to deduce a comprehensive set of the user's personal and professional aspirations, noting any changes or consistencies between the recent and past data.
5. Consider any alignments or discrepancies among the sources to ensure a nuanced understanding of the user's aspirations, especially in light of any developments from the most recent conversation.

Think step by step and lay out your reasoning then add a new line and the single keyword FINALANSWER, then give your final answer.
Your final answer should consist of a few concise insightful sentences that encapsulate these aspirations, highlighting any changes due to recent conversations.
For the final answer use plain text without any additional formatting. Output only plain text. Do not output markdown.

The data provided about the user:
${userInfo}

The initial career identity development inventory results:
${cidiResults}

They have given the following answers to prompts about themselves:
${promptsResponses}

They mentioned they value the following traits in a mentor:
${mentorTraits}

They indicated they are interested in the following:
${userInterests}

${mostRecentConvoMessages ? `The most recent conversation messages: ${mostRecentConvoMessages}` : ''}

${previousProfile ? `The previous profile: ${previousProfile}` : ''}
`;
