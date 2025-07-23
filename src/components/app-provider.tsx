'use client'

import { create } from 'zustand'
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
import { Socket } from 'socket.io-client'
import { useEffect } from 'react'

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

type AppState = {
  role?: RoleType
  socket?: Socket
  setRole: (role?: RoleType) => void
  setSocket: (socket?: Socket) => void
  isAuth: boolean
}

export const useAppStore = create<AppState>((set) => ({
  isAuth: false,
  role: undefined,
  setRole: (role?: RoleType) => {
    if (!role) {
      removeTokensFromLocalStorage()
    }
    set({ role, isAuth: Boolean(role) })
  },
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket) => set({ socket })
}))

export function AppProvider({ children }: { children: React.ReactNode }) {
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)

  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodedToken(accessToken).role
      setRole(role)
      const socket = generateSocketInstance(accessToken)
      setSocket(socket)
    }
  }, [setRole, setSocket])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ListenLogoutSocket />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
