import { createFileRoute } from '@tanstack/react-router';
import { SessionRouteComponent } from './-session-route.component';
import { ChatError } from '~myjournai/chat-client';
import React from 'react';

export const Route = createFileRoute('/_app/sessions/career-confusion-v0')({
  component: () => <SessionRouteComponent slug="career-confusion-v0" />,
  errorComponent: ChatError
});
