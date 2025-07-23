'use client'

import { AlertDialog, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/components/app-provider'

const menuItems: {
  title: string
  href: string
  hideWhenLogin?: boolean
  role?: RoleType[]
}[] = [
  {
    title: 'Trang chủ',
    href: '/'
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLogin: true
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const role = useAppStore((state) => state.role)
  const socket = useAppStore((state) => state.socket)
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)

  const logoutMutation = useLogoutMutation()
  const router = useRouter()
  const isLoggedIn = !!role

  const handleLogout = async () => {
    if (logoutMutation.isPending) return

    try {
      await logoutMutation.mutateAsync()
      setRole()
      socket?.disconnect()
      setSocket()
      router.push('/')
    } catch (error) {
      handleErrorApi({ error })
    }
  }
  return (
    <>
      {menuItems.map((item) => {
        const requiredRoles = item.role

        if (isLoggedIn && item.hideWhenLogin) return null

        if (!requiredRoles) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }

        if (role && requiredRoles.includes(role)) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }

        return null
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer, lg:hidden')}>Đăng xuất</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có muốn đăng xuất không?</AlertDialogTitle>
              <AlertDialogDescription>Hành động đăng xuất sẽ làm mất hoá đơn của bạn</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Thoát</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>Đăng xuất</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
