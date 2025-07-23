import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType
} from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'

const authApiRequest = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),

  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: ''
    }),

  setTokenToCookie: (body: { accessToken: string; refreshToken: string }) =>
    http.post('/api/auth/token', body, {
      baseUrl: ''
    }),

  sLogout: (
    body: LogoutBodyType & {
      accessToken: string
    }
  ) =>
    http.post<MessageResType>(
      '/auth/logout',
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
      '/api/auth/logout',
      {},
      {
        baseUrl: ''
      }
    ),

  sRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/auth/refresh-token', body),

  refreshToken: () =>
    http.post<RefreshTokenResType>('/api/auth/refresh-token', null, {
      baseUrl: ''
    })
}

export default authApiRequest
