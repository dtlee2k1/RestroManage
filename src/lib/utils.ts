import { EntityError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import jwt from 'jsonwebtoken'
import authApiRequest from '@/apiRequests/auth'
import {
  DishStatus,
  DishStatusType,
  OrderStatus,
  OrderStatusType,
  TableStatus,
  TableStatusType
} from '@/constants/type'
import envConfig from '@/config'
import { TokenPayload } from '@/types/jwt.types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast.error(error?.payload?.message ?? 'Lỗi không xác định', {
      duration: duration ?? 3000,
      description: 'Lỗi không xác định'
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLocalStorage = () => {
  if (!isBrowser) return null
  return localStorage.getItem('accessToken')
}

export const getRefreshTokenFromLocalStorage = () => {
  if (!isBrowser) return null
  return localStorage.getItem('refreshToken')
}

export const setAccessTokenToLocalStorage = (token: string) => {
  if (!isBrowser) return
  localStorage.setItem('accessToken', token)
}

export const setRefreshTokenToLocalStorage = (token: string) => {
  if (!isBrowser) return
  localStorage.setItem('refreshToken', token)
}

export const removeTokensFromLocalStorage = () => {
  if (!isBrowser) return
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

let isRefreshing = false
export const checkAndRefreshToken = async (params?: { onSuccess?: () => void; onError?: () => void }) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()

  if (!accessToken || !refreshToken) return

  const decodedAccessToken = decodedToken(accessToken)
  const decodedRefreshToken = decodedToken(refreshToken)

  const now = Math.round(Date.now() / 1000)
  const remaining = decodedAccessToken.exp - now
  const tokenTTL = decodedAccessToken.exp - decodedAccessToken.iat

  // refresh token expired
  if (decodedRefreshToken.exp < now) {
    removeTokensFromLocalStorage()
    return params?.onError?.()
  }

  // access token is nearly expiry
  if (remaining < tokenTTL / 3 && !isRefreshing) {
    isRefreshing = true
    try {
      const result = await authApiRequest.refreshToken()
      const { accessToken, refreshToken } = result.payload.data
      setAccessTokenToLocalStorage(accessToken)
      setRefreshTokenToLocalStorage(refreshToken)
      params?.onSuccess?.()
    } catch {
      params?.onError?.()
    } finally {
      isRefreshing = false
    }
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getVietnameseDishStatus = (status: DishStatusType) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseOrderStatus = (status: OrderStatusType) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (status: TableStatusType) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}

export const decodedToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}
