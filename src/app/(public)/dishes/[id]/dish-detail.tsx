import { formatCurrency } from '@/lib/utils'
import { DishResType } from '@/schemaValidations/dish.schema'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export default async function DishDetail({ dish }: { dish: DishResType['data'] | undefined }) {
  const t = await getTranslations('DishDetail')
  if (!dish)
    return (
      <div>
        <h1 className='text-2xl lg:text-3xl font-semibold'>{t('notFound')}</h1>
      </div>
    )

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl lg:text-3xl font-semibold'>{dish.name}</h1>
      <p className='font-semibold'>Giá: {formatCurrency(dish.price)}</p>
      <div className='flex-shrink-0'>
        <Image
          src={dish.image}
          className='object-cover w-full h-full max-w-[1080px] max-h-[1080px] rounded-md'
          width={1080}
          height={1080}
          alt={dish.name}
        />
      </div>
      <p>{dish.description}</p>
    </div>
  )
}
