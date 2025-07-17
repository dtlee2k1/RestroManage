import orderApiRequest from '@/apiRequests/order'
import { GetOrdersQueryParamsType, UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { useMutation, useQuery } from '@tanstack/react-query'

export function useGetOrderListQuery(queryParams: GetOrdersQueryParamsType) {
  return useQuery({
    queryKey: ['orders', queryParams],
    queryFn: () => orderApiRequest.getOrderList(queryParams)
  })
}

export function useGetOrderDetailQuery({ orderId }: { orderId: number }) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderApiRequest.getOrderDetail(orderId),
    enabled: !!orderId
  })
}

export function useUpdateOrderMutation() {
  return useMutation({
    mutationFn: ({ orderId, body }: { orderId: number; body: UpdateOrderBodyType }) =>
      orderApiRequest.updateOrder(orderId, body)
  })
}

export function usePayForGuestMutation() {
  return useMutation({
    mutationFn: orderApiRequest.payGuestOrders
  })
}
