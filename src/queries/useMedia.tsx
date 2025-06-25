import mediaApiRequest from '@/apiRequests/media'
import { useMutation } from '@tanstack/react-query'

export function useUploadMediaMutation() {
  return useMutation({
    mutationFn: mediaApiRequest.uploadImage
  })
}
