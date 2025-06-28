import { checkAndRefreshToken } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const UNAUTHENTICATED_PATHS = ['/login', '/register', '/refresh-token']
export default function RefreshToken() {
  const pathName = usePathname()

  useEffect(() => {
    if (UNAUTHENTICATED_PATHS.includes(pathName)) return

    let interval: any = null

    checkAndRefreshToken()

    interval = setInterval(() => checkAndRefreshToken({ onError: () => clearInterval(interval) }), 60 * 1000) // 1 minute

    return () => clearInterval(interval)
  }, [pathName])

  return null
}
