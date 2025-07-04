import guestApiRequest from '@/apiRequests/guest'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

export function useGuestGetOrderListQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: guestApiRequest.getOrderList
  })
}

export function useGuestOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: guestApiRequest.order,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })
}
