import { Message, MessageProps } from './message';


export const AIMessage = (props: MessageProps) => {
  return <div className="pb-8 w-11/12">
    <Message { ...props } />
  </div>;
};
