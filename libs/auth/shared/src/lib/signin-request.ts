import { z } from 'zod';

export const SignInRequestSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string(),
});

export type SignInRequest = z.infer<typeof SignInRequestSchema>;
