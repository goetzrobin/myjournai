import { Message, MessageProps } from './message';
import { Button } from '~myjournai/components';


export const UserMessage = (props: MessageProps & {retryAble: boolean; onRetry: () => void}) => {
  return    <div className="relative mb-8 bg-muted/20 text-popover-foreground rounded-xl px-4 pt-2 pb-4 self-end w-4/5 border drop-shadow-lg">
    <Message { ...props } />
      {props.retryAble ? <Button className="absolute -bottom-8 -left-0 px-2 py-1 text-xs" onPress={props.onRetry}>Retry</Button> : null}
    </div>

    ;
};
