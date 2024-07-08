import {useMutation} from "@tanstack/react-query";
import {SignInRequest} from "../signin-request";

export const useSignInMutation = (onSuccess?: (data: any) => void) => {
    return useMutation({
        mutationFn: (values: SignInRequest) => fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            }),
      onSuccess: data => onSuccess?.(data)
    })
}
