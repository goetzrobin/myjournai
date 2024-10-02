import { createFileRoute } from '@tanstack/react-router';
import { ChatError } from '~myjournai/chat-client';
import React from 'react';
import { SessionRouteComponent } from './-session-route.component';

export const Route = createFileRoute('/_app/sessions/scenic-route-v0')({
  component: () => <SessionRouteComponent slug="scenic-route-v0" />,
  errorComponent: ChatError
});
