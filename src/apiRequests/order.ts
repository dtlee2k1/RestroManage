import http from '@/lib/http'
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType
} from '@/schemaValidations/order.schema'
import queryString from 'query-string'

const orderApiRequest = {
  getOrderList: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      '/orders?' +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString()
        })
    ),

  getOrderDetail: (orderId: number) => http.get<CreateOrdersResType>(`/orders/${orderId}`),

  createOrder: (body: CreateOrdersBodyType) => http.post<CreateOrdersResType>('/orders', body),

  updateOrder: (orderId: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`/orders/${orderId}`, body),

  payOrder: (orderId: number, body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>(`/orders/${orderId}/pay`, body)
}

export default orderApiRequest
