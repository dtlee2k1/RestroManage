import guestApiRequest from '@/apiRequests/guest'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value || ''
  const refreshToken = cookieStore.get('refreshToken')?.value || ''
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')

  if (!accessToken || !refreshToken) {
    return Response.json({ message: 'No tokens found' }, { status: 200 })
  }

  try {
    const { payload } = await guestApiRequest.sLogout({ accessToken, refreshToken })

    return Response.json(payload)
  } catch {
    return Response.json('Error logging out', {
      status: 200
    })
  }
}
