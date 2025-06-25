import accountApiRequest from '@/apiRequests/account'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useAccountMeQuery() {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: accountApiRequest.me
  })
}

export function useUpdateMeMutation() {
  return useMutation({
    mutationKey: ['account-profile'],
    mutationFn: accountApiRequest.updateMe
  })
}
