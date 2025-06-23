import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { AppProvider } from '@/components/app-provider'

const fontSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Restro Restaurant',
  description: 'The best restaurant in the world'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <AppProvider>{children}</AppProvider>
          <Toaster position='top-right' duration={1000} />
        </ThemeProvider>
      </body>
    </html>
  )
}
