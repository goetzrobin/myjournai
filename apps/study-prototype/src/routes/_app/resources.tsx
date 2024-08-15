import { createFileRoute } from '@tanstack/react-router';
import { authenticateRoute } from '@myjournai/auth-client';
import { WithMobileNav } from '../-nav/with-mobile-nav';

export const Route = createFileRoute('/_app/resources')({
  component: About,
  beforeLoad: authenticateRoute,
});

function About() {
  return <WithMobileNav>Hello from Resources!</WithMobileNav>;
}
