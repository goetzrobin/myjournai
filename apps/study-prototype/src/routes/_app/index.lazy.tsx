import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_app/')({
  component: Index
});

function Index() {
  return <p>Hello from index</p>
}
