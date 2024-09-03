import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_app/profile/')({
  component: () => <div>Hello /_app/profile/!</div>
})