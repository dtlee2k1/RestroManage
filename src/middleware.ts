import { NextResponse, NextRequest } from 'next/server'

const privatePaths = ['/manage']
const authPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('accessToken')?.value
  const isAuth = Boolean(accessToken)

  if (privatePaths.includes(pathname) && !isAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (authPaths.includes(pathname) && isAuth) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manage/:path*', '/login', '/menu', '/orders']
}
