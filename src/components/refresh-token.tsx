'use client'

import { useAppContext } from '@/components/app-provider'
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

    checkAndRefreshToken({ onError: handleError })

    const refreshInterval = setInterval(() => {
      checkAndRefreshToken({ onError: handleError })
    }, 60 * 1000) // 1 min

    return () => clearInterval(refreshInterval)
  }, [pathName, router, setRole])

  return null
}
