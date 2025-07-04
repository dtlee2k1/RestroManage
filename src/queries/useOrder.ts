import orderApiRequest from '@/apiRequests/order'
import { UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useGetOrderListQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderApiRequest.getOrderList
  })
}

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, body }: { orderId: number; body: UpdateOrderBodyType }) =>
      orderApiRequest.updateOrder(orderId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })
}
