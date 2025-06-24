import http from '@/lib/http'
import { LoginBodyType, LoginResType, LogoutBodyType } from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'

const authApiRequest = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),

  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
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
    )
}

export default authApiRequest
