import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useSignUpMutation } from '~myjournai/auth-client';
import { Form, Link, SmoothButton, TextField } from '~myjournai/components';
import { parseFormData } from '~myjournai/form-utils';
import { LucideLoader } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/sign-up')({
  component: SignUp
});

function SignUp() {
  const navigate = useNavigate();
  const mut = useSignUpMutation(() => setTimeout(() => navigate({ to: '/onboarding' }), 500));
  const [password, setPassword] = useState<string | undefined>(undefined)
  return (
    <div className="">
      <h2 className="text-center mb-8 text-muted-foreground font-medium">Join us and start your journey!</h2>
      <Form onSubmit={(e) => mut.mutate(parseFormData(e))}>
        <TextField label="Email" name="email" type="email" isRequired />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={setPassword}
          isRequired
        />
        <TextField
          label="Confirm Password"
          name="confirm-password"
          type="password"
          isRequired
          validate={value => value !== password ? 'Passwords must match' : null}
        />
        <SmoothButton type="submit" className="mt-8" buttonState={mut.status}>
          {mut.status !== 'idle' ? null : 'Sign up'}
          {mut.status !== 'pending' ? null : <LucideLoader className="size-5 animate-spin" />}
          {mut.status !== 'success' ? null : 'You\'re ready to start your journey!'}
          {mut.status !== 'error' ? null : 'Something went wrong... Try again!'}
        </SmoothButton>
      </Form>
      <Link className="text-sm text-muted-foreground mt-2 block text-center" to="/sign-in">I have an account
        already</Link>
      <p className="text-center mt-4 text-muted-foreground text-xs">
        {import.meta.env.VITE_APP_VERSION}
      </p>
    </div>
  );
}
