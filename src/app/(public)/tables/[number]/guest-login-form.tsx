'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GuestLoginBody, GuestLoginBodyType } from '@/schemaValidations/guest.schema'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useGuestLoginMutation } from '@/queries/useGuest'
import { generateSocketInstance, handleErrorApi } from '@/lib/utils'
import { useEffect } from 'react'
import { useAppStore } from '@/components/app-provider'

export default function GuestLoginForm() {
  const setRole = useAppStore((state) => state.setRole)
  const setSocket = useAppStore((state) => state.setSocket)
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const tableNumber = Number(params.number)
  const token = searchParams.get('token')

  const guestLoginMutation = useGuestLoginMutation()

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: '',
      token: token ?? '',
      tableNumber
    }
  })

  const onSubmit = async (data: GuestLoginBodyType) => {
    if (guestLoginMutation.isPending) return
    try {
      const res = await guestLoginMutation.mutateAsync(data)
      setRole(res.payload.data.guest.role)
      setSocket(generateSocketInstance(res.payload.data.accessToken))
      router.push('/guest/menu')
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  useEffect(() => {
    if (!token) router.push(`/`)
  }, [router, token])

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập gọi món</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='space-y-2 max-w-[600px] flex-shrink-0 w-full'
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='name'>Tên khách hàng</Label>
                      <Input id='name' type='text' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
