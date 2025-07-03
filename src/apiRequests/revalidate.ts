import http from '@/lib/http'

const revalidateTagApiRequest = {
  revalidateTag: (tag: string) =>
    http.get(`/api/revalidate?tag=${tag}`, {
      baseUrl: ''
    })
}

export default revalidateTagApiRequest
