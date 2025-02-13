// /routes/confirm-reset-password.tsx
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-adapter';
import { SmoothButton } from '~myjournai/components';
import { useMutation } from '@tanstack/react-query';

type ConfirmResetParams = {
  token_hash: string;
  type: string;
  next: string;
}

const searchSchema = z.object({
  token_hash: z.string(),
  type: z.string()
});

export const Route = createFileRoute('/_auth/confirm-reset')({
  validateSearch: zodValidator(searchSchema),
  component: ConfirmResetPassword
});

function ConfirmResetPassword() {
  const { token_hash, type } = Route.useSearch();
  const navigate = useNavigate();

  const confirmMutation = useMutation({
    mutationFn: async (params: ConfirmResetParams) => {
      const response = await fetch('/api/auth/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }

      return response.json();
    },
    onSuccess: () => {
      navigate({ to: '/profile/update-password' });
    }
  });

  const handleReset = () => {
    confirmMutation.mutate({
      token_hash,
      type,
      next: '/profile/update-password'
    });
  };

  return (
    <>
      <h2 className="text-center mb-2 text-muted-foreground font-medium">
        Reset password
      </h2>
      <p className="mb-4 text-muted-foreground text-sm">
        Click the button below to confirm your password reset and set a new password.
      </p>
      <SmoothButton
        onPress={handleReset}
        className="mt-8 w-full"
        buttonState={
          confirmMutation.isPending ? 'pending' :
            confirmMutation.isError ? 'error' :
              confirmMutation.isSuccess ? 'success' :
                'idle'
        }
      >
        Continue to Reset Password
      </SmoothButton>
      {confirmMutation.isError && (
        <p className="text-sm text-destructive mt-2 text-center">
          {confirmMutation.error.message}
        </p>
      )}
      <Link
        className="text-sm text-muted-foreground mt-2 block text-center"
        to="/sign-in"
      >
        Back to Sign In
      </Link>
      <p className="text-center mt-4 text-muted-foreground text-xs">
        {import.meta.env.VITE_APP_VERSION}
      </p>
    </>
  );
}
