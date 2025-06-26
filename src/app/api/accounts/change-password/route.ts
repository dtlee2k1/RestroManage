import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { ChangePasswordV2BodyType } from '@/schemaValidations/account.schema'
import accountApiRequest from '@/apiRequests/account'

export async function PUT(request: Request) {
  const body: ChangePasswordV2BodyType = await request.json()
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (!accessToken) {
    return Response.json({ message: 'Not found access token' }, { status: 401 })
  }

  try {
    const { payload } = await accountApiRequest.sChangePassword(accessToken, body)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = payload.data

    const decodedAccessToken = jwt.decode(newAccessToken) as { exp: number }
    const decodedRefreshToken = jwt.decode(newRefreshToken) as { exp: number }

    cookieStore.set('accessToken', newAccessToken, {
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
        message: error.message || 'An unexpected error occurred'
      },
      {
        status: error.status || 500
      }
    )
  }
}
