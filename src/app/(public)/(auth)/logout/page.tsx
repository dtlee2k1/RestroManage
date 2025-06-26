'use client'

import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

export default function Logout() {
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromURL = searchParams.get('refreshToken')
  const accessTokenFromURL = searchParams.get('accessToken')

  const hasCalled = useRef(false)

  useEffect(() => {
    if (
      hasCalled.current ||
      (refreshTokenFromURL && refreshTokenFromURL !== getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromURL && accessTokenFromURL !== getAccessTokenFromLocalStorage())
    ) {
      return
    }
    hasCalled.current = true

    mutateAsync().then(() => {
      router.push('/login')
    })
  }, [mutateAsync, router, refreshTokenFromURL, accessTokenFromURL])

  return <div>Logout...</div>
}
