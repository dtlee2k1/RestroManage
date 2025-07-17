import http from '@/lib/http'
import {
  AccountListResType,
  AccountResType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  CreateEmployeeAccountBodyType,
  CreateGuestBodyType,
  CreateGuestResType,
  GetGuestListQueryParamsType,
  GetListGuestsResType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'
import queryString from 'query-string'

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
    }),

  list: () => http.get<AccountListResType>('/accounts'),

  getEmployee: (id: number) => http.get<AccountResType>(`/accounts/detail/${id}`),

  addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>('/accounts', body),

  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`/accounts/detail/${id}`, body),

  deleteEmployee: (id: number) => http.delete<AccountResType>(`/accounts/detail/${id}`),

  getGuestList: (queryParams: GetGuestListQueryParamsType) =>
    http.get<GetListGuestsResType>(
      '/accounts/guests?' +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString()
        })
    ),

  createGuest: (body: CreateGuestBodyType) => http.post<CreateGuestResType>('/accounts/guests', body)
}

export default accountApiRequest
