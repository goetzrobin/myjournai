import React from 'react';

export const ThinkingIndicator = () => {
  return (
    <div className='my-4 w-fit flex justify-center items-center'>
      <span className='sr-only'>Loading...</span>
      <div className='size-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div className='ml-1 size-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='ml-1 size-2 bg-muted-foreground rounded-full animate-bounce'></div>
    </div>
  );
};
