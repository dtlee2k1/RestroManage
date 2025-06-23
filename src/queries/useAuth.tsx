import authApiRequest from '@/apiRequests/auth'
import { LoginBodyType } from '@/schemaValidations/auth.schema'
import { useMutation } from '@tanstack/react-query'

export function useLoginMutation() {
  return useMutation({
    mutationFn: authApiRequest.login
  })
}
