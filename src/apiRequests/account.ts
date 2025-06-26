import http from '@/lib/http'
import {
  AccountResType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'

const accountApiRequest = {
  me: () => http.get<AccountResType>('/accounts/me'),

  updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body),

  changePassword: (body: ChangePasswordV2BodyType) =>
    http.put<ChangePasswordV2ResType>('/api/accounts/change-password', body, {
      baseUrl: ''
    }),

  sChangePassword: (accessToken: string, body: ChangePasswordV2BodyType) =>
    http.put<ChangePasswordV2ResType>('/accounts/change-password-v2', body, {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
}

export default accountApiRequest
