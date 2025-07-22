import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Socket } from 'socket.io-client'

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']

export default function useListenLogout({ socket }: { socket: Socket | undefined }) {
  const pathName = usePathname()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return

    if (socket?.connected) {
      onConnect()
    }
    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('socket disconnected')
    }

    function onLogout(data: any) {
      console.log(data)
      console.log('logout')
    }

    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)
    socket?.on('logout', onLogout)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('logout', onLogout)
    }
  }, [socket, pathName])
}
