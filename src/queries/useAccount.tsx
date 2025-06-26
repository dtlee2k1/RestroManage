import accountApiRequest from '@/apiRequests/account'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useAccountMeQuery() {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountApiRequest.me
  })
}

export function useUpdateMeMutation() {
  return useMutation({
    mutationKey: ['account-me'],
    mutationFn: accountApiRequest.updateMe
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: accountApiRequest.changePassword
  })
}
