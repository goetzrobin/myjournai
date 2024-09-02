import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useSignInMutation } from '@myjournai/auth-client';
import { Form, Link, TextField } from '~myjournai/components';
import { parseFormData } from '~myjournai/form-utils';
import SmoothButton from './-components/smooth-button';
import { LucideLoader } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignIn
});

function SignIn() {
  const [isStartScreenShown, setStartScreenShown] = useState(JSON.parse(localStorage.getItem('isStartScreenShown') ?? 'false'));

  const navigate = useNavigate();
  const mut = useSignInMutation(() => setTimeout(() => navigate({ to: '/' }), 500));

  useEffect(() => {
    if (!isStartScreenShown) {
      setStartScreenShown(true);
      localStorage.setItem('isStartScreenShown', 'true');
      void navigate({ to: '/start' });
    }
  }, [isStartScreenShown]);

  return (
    <>
      <h2 className="text-center mb-8 text-muted-foreground font-medium">Sign in to continue your journey!</h2>
      <Form onSubmit={(e) => mut.mutate(parseFormData(e))}>
        <TextField label="Email" name="email" type="email" isRequired />
        <TextField
          label="Password"
          name="password"
          type="password"
          isRequired
        />
        <SmoothButton className="mt-8" buttonState={mut.status}>
          {mut.status !== 'idle' ? null : 'Sign in'}
          {mut.status !== 'pending' ? null : <LucideLoader className="size-5 animate-spin" />}
          {mut.status !== 'success' ? null : 'You\'re signed in!'}
          {mut.status !== 'error' ? null : 'Something went wrong... Try again!'}
        </SmoothButton>
      </Form>
      <Link className="text-sm text-muted-foreground mt-2 block text-center" to="/sign-up">I need an account</Link>
    </>
  );
}
