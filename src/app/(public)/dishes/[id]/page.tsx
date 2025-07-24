import dishApiRequest from '@/apiRequests/dish'
import { formatCurrency, wrapServerApi } from '@/lib/utils'
import Image from 'next/image'

export default async function DishPage({ params }: { params: { id: string } }) {
  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(params.id)))
  const dish = data?.payload?.data

  if (!dish) return <div>Món ăn không tồn tại</div>

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl lg:text-3xl font-semibold'>{dish.name}</h1>
      <p className='font-semibold'>Giá: {formatCurrency(dish.price)}</p>
      <div className='flex-shrink-0'>
        <Image
          src={dish.image}
          className='object-cover w-[400px] h-[400px] max-w-[1080px] max-h-[1080px] rounded-md'
          width={400}
          height={400}
          alt={dish.name}
        />
      </div>
      <p>{dish.description}</p>
    </div>
  )
}
