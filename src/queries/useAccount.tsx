import accountApiRequest from '@/apiRequests/account'
import { useQuery } from '@tanstack/react-query'

export function useAccountProfile() {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: accountApiRequest.me
  })
}
