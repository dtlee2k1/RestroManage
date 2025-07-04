import { Role } from '@/constants/type'
import { decodedToken } from '@/lib/utils'
import { NextResponse, NextRequest } from 'next/server'

const managePaths = ['/manage']
const guestPaths = ['/guest']
const privatePaths = [...managePaths, ...guestPaths]
const authPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')

    return NextResponse.redirect(url)
  }

  if (refreshToken) {
    if (authPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      url.searchParams.set('redirect', pathname)

      return NextResponse.redirect(url)
    }

    const role = decodedToken(refreshToken).role
    if (
      (role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))) ||
      (role !== Role.Guest && guestPaths.some((path) => pathname.startsWith(path)))
    ) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/guest/:path*', '/login']
}
