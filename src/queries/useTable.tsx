import tableApiRequest from '@/apiRequests/table'
import { UpdateTableBodyType } from '@/schemaValidations/table.schema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useGetTableListQuery() {
  return useQuery({
    queryKey: ['tables'],
    queryFn: tableApiRequest.list
  })
}

export function useGetTableQuery({ number }: { number: number }) {
  return useQuery({
    queryKey: ['tables', number],
    queryFn: () => tableApiRequest.getTable(number),
    enabled: Boolean(number)
  })
}

export function useAddTableMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.addTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    }
  })
}

export function useUpdateTableMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ number, body }: { number: number; body: UpdateTableBodyType }) =>
      tableApiRequest.updateTable(number, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'], exact: true })
    }
  })
}

export function useDeleteTableMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    }
  })
}
