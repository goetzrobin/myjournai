import { createFileRoute } from '@tanstack/react-router';
import { authenticateRoute } from '@myjournai/auth-client';

export const Route = createFileRoute('/_app/about')({
  component: About,
  beforeLoad: authenticateRoute,
});

function About() {
  return <>Hello from About!</>;
}
