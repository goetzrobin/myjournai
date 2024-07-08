import { createFileRoute } from '@tanstack/react-router';
import { authenticateRoute } from '~myjournai/auth';

export const Route = createFileRoute('/about')({
  component: About,
  beforeLoad: authenticateRoute
})

function About() {
  return <div className="p-2">Hello from About!</div>
}
