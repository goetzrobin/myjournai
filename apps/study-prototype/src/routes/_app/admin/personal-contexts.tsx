import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/admin/personal-contexts')({
  component: () => <div>Hello /_app/admin/personal-contexts!</div>
})