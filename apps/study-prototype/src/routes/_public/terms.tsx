import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/terms')({
  component: () => <div>Hello /_public/terms!</div>
})