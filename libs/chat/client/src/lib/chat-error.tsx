import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '~myjournai/components';
import React from 'react';

export const ChatError = () => {
  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center space-y-6 max-w-md px-4">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
        <h1 className="text-3xl font-bold">Oops! Something went wrong</h1>
        <p className="text-muted-foreground">
          We're sorry, but it seems there was an error loading the chat. Please try reloading the page.
        </p>
        <Button onPress={handleReload} className="w-full flex items-center max-w-xs mx-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload Page
        </Button>
      </div>
    </div>
  )
}
