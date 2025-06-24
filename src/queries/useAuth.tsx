import authApiRequest from '@/apiRequests/auth'
import { useMutation } from '@tanstack/react-query'

export function useLoginMutation() {
  return useMutation({
    mutationFn: authApiRequest.login
  })
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: authApiRequest.logout
  })
}
