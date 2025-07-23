import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { HttpError } from '@/lib/http'

export async function POST(request: Request) {
  const res = (await request.json()) as {
    accessToken: string
    refreshToken: string
  }
  const cookieStore = await cookies()

  try {
    const { accessToken, refreshToken } = res

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number }

    cookieStore.set('accessToken', accessToken, {
      expires: decodedAccessToken.exp * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    })
    cookieStore.set('refreshToken', refreshToken, {
      expires: decodedRefreshToken.exp * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    })

    return Response.json(res)
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json({ message: 'An unexpected error occurred' }, { status: 500 })
    }
  }
}
