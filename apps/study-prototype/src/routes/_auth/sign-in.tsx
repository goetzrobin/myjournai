import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useSignInMutation } from '~myjournai/auth-client';
import { Form, Link, SmoothButton, TextField } from '~myjournai/components';
import { parseFormData } from '~myjournai/form-utils';
import { LucideLoader } from 'lucide-react';

export const Route = createFileRoute('/_auth/sign-in')({
  beforeLoad: () => {
    const isStartScreenShown = JSON.parse(localStorage.getItem('isStartScreenShown') ?? 'false');
    if (!isStartScreenShown) {
      localStorage.setItem('isStartScreenShown', 'true');
      throw redirect({ to: '/start' });
    }
  },
  component: SignIn
});

function SignIn() {
  const navigate = useNavigate();
  const mut = useSignInMutation(() => setTimeout(() => navigate({ to: '/' }), 500));

  return (
    <>
      <h2 className="text-center mb-8 text-muted-foreground font-medium">Sign in to continue your journey!</h2>
      <Form onSubmit={(e) => mut.mutate(parseFormData(e))}>
        <TextField label="Email" name="email" type="email" isRequired />
       <div className="relative pt-2">
         <Link className="-top-2 right-0 absolute" to="/reset">Forgot Password?</Link>
         <TextField
           label="Password"
           name="password"
           type="password"
           isRequired
         />
       </div>
        <SmoothButton type="submit" className="mt-8" buttonState={mut.status}>
          {mut.status !== 'idle' ? null : 'Sign in'}
          {mut.status !== 'pending' ? null : <LucideLoader className="size-5 animate-spin" />}
          {mut.status !== 'success' ? null : 'You\'re signed in!'}
          {mut.status !== 'error' ? null : 'Something went wrong... Try again!'}
        </SmoothButton>
      </Form>
      <Link className="text-sm text-muted-foreground mt-2 block text-center" to="/sign-up">I need an account</Link>
      <p className="text-center mt-4 text-muted-foreground text-xs">
        {import.meta.env.VITE_APP_VERSION}
      </p>
    </>
  );
}
