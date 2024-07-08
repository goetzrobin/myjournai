import {z} from "zod";

export const SignUpRequestSchema =   z.object({
    email: z.string().email({message: 'Please enter a valid email'}),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>