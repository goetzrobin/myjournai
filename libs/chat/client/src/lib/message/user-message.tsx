import { Message, MessageProps } from './message';


export const UserMessage = (props: MessageProps) => {
  return <div className="mb-8 bg-muted/20 text-popover-foreground rounded-xl px-4 pt-2 pb-4 self-end w-4/5 border drop-shadow-lg">
    <Message { ...props } />
  </div>;
};
