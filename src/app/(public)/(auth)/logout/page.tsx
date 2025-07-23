'use client'

import { useAppStore } from '@/components/app-provider'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useRef } from 'react'

function Logout() {
  const socket = useAppStore((state) => state.socket)
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const { mutateAsync } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromURL = searchParams.get('refreshToken') || ''
  const accessTokenFromURL = searchParams.get('accessToken') || ''

  const hasCalled = useRef(false)

  useEffect(() => {
    if (
      !hasCalled.current &&
      ((refreshTokenFromURL && refreshTokenFromURL === getRefreshTokenFromLocalStorage()) ||
        (accessTokenFromURL && accessTokenFromURL === getAccessTokenFromLocalStorage()))
    ) {
      hasCalled.current = true

      mutateAsync().then(() => {
        setRole()
        socket?.disconnect()
        setSocket()
        router.push('/login')
      })
    } else if (accessTokenFromURL !== getAccessTokenFromLocalStorage()) {
      router.push('/')
    }
  }, [mutateAsync, router, refreshTokenFromURL, accessTokenFromURL, setRole, socket, setSocket])

  return <div>Logout...</div>
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Logout />
    </Suspense>
  )
}
