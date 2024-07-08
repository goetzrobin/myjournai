export { authenticateUser } from './lib/auth/server/authenticate-user';
export { createClient } from './lib/auth/server/client';

export { authenticateRoute } from './lib/auth/client/authenticate-route';
export { getAuthSessionFromHeaders } from './lib/auth/client/session';

export { useSignInMutation } from './lib/signin/client/signin.mutation';
export { signInAction } from './lib/signin/server/actions';
export { SignInRequestSchema, type SignInRequest } from './lib/signin/signin-request';

export { useSignUpMutation } from './lib/signup/client/signup.mutation';
export { signUpAction } from './lib/signup/server/actions';
export { SignUpRequestSchema, type SignUpRequest } from './lib/signup/signup-request';

export { useSignOutMutation } from './lib/signout/client/signout.mutation';
