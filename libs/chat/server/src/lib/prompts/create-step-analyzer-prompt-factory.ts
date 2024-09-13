import { CurrentStepInfo } from '../nodes/step-analyzer-node-factory';

export const createStepAnalyzerPromptFactory = (specificCriteriaCreator: (args: {
  currentStep: number,
  messages: string,
  stepRepetitions: number
}) => string) => (messages: string, { currentStep, stepRepetitions }: CurrentStepInfo) => `
Objective: Assess whether to advance the conversation to the next step based on user interactions, ensuring seamless and accurate management of the conversation flow.
Utilize a designated answer to advance to the next step when criteria to advance are met.

Process Overview:
- The AI node continuously monitors user inputs and the context of the ongoing conversation.
- The node must decide after each user interaction whether to:
  1. Proceed to Next Step: Return the keyword ADVANCE to advance the conversation only if all criteria for the current step are sufficiently met.
  2. Stay on Current Step: Return the keyword STAY.

Step-Specific Criteria:
${specificCriteriaCreator({ currentStep, stepRepetitions, messages })}

Implementation Tips:
- If there are no messages. Always stay, because we want to start with step 1.
- Use linguistic cues, sentiment analysis, and contextual understanding to assess user responses accurately.
- Each step has a soft limit of roundtrips. As this limit is approached the more likely you are to advance to the next step.
- Maintain flexibility in handling unexpected user inputs or shifts in conversation direction.
- If the amount of times the step has been repeated is 2 or more below the limit, it's less likely all objectives have been met and you are less likely to advance to the next step

Current Step: ${currentStep}

Amount of times this step has been repeated: ${stepRepetitions}

Current messages:
${messages}

Response format:
You can only a single sentence concisely laying out your reasoning followed by a new line and a single key word. Choose from: ADVANCE or STAY`;
