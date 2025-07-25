import http from '@/lib/http'
import { LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType
} from '@/schemaValidations/guest.schema'

const guestApiRequest = {
  sLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('/guest/auth/login', body),

  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>('/api/guest/auth/login', body, {
      baseUrl: ''
    }),

  sLogout: (
    body: LogoutBodyType & {
      accessToken: string
    }
  ) =>
    http.post<MessageResType>(
      '/guest/auth/logout',
      {
        refreshToken: body.refreshToken
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`
        }
      }
    ),

  logout: () =>
    http.post<MessageResType>(
      '/api/guest/auth/logout',
      {},
      {
        baseUrl: ''
      }
    ),

  sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/guest/auth/refresh-token', body),

  refreshToken: () =>
    http.post<RefreshTokenResType>('/api/guest/auth/refresh-token', null, {
      baseUrl: ''
    }),

  getOrderList: () => http.get<GuestGetOrdersResType>('/guest/orders'),

  order: (body: GuestCreateOrdersBodyType) => http.post<GuestCreateOrdersResType>('/guest/orders', body)
}

export default guestApiRequest
