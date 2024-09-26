import { Loader2 } from 'lucide-react';
import React from 'react';

export const PreviousMessagesLoader = () => <div className="h-full w-full flex items-center justify-center space-x-2 text-primary">
  <Loader2 className="h-5 w-5 animate-spin" />
  <span className="text-sm font-medium">Loading previous messages...</span>
</div>;
