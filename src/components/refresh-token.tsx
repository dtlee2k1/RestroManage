import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/apiRequests/auth'

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
export default function RefreshToken() {
  const pathName = usePathname()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return

    let interval: any = null
    let isRefreshing = false
    const checkAndRefreshToken = async () => {
      const accessToken = getAccessTokenFromLocalStorage()
      const refreshToken = getRefreshTokenFromLocalStorage()

      if (!accessToken || !refreshToken) return

      const decodedAccessToken = jwt.decode(accessToken) as { exp: number; iat: number }
      const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number; iat: number }

      const now = Math.round(Date.now() / 1000)
      const remaining = decodedAccessToken.exp - now
      const tokenTTL = decodedAccessToken.exp - decodedAccessToken.iat

      // refresh token expired
      if (decodedRefreshToken.exp < now) return
      // access token is nearly expiry
      if (remaining < tokenTTL / 3 && !isRefreshing) {
        isRefreshing = true
        try {
          const result = await authApiRequest.refreshToken()
          const { accessToken, refreshToken } = result.payload.data
          setAccessTokenToLocalStorage(accessToken)
          setRefreshTokenToLocalStorage(refreshToken)
        } catch {
          clearInterval(interval)
        } finally {
          isRefreshing = false
        }
      }
    }

    interval = setInterval(checkAndRefreshToken, 1000)

    return () => clearInterval(interval)
  }, [pathName])

  return null
}
