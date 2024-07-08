import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useSignInMutation, useSignUpMutation } from '~myjournai/auth';
import { Button, Form, TextField } from '~myjournai/components';
import { parseFormData } from '~myjournai/form-utils';

export const Route = createFileRoute('/sign-in')({
  component: SignIn
});

function SignIn() {
  const navigate = useNavigate();
  const mut = useSignInMutation(() => navigate({to: '/'}));
  return (
    <>
      <Form onSubmit={e => mut.mutate(parseFormData(e))}>
        <TextField label="Email" name="email" type="email" isRequired />
        <TextField label="Password" name="password" type="password" isRequired />
        <div className="flex gap-2">
          <Button type="submit">{mut.isPending ? 'Signing in' : 'Sign in'}</Button>
        </div>
      </Form>
      <Link to="/sign-up">Sign Up</Link>
    </>
  );
}
