import {useMutation} from "@tanstack/react-query";

export const useSignOutMutation = (onSuccess?: () => void) => {
    return useMutation({
        mutationFn: () => fetch('/api/auth/signout'),
        onSuccess: () => onSuccess?.()
    })
}
