import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useSignUpMutation } from '@myjournai/auth-client';
import { Button, Form, TextField } from '~myjournai/components';
import { parseFormData } from '~myjournai/form-utils';
import SmoothButton from './-components/smooth-button';
import { LucideLoader } from 'lucide-react';

export const Route = createFileRoute('/_auth/sign-up')({
  component: SignUp
});

function SignUp() {
  const navigate = useNavigate();
  const mut = useSignUpMutation(() => setTimeout(() => navigate({ to: '/' }), 500));
  return (
    <>
      <Form onSubmit={(e) => mut.mutate(parseFormData(e))}>
        <TextField label="Email" name="email" type="email" isRequired />
        <TextField
          label="Password"
          name="password"
          type="password"
          isRequired
        />
        <div className="flex gap-2">
          <SmoothButton buttonState={mut.status}>
            {mut.status !== 'idle' ? null : 'Sign up'}
            {mut.status !== 'pending' ? null : <LucideLoader className="size-5 animate-spin"/>}
            {mut.status !== 'success' ? null : 'You\'re signed up!'}
            {mut.status !== 'error' ? null : 'Something went wrong... Try again!'}
          </SmoothButton>
        </div>
      </Form>
      <p className="text-center text-sm text-muted-foreground font-bold mt-4 mb-8">OR</p>
      <Button className="w-full" variant="secondary"><Link className="block text-center" to="/sign-in">Sign
        In</Link></Button>
    </>
  );
}
