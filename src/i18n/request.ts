import { locales } from '@/i18n/config'
import { getUserLocale } from '@/services/locale'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = (await getUserLocale()) as (typeof locales)[number]

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
