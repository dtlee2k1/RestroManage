'use client'

import { useAppContext } from '@/components/app-provider'
import { decodedToken, generateSocketInstance } from '@/lib/utils'
import { useSetTokenToCookieMutation } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export default function OAuthPage() {
  const { setRole, setSocket } = useAppContext()
  const searchParams = useSearchParams()
  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  const message = searchParams.get('message')
  const router = useRouter()
  const { mutateAsync } = useSetTokenToCookieMutation()
  const isRefreshing = useRef(false)

  useEffect(() => {
    if (isRefreshing.current) return
    isRefreshing.current = true

    if (accessToken && refreshToken) {
      mutateAsync({ accessToken, refreshToken })
        .then(() => {
          setRole(decodedToken(accessToken).role)
          setSocket(generateSocketInstance(accessToken))
          router.push('/manage/dashboard')
        })
        .catch(() => {
          toast.error(message || 'Lỗi không xác định')
        })
        .finally(() => {
          isRefreshing.current = false
        })
    } else {
      setTimeout(() => {
        toast.error(message || 'Lỗi không xác định')
      })
    }
  }, [accessToken, refreshToken, setRole, setSocket, router, message, mutateAsync])

  return null
}
