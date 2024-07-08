import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useSignUpMutation } from '~myjournai/auth';
import { Button, Form, TextField } from '~myjournai/components';
import { parseFormData } from '~myjournai/form-utils';

export const Route = createFileRoute('/sign-up')({
  component: SignUp
});

function SignUp() {
  const navigate = useNavigate();
  const mut = useSignUpMutation(() =>navigate({to: '/'}));
  return (
    <>
    <Form onSubmit={e => mut.mutate(parseFormData(e))}>
      <TextField label="Email" name="email" type="email" isRequired />
      <TextField label="Password" name="password" type="password" isRequired />
      <div className="flex gap-2">
        <Button type="submit">{mut.isPending ? 'Signing up' : 'Sign up'}</Button>
      </div>
    </Form>
      <Link to="/sign-in">Sign In</Link>
    </>
  );
}
