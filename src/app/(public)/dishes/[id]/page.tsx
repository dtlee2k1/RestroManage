import dishApiRequest from '@/apiRequests/dish'
import DishDetail from '@/app/(public)/dishes/[id]/dish-detail'
import { wrapServerApi } from '@/lib/utils'
import { cache } from 'react'

const getDetail = cache((id: number) => wrapServerApi(() => dishApiRequest.getDish(id)))

export default async function DishPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { id } = params

  const data = await getDetail(Number(id))

  const dish = data?.payload?.data
  return <DishDetail dish={dish} />
}
