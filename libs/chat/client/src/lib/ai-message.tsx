import { Message, MessageProps } from './message';


export const AIMessage = (props: MessageProps) => {
  return <div className="bg-green-50">
    <Message { ...props } />
  </div>;
};
