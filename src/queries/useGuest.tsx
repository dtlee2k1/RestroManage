import guestApiRequest from '@/apiRequests/guest'
import { useMutation } from '@tanstack/react-query'

export function useGuestLoginMutation() {
  return useMutation({
    mutationFn: guestApiRequest.login
  })
}

export function useGuestLogoutMutation() {
  return useMutation({
    mutationFn: guestApiRequest.logout
  })
}
