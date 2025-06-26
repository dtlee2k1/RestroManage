import { NextResponse, NextRequest } from 'next/server'

const privatePaths = ['/manage']
const authPaths = ['/login']
const logoutPath = '/logout'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value

  if (pathname === logoutPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (privatePaths.includes(pathname) && !refreshToken) {
    return NextResponse.redirect(new URL('login', request.url))
  }

  if (authPaths.includes(pathname) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (privatePaths.includes(pathname) && refreshToken && !accessToken) {
    const url = new URL('/logout', request.url)
    url.searchParams.set('refreshToken', refreshToken)

    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login', '/menu', '/orders', '/logout']
}
