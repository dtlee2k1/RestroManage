'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUploadMediaMutation } from '@/queries/useMedia'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAccountMeQuery, useUpdateMeMutation } from '@/queries/useAccount'
import { toast } from 'sonner'
import { handleErrorApi } from '@/lib/utils'

export default function UpdateProfileForm() {
  const { data, refetch } = useAccountMeQuery()
  const uploadMedia = useUploadMediaMutation()
  const updateMe = useUpdateMeMutation()
  const [file, setFile] = useState<File | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: undefined
    }
  })

  const avatar = form.watch('avatar')
  const name = form.watch('name')
  const previewAvatar = useMemo(() => {
    return file ? URL.createObjectURL(file) : avatar
  }, [file, avatar])

  const onReset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (values: UpdateMeBodyType) => {
    if (updateMe.isPending) return

    try {
      let avatarUrl = values.avatar
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await uploadMedia.mutateAsync(formData)
        avatarUrl = uploadRes.payload.data
      }

      const result = await updateMe.mutateAsync({
        ...values,
        avatar: avatarUrl
      })
      toast.success(result.payload.message)
      refetch()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  useEffect(() => {
    if (data) {
      const { name, avatar } = data.payload.data

      form.reset({
        name,
        avatar: avatar || undefined
      })
    }
  }, [data, form])

  return (
    <Form {...form}>
      <form
        noValidate
        className='grid auto-rows-max items-start gap-4 md:gap-8'
        onReset={onReset}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card x-chunk='dashboard-07-chunk-0'>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='avatar'
                render={() => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar
                        className='aspect-square w-[100px] h-[100px] rounded-md object-cover cursor-pointer'
                        onClick={() => {
                          if (avatarInputRef.current) avatarInputRef.current.click()
                        }}
                      >
                        <AvatarImage src={previewAvatar} />
                        <AvatarFallback className='rounded-none'>{name}</AvatarFallback>
                      </Avatar>
                      <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setFile(file)
                        }}
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed cursor-pointer'
                        type='button'
                        onClick={() => {
                          if (avatarInputRef.current) avatarInputRef.current.click()
                        }}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='name'>Tên</Label>
                      <Input id='name' type='text' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button size='sm' type='submit'>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
