'use client'

import { useAppContext } from '@/components/app-provider'
import { Badge } from '@/components/ui/badge'
import { OrderStatus, OrderStatusType } from '@/constants/type'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { useGuestGetOrderListQuery } from '@/queries/useGuest'
import { PayGuestOrdersResType, UpdateOrderResType } from '@/schemaValidations/order.schema'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'

export default function OrdersCart() {
  const { socket } = useAppContext()
  const { data, refetch } = useGuestGetOrderListQuery()
  const orders = useMemo(() => data?.payload.data || [], [data])

  const { pendingOrders, paidOrders } = useMemo(() => {
    return orders.reduce(
      (total, order) => {
        if (
          [OrderStatus.Delivered, OrderStatus.Processing, OrderStatus.Pending].includes(
            order.status as Exclude<OrderStatusType, 'Paid' | 'Rejected'>
          )
        ) {
          return {
            ...total,
            pendingOrders: {
              price: total.pendingOrders.price + order.quantity * order.dishSnapshot.price,
              quantity: total.pendingOrders.quantity + order.quantity
            }
          }
        }
        if (order.status === OrderStatus.Paid) {
          return {
            ...total,
            paidOrders: {
              price: total.paidOrders.price + order.quantity * order.dishSnapshot.price,
              quantity: total.paidOrders.quantity + order.quantity
            }
          }
        }
        return total
      },
      {
        pendingOrders: {
          price: 0,
          quantity: 0
        },
        paidOrders: {
          price: 0,
          quantity: 0
        }
      }
    )
  }, [orders])

  useEffect(() => {
    if (socket?.connected) {
      onConnect()
    }
    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('socket disconnected')
    }

    function onUpdateOrder(data: UpdateOrderResType['data']) {
      const { name } = data.dishSnapshot
      toast.success(
        `Món ${name} (SL: ${data.quantity}) đã được cập nhật sang trạng thái ${getVietnameseOrderStatus(data.status)}`
      )
      refetch()
    }

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0]
      toast.success(` Khách hàng ${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công`)
      refetch()
    }

    socket?.on('update-order', onUpdateOrder)
    socket?.on('payment', onPayment)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('update-order', onUpdateOrder)
      socket?.off('payment', onPayment)
    }
  }, [refetch, socket])

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className='flex gap-4'>
          <div className='text-sm font-semibold'>{index + 1}</div>
          <div className='flex-shrink-0 relative'>
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              priority
              className='object-cover w-[80px] h-[80px] rounded-md'
            />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
            <p className='text-xs font-semibold'>
              {formatCurrency(order.dishSnapshot.price)} x {order.quantity}
            </p>
          </div>
          <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
            <Badge variant='outline'>{getVietnameseOrderStatus(order.status)}</Badge>
          </div>
        </div>
      ))}
      {paidOrders.quantity > 0 && (
        <div className='sticky bottom-0'>
          <div className='w-full justify-between flex space-x-4 text-xl font-semibold'>
            <span>Đơn đã thanh toán · {paidOrders.quantity} món</span>
            <span>{formatCurrency(paidOrders.price)}</span>
          </div>
        </div>
      )}
      {pendingOrders.quantity > 0 && (
        <div className='sticky bottom-0'>
          <div className='w-full justify-between flex space-x-4 text-xl font-semibold'>
            <span>Đơn chưa thanh toán · {pendingOrders.quantity} món</span>
            <span>{formatCurrency(pendingOrders.price)}</span>
          </div>
        </div>
      )}
    </>
  )
}
