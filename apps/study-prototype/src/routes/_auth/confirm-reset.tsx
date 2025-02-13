// /routes/confirm-reset-password.tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { z } from 'zod';
import { zodValidator } from '@tanstack/zod-adapter';
import { SmoothButton } from '~myjournai/components';

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

  const handleReset = () => {
    window.location.href = `/api/auth/confirm?token_hash=${token_hash}&type=${type}&next=/profile/update-password`;
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
        buttonState="idle"
      >
        Continue to Reset Password
      </SmoothButton>
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
