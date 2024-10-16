import { CurrentStepInfo } from '~myjournai/chat-shared';


export const createStepAnalyzerPromptFactory = (specificCriteriaCreator: (args: {
  currentStep: number,
  messages: string,
  stepRepetitions: number
}) => string) => (messages: string, { currentStep, stepRepetitions }: CurrentStepInfo) => `
<prime-objective>
Assess whether to advance the conversation to the next step based on user interactions, ensuring seamless and accurate management of the conversation flow.
Utilize a designated answer to advance to the next step when criteria to advance are met.
</prime-objective>

<process-outline>
- The AI node continuously monitors user inputs and the context of the ongoing conversation.
- The node must decide after each user interaction whether to:
  1. Proceed to Next Step: Return the keyword ADVANCE to advance the conversation only if all criteria for the current step are sufficiently met.
  2. Stay on Current Step: Return the keyword STAY.
</process-outline>

<step-specific-criteria>
${specificCriteriaCreator({ currentStep, stepRepetitions, messages })}
</step-specific-criteria>

<additional-considerations-of-assessment>
- If there are no messages. Always stay, because we want to start with step 1.
- Use linguistic cues, sentiment analysis, and contextual understanding to assess user responses accurately.
- Each step has a soft limit of roundtrips. As this limit is approached the more likely you are to advance to the next step.
- Maintain flexibility in handling unexpected user inputs or shifts in conversation direction.
- If <current-step-repitions/> is below the limit by the amount of 2 or more, it's less likely all objectives have been met and you are less likely to advance to the next step
- If <current-step-repitions/> is above the limit by the amount of 4 or more, it's likely the AI has been caught in a loop and should be advanced to the next step
</additional-considerations-of-assessment>

<useful-data>
<current-step>
${currentStep}
</current-step>
<current-step-repitions>
${stepRepetitions}
</current-step-repitions>
<current-messages>
${messages}
</current-messages>
</useful-data>

<response-format>
You can only a single sentence concisely laying out your reasoning followed by a new line and a single key word.
Choose from: ADVANCE or STAY
</response-format>`;
