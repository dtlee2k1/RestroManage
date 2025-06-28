import { NextResponse, NextRequest } from 'next/server'

const privatePaths = ['/manage']
const authPaths = ['/login']
const forbiddenClientPaths = ['/logout', '/refresh-token']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (forbiddenClientPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL('login', request.url))
  }

  if (authPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (privatePaths.some((path) => pathname.startsWith(path)) && refreshToken && !accessToken) {
    const url = new URL('/refresh-token', request.url)
    url.searchParams.set('refreshToken', refreshToken)
    url.searchParams.set('redirect', pathname)

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login', '/menu', '/orders', '/logout', '/refresh-token']
}
