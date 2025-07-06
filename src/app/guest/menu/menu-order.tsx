'use client'

import Quantity from '@/app/guest/menu/quantity'
import { Button } from '@/components/ui/button'
import { DishStatus } from '@/constants/type'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import { useGetDishListQuery } from '@/queries/useDish'
import { useGuestOrderMutation } from '@/queries/useGuest'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

export default function MenuOrder() {
  const { data } = useGetDishListQuery()
  const dishes = useMemo(() => data?.payload.data || [], [data])

  const guestOrderMutation = useGuestOrderMutation()
  const router = useRouter()

  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])

  const totalOrders = useMemo(() => orders.reduce((total, order) => total + order.quantity, 0), [orders])
  const totalPrice = useMemo(
    () =>
      dishes.reduce((total, dish) => {
        const order = orders.find((order) => order.dishId === dish.id)
        if (order) {
          return total + order.quantity * dish.price
        }
        return total
      }, 0),
    [dishes, orders]
  )

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId)
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }]
      }
      const newOrders = [...prevOrders]
      newOrders[index] = { ...newOrders[index], quantity }
      return newOrders
    })
  }

  const handleOrder = async () => {
    if (guestOrderMutation.isPending) return
    try {
      await guestOrderMutation.mutateAsync(orders)
      setOrders([])
      router.push('/guest/orders')
    } catch (error) {
      handleErrorApi({
        error
      })
    }
  }

  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn('flex gap-4', dish.status === DishStatus.Unavailable && 'pointer-events-none')}
          >
            <div className='flex-shrink-0 relative'>
              {dish.status === DishStatus.Unavailable && (
                <span className='absolute inset-0 items-center justify-center flex text-white text-sm text-shadow-lg'>
                  Hết hàng
                </span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className='object-cover w-[80px] h-[80px] rounded-md'
              />
            </div>
            <div className='space-y-1'>
              <h3 className='text-sm'>{dish.name}</h3>
              <p className='text-xs'>{dish.description}</p>
              <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
            </div>
            <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
              <Quantity
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={orders.find((order) => order.dishId === dish.id)?.quantity || 0}
              />
            </div>
          </div>
        ))}
      <div className='sticky bottom-0'>
        <Button
          className='w-full justify-between'
          disabled={orders.length === 0 || guestOrderMutation.isPending}
          onClick={handleOrder}
        >
          <span>Đặt hàng · {totalOrders} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  )
}
