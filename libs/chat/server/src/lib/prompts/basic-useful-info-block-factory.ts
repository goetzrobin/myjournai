import { PromptProps } from '../nodes/execute-step-node-factory';

export const basicUsefulInfoBlockFactory = ({ messages, stepRepetitions }: PromptProps) => `
<useful-information>
<step-repetitions-count>
stepRepetitions for current step: ${stepRepetitions}
</step-repetitions-count>

<previous-messages>
${messages}
</previous-messages>
</useful-information>
`
