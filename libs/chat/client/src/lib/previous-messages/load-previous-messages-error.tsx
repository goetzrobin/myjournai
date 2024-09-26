import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '~myjournai/components';
import React from 'react';

export const LoadPreviousMessagesError = ({ error, refetchMessages }: {
  error: { message: string } | null;
  refetchMessages: () => void
}) => {
  return <div className="h-full w-full flex flex-col items-center justify-center">
    <AlertCircle className="mb-2 w-8 h-8 text-destructive mx-auto" />
    <h1 className="mb-4 font-bold">Oops! Something went wrong</h1>
    <p className="mb-6 px-4 max-w-sm text-xs text-muted-foreground">
      {error?.message ?? 'We\'re sorry, but it seems there was an error loading your messages. Please try again or reach out to us if the issue persists.'}
    </p>
    <Button onPress={() => refetchMessages()} className="w-full flex items-center max-w-xs mx-auto">
      <RefreshCw className="mr-2 h-4 w-4" />
      Reload Page
    </Button>
  </div>;
};
