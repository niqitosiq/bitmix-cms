import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Body, createPage, getPage } from './api'
import { Page } from './types'

const useGetPage = (id: string) => {
    return useQuery({
        queryKey: ['page', id],
        queryFn: () => getPage(id),
    })
}

const useCreatePage = (body: Body) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['page'],
        mutationFn: () => createPage(body),
        onSuccess: () => {
            queryClient.setQueryData(['pages'], (data: Page[]) => {
                return [...data, body]
            })
        },
    })
}

export { useGetPage, useCreatePage }
