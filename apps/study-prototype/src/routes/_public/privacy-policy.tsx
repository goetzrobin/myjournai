import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/privacy-policy')({
  component: () => <div>Hello /_public/privacy-policy!</div>
})