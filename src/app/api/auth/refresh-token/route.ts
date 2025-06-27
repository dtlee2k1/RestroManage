import authApiRequest from '@/apiRequests/auth'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) {
    return Response.json({ message: 'No refresh token found' }, { status: 401 })
  }

  try {
    const { payload } = await authApiRequest.sRefreshToken({ refreshToken })
    const { accessToken, refreshToken: newRefreshToken } = payload.data

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(newRefreshToken) as { exp: number }

    cookieStore.set('accessToken', accessToken, {
      expires: decodedAccessToken.exp * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    })
    cookieStore.set('refreshToken', newRefreshToken, {
      expires: decodedRefreshToken.exp * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    })

    return Response.json(payload)
  } catch (error: any) {
    return Response.json(
      {
        message: error.message || 'Error refreshing token'
      },
      {
        status: 401
      }
    )
  }
}
