'use client'

import ListenLogoutSocket from '@/components/listen-logout-socket'
import RefreshToken from '@/components/refresh-token'
import {
  decodedToken,
  generateSocketInstance,
  getAccessTokenFromLocalStorage,
  removeTokensFromLocalStorage
} from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: false
    }
  }
})

const AppContext = createContext<{
  isAuth: boolean
  role?: RoleType
  setRole: (role?: RoleType) => void
  socket?: Socket
  setSocket: (socket?: Socket) => void
}>({
  isAuth: false,
  role: undefined,
  setRole: () => {},
  socket: undefined as Socket | undefined,
  setSocket: () => {}
})
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>(undefined)
  const [role, setRoleState] = useState<RoleType | undefined>(undefined)

  const setRole = useCallback((role?: RoleType) => {
    setRoleState(role)
    if (!role) {
      removeTokensFromLocalStorage()
    }
  }, [])

  const isAuth = Boolean(role)

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodedToken(accessToken).role
      setRoleState(role)
      setSocket(generateSocketInstance(accessToken))
    }
  }, [])

  return (
    <AppContext.Provider value={{ isAuth, role, setRole, socket, setSocket }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
        <ListenLogoutSocket />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
