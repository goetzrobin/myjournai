import React, { useState } from 'react';
import { Message, StreamRequest } from '~myjournai/chat-client';
import { BaseMessageChunk } from '~myjournai/chat-shared';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '~myjournai/components';

export const MessageError = ({ error, previousKeyAndChunks, startStream, removeChunksForTimestamp }: {
  error?: string;
  previousKeyAndChunks?: [key: string, chunks: BaseMessageChunk[]],
  startStream: (request: StreamRequest) => void,
  removeChunksForTimestamp: (isoTimeStamp: string) => void,
}) => {
  const [hasBeenRetried, setHasBeenRetried] = useState(false)
  const potentialChunk = previousKeyAndChunks?.[1]?.[0];
  const showRetryButton = potentialChunk && potentialChunk.chunkType === 'full-message';
  const onRetry = () => {
    if (!potentialChunk) return;
    setHasBeenRetried(true);
    removeChunksForTimestamp(previousKeyAndChunks?.[0])
    startStream({
      type: potentialChunk.type,
      scope: potentialChunk.scope,
      message: potentialChunk.textDelta
    });
  }
  return !showRetryButton || hasBeenRetried ? null :
      <div className="w-8/12 rounded-lg bg-background border border-destructive/50 p-4 max-w-[600px]">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <div className="flex-1 space-y-2">
            <Message content={error ?? 'Something went wrong'} />
            <Button
              className="mt-2 bg-primary/70 flex items-center"
              onPress={onRetry}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>

};
