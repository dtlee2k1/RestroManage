'use client'

import { useAppStore } from '@/components/app-provider'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
export default function RefreshToken() {
  const pathName = usePathname()
  const router = useRouter()
  const socket = useAppStore((state) => state.socket)
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return
    const handleError = () => {
      clearInterval(refreshInterval)
      setRole()
      socket?.disconnect()
      setSocket()
      router.push('/login')
    }

    const onRefreshToken = (force = false) => {
      checkAndRefreshToken({ onError: handleError, force })
    }

    onRefreshToken()

    const refreshInterval = setInterval(onRefreshToken, 60 * 1000) // 1 min

    if (socket?.connected) {
      onConnect()
    }
    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('socket disconnected')
    }

    function onRefreshTokenSocket(data: any) {
      console.log(data)
      onRefreshToken(true)
    }

    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)
    socket?.on('refresh-token', onRefreshTokenSocket)

    return () => {
      clearInterval(refreshInterval)
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('refresh-token', onRefreshTokenSocket)
    }
  }, [pathName, router, setRole, socket, setSocket])

  return null
}
