import http from '@/lib/http'
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType
} from '@/schemaValidations/order.schema'

const orderApiRequest = {
  getOrderList: () => http.get<GetOrdersResType>('/orders'),

  getOrderByOrderId: (orderId: number) => http.get<CreateOrdersResType>(`/orders/${orderId}`),

  createOrder: (body: CreateOrdersBodyType) => http.post<CreateOrdersResType>('/orders', body),

  updateOrder: (orderId: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`/orders/${orderId}`, body),

  payOrder: (orderId: number, body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>(`/orders/${orderId}/pay`, body)
}

export default orderApiRequest
