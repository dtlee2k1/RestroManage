import http from '@/lib/http'
import { AccountResType, UpdateMeBodyType } from '@/schemaValidations/account.schema'

const accountApiRequest = {
  me: () => http.get<AccountResType>('/accounts/me'),

  updateMe: (data: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', data)
}

export default accountApiRequest
