import {SignInRequest} from "../signin-request";
import {createClient} from "../../auth/server/client";
import {H3Event} from "h3";
import { AuthError, User } from '@supabase/auth-js';

export const signInAction = async (event: H3Event, {email, password}: SignInRequest):  Promise<AuthError | User>=> {
    const authClient = createClient(event);
    const signInResult = await authClient.auth.signInWithPassword({
        email,
        password,
    },)
    if (signInResult.error) {
        return signInResult.error
    }
    return signInResult.data.user
}
