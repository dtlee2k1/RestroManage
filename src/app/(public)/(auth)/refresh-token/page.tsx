'use client'

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function RefreshToken() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPathname = searchParams.get('redirect')
  const refreshTokenFromURL = searchParams.get('refreshToken')

  useEffect(() => {
    if (refreshTokenFromURL && refreshTokenFromURL === getRefreshTokenFromLocalStorage()) {
      checkAndRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || '/')
        }
      })
    }
  }, [refreshTokenFromURL, redirectPathname, router])

  return <div>Refresh token...</div>
}
