import { MemoizedReactMarkdown } from './markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { CodeBlock } from './code-block';
import { twMerge } from 'tailwind-merge';

export type MessageProps = { className?: string; maKey?: string; content: string }

export const Message = (props: MessageProps) => {
  return (
    <MemoizedReactMarkdown
      className={twMerge('prose-base break-words prose-p:leading-relaxed prose-pre:p-0', props.content)}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        code({ node, className, children, ...props }) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          if (children.length) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (children[0] == '▍') {
              return (
                <span className="mt-1 cursor-default animate-pulse">▍</span>
              );
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            children[0] = (children[0] as string).replace('`▍`', '▍');
          }

          const match = /language-(\w+)/.exec(className || '');

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          return (
            <CodeBlock
              key={Math.random()}
              language={(match && match[1]) || ''}
              value={String(children).replace(/\n$/, '')}
              {...props}
            />
          );
        }
      }}
    >
      {props.content}
    </MemoizedReactMarkdown>
  );
};
