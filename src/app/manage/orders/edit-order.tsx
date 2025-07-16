'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UpdateOrderBody, UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { getVietnameseOrderStatus, handleErrorApi } from '@/lib/utils'
import { OrderStatus, OrderStatusValues } from '@/constants/type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DishesDialog } from '@/app/manage/orders/dishes-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'
import { DishListResType } from '@/schemaValidations/dish.schema'
import { useGetOrderDetailQuery, useUpdateOrderMutation } from '@/queries/useOrder'
import { toast } from 'sonner'

export default function EditOrder({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const { data } = useGetOrderDetailQuery({ orderId: id as number })
  const updateOrderMutation = useUpdateOrderMutation()

  const [selectedDish, setSelectedDish] = useState<DishListResType['data'][0] | null>(null)

  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody),
    defaultValues: {
      status: OrderStatus.Pending,
      dishId: 0,
      quantity: 1
    }
  })

  const onReset = () => {
    setId(undefined)
  }

  const onSubmit = async (values: UpdateOrderBodyType) => {
    if (updateOrderMutation.isPending) return
    try {
      const result = await updateOrderMutation.mutateAsync({
        orderId: id as number,
        body: values
      })
      toast.success(result.payload.message)
      onReset()
      onSubmitSuccess?.()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  useEffect(() => {
    if (data) {
      const { dishSnapshot, status, quantity } = data.payload.data
      setSelectedDish(dishSnapshot)
      form.reset({
        status,
        quantity,
        dishId: dishSnapshot.dishId || 0
      })
    }
  }, [data, form])

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          onReset()
        }
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto' aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Cập nhật đơn hàng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='edit-order-form'
            onSubmit={form.handleSubmit(onSubmit, console.log)}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='dishId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-4 items-center justify-items-start gap-4'>
                    <FormLabel>Món ăn</FormLabel>
                    <div className='flex items-center col-span-2 space-x-4'>
                      <Avatar className='aspect-square w-[50px] h-[50px] rounded-md object-cover'>
                        <AvatarImage src={selectedDish?.image} />
                        <AvatarFallback className='rounded-none'>{selectedDish?.name}</AvatarFallback>
                      </Avatar>
                      <div>{selectedDish?.name}</div>
                    </div>

                    <DishesDialog
                      onChoose={(dish) => {
                        field.onChange(dish.id)
                        setSelectedDish(dish)
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='quantity'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='quantity'>Số lượng</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='quantity'
                          inputMode='numeric'
                          pattern='[0-9]*'
                          className='w-16 text-center'
                          {...field}
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value
                            const numberValue = Number(value)
                            if (isNaN(numberValue)) {
                              return
                            }
                            field.onChange(numberValue)
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl className='col-span-3'>
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Trạng thái' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OrderStatusValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              {getVietnameseOrderStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-order-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
