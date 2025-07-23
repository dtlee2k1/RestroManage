import { useAppStore } from '@/components/app-provider'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']

export default function ListenLogoutSocket() {
  const socket = useAppStore((state) => state.socket)
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const { isPending, mutateAsync } = useLogoutMutation()
  const pathName = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return

    async function onLogout() {
      if (isPending) return

      try {
        await mutateAsync()
        setRole()
        socket?.disconnect()
        setSocket()
        router.push('/')
      } catch (error) {
        handleErrorApi({ error })
      }
    }

    socket?.on('logout', onLogout)

    return () => {
      socket?.off('logout', onLogout)
    }
  }, [socket, pathName, setRole, setSocket, router, isPending, mutateAsync])

  return null
}
