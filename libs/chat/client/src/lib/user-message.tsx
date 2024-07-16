import { Message, MessageProps } from './message';


export const UserMessage = (props: MessageProps) => {
  return <div className="bg-sky-500">
    <Message { ...props } />
  </div>;
};
