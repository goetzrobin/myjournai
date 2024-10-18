import { createFileRoute } from '@tanstack/react-router';
import { ChatError } from '~myjournai/chat-client';
import { SessionRouteComponent } from './-session-route.component';

export const Route = createFileRoute('/_app/sessions/$sessionSlug')({
    component: () => {
      const { sessionSlug } = Route.useParams()
      return <SessionRouteComponent slug={sessionSlug} />
    },
    errorComponent: ChatError
  });
