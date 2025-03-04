import { PromptProps } from '../prompt-props';

export const basicUsefulInfoBlockFactory = ({ messages, stepRepetitions, contextBlock }: PromptProps) => `
<useful-information>
<step-repetitions-count>
stepRepetitions for current step: ${stepRepetitions}
</step-repetitions-count>

<useful-context>
${contextBlock}
</useful-context>

<previous-messages>
${messages}
</previous-messages>
</useful-information>
`
