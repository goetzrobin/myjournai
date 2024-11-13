import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Form, Link, SmoothButton, TextField } from '~myjournai/components';
import { parseFormData } from '~myjournai/form-utils';
import { LucideChevronLeft, LucideLoader } from 'lucide-react';
import { useAxios } from '~myjournai/http-client';
import { useMutation } from '@tanstack/react-query';

export const Route = createFileRoute('/_app/profile/update-password')({
  component: UpdatePassword
});

const useUpdatePasswordMutation = (onSuccess?: (data: any) => void) => {
  const axios = useAxios()
  return useMutation({
    mutationFn: (values: {newPassword: string}) => axios.post('/api/auth/reset/password', values),
    onSuccess: (data) => onSuccess?.(data),
  });
}

function UpdatePassword() {
  const mut = useUpdatePasswordMutation();
  const [password, setPassword] = useState<string | undefined>(undefined);
  return (
    <div>
      <div className="flex">
        <Link to="/profile"><LucideChevronLeft className="size-5" /><span className="sr-only">Back to profile</span></Link>
      </div>
      <h2 className="mb-8 text-muted-foreground font-medium">Update Password</h2>
      <Form onSubmit={(e) => mut.mutate(parseFormData(e))}>
        <TextField
          label="Password"
          name="newPassword"
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
          {mut.status !== 'idle' ? null : 'Change Password'}
          {mut.status !== 'pending' ? null : <LucideLoader className="size-5 animate-spin" />}
          {mut.status !== 'success' ? null : 'Password updated'}
          {mut.status !== 'error' ? null : 'Something went wrong... Try again!'}
        </SmoothButton>
      </Form>
    </div>
  );
}
