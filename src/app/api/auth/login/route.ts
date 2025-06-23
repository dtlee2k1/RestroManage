import authApiRequest from '@/apiRequests/auth';
import { LoginBodyType } from '@/schemaValidations/auth.schema';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { HttpError } from '@/lib/http';

export async function POST(request: Request) {
  const res: LoginBodyType = await request.json();
  const cookieStore = await cookies();

  try {
    const { payload } = await authApiRequest.sLogin(res);
    const { accessToken, refreshToken } = payload.data;

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };

    cookieStore.set('accessToken', accessToken, {
      expires: decodedAccessToken.exp * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    cookieStore.set('refreshToken', refreshToken, {
      expires: decodedRefreshToken.exp * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      console.log(error.payload);
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        { message: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }
}
