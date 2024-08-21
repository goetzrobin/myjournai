export const createStepAnalyzerPromptFactory = (specificCriteriaCreator: (args: {
  currentStep: number,
  messages: string
}) => string) => (messages: string, currentStep: number) => `
Objective: Assess whether to advance the conversation to the next step based on user interactions, ensuring seamless and accurate management of the conversation flow. Utilize the designated tool to increment the current step when criteria to advance are met.

Process Overview:
- The AI node continuously monitors user inputs and the context of the ongoing conversation.
- The node must decide after each user interaction whether to:
  1. Proceed to Next Step: Call the step increment tool to advance the conversation if all criteria for the current step are sufficiently met and return the keyword advance.
  2. Stay on Current Step: Return the keyword stay.

Step-Specific Criteria:
${specificCriteriaCreator({ currentStep, messages })}

Implementation Tips:
- Use linguistic cues, sentiment analysis, and contextual understanding to assess user responses accurately.
- Maintain flexibility in handling unexpected user inputs or shifts in conversation direction.

Current Step: ${currentStep}

Current messages:
${messages}

Response format:
You can only return a single word. Choose from: continue or stay`;
