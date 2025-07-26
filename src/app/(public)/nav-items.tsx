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
import { useTranslations } from 'next-intl'

const menuItems: {
  title: string
  href: string
  hideWhenLogin?: boolean
  role?: RoleType[]
}[] = [
  {
    title: 'home',
    href: '/'
  },
  {
    title: 'menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'orders',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'login',
    href: '/login',
    hideWhenLogin: true
  },
  {
    title: 'manage',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations('NavItem')

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
              {t(item.title as any)}
            </Link>
          )
        }

        if (role && requiredRoles.includes(role)) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {t(item.title as any)}
            </Link>
          )
        }

        return null
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer, lg:hidden')}>{t('logout')}</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('logoutDialog.logoutQuestion')}</AlertDialogTitle>
              <AlertDialogDescription>{t('logoutDialog.logoutConfirm')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('logoutDialog.logoutConfirm')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>{t('logout')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
