import dishApiRequest from '@/apiRequests/dish'
import Modal from '@/app/(public)/@modal/(.)dishes/[id]/modal'
import DishDetail from '@/app/(public)/dishes/[id]/dish-detail'
import { wrapServerApi } from '@/lib/utils'

export default async function DishPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { id } = params

  const data = await wrapServerApi(() => dishApiRequest.getDish(Number(id)))

  const dish = data?.payload?.data
  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  )
}
