import { BaseMessage } from '~myjournai/chat-shared';

const defaultSupportedMessages = {
  // 'analyzer': 'Step Analyzer (Internal Thought):',
  // 'execute-step': 'Step Execution (Internal Thought):'
}

export const formatMessages = (messages: BaseMessage[], prefixByType: { [key: string]: string } = {}) => messages.map(m => {
    let formattedMessage = '';
    const messageType = m.type;
    Object.entries({ ...defaultSupportedMessages, ...prefixByType}).forEach(([type, prefix]) => {
      if (messageType === type) {
        formattedMessage = `${prefix} ${m.content}`;
      }
    });
    if (formattedMessage.length > 0) return formattedMessage;
    if (messageType === 'ai-message') {
      formattedMessage = `AI Mentor: ${m.content}`;
    }
    if (messageType === 'user-message') {
      formattedMessage = `User: ${m.content}`;
    }
    return formattedMessage;
  }
).join('\n');
