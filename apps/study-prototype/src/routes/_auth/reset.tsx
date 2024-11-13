import { createFileRoute } from '@tanstack/react-router';
import { Form, Link, SmoothButton, TextField } from '~myjournai/components';
import { parseFormData } from '~myjournai/form-utils';
import { LucideLoader } from 'lucide-react';
import { useAxios } from '~myjournai/http-client';
import { useMutation } from '@tanstack/react-query';
import { SignInRequest } from '~myjournai/auth-shared';

export const Route = createFileRoute('/_auth/reset')({
  component: Reset
})

const useResetMutation = (onSuccess?: (data: any) => void) => {
  const axios = useAxios()
  return useMutation({
    mutationFn: (values: SignInRequest) => axios.post('/api/auth/reset/start', values),
    onSuccess: (data) => onSuccess?.(data),
  });
}

function Reset() {
  const mut = useResetMutation();

  return (
    <>
      <h2 className="text-center mb-2 text-muted-foreground font-medium">Reset password</h2>
      <p className="mb-4 text-muted-foreground text-sm">Include the email address associated with your account and we’ll send you an email with instructions to reset your password.</p>
      <Form onSubmit={(e) => mut.mutate(parseFormData(e))}>
        <TextField label="Email" name="email" type="email" isRequired />
        <SmoothButton type="submit" className="mt-8" buttonState={mut.status}>
          {mut.status !== 'idle' ? null : 'Send Reset Instructions'}
          {mut.status !== 'pending' ? null : <LucideLoader className="size-5 animate-spin" />}
          {mut.status !== 'success' ? null : 'Instructions Sent! Check Inbox'}
          {mut.status !== 'error' ? null : 'Something went wrong... Try again!'}
        </SmoothButton>
      </Form>
      <Link className="text-sm text-muted-foreground mt-2 block text-center" to="/sign-in">Back to Sign In</Link>
      <p className="text-center mt-4 text-muted-foreground text-xs">
        {import.meta.env.VITE_APP_VERSION}
      </p>
    </>
  );
}
