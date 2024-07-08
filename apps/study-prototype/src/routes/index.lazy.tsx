import { createLazyFileRoute } from '@tanstack/react-router';
import { useSignUpMutation } from '~myjournai/auth';
import { Button, Form, TextField } from '~myjournai/components';
import { parseFormData } from '~myjournai/form-utils';

export const Route = createLazyFileRoute('/')({
  component: Index
});

function Index() {
  const mut = useSignUpMutation();
  return (
    <Form onSubmit={e => mut.mutate(parseFormData(e))}>
      <TextField label="Email" name="email" type="email" isRequired />
      <TextField label="Password" name="password" type="password" isRequired />
      <div className="flex gap-2">
        <Button type="submit">{mut.isPending ? 'Signing up' : 'Submit'}</Button>
        <Button type="reset" variant="secondary">Reset</Button>
      </div>
    </Form>
  );
}
