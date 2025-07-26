import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { AppProvider } from '@/components/app-provider'
import { getLocale } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

const fontSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Restro Restaurant',
  description: 'The best restaurant in the world'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <NextIntlClientProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <AppProvider>{children}</AppProvider>
            <Toaster position='top-right' duration={3000} visibleToasts={1} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
