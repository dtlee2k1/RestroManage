'use client'

import { useAppContext } from '@/components/app-provider'
import socket from '@/lib/socket'
import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
export default function RefreshToken() {
  const pathName = usePathname()
  const router = useRouter()
  const { setRole } = useAppContext()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return
    const handleError = () => {
      clearInterval(refreshInterval)
      setRole()
      router.push('/login')
    }

    const onRefreshToken = (force = false) => {
      checkAndRefreshToken({ onError: handleError, force })
    }

    onRefreshToken()

    const refreshInterval = setInterval(onRefreshToken, 60 * 1000) // 1 min

    if (socket.connected) {
      onConnect()
    }
    function onConnect() {
      console.log(socket.id)
    }

    function onDisconnect() {
      console.log('socket disconnected')
    }

    function onRefreshTokenSocket(data: any) {
      console.log(data)
      onRefreshToken(true)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('refresh-token', onRefreshTokenSocket)

    return () => {
      clearInterval(refreshInterval)
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('refresh-token', onRefreshTokenSocket)
    }
  }, [pathName, router, setRole])

  return null
}
