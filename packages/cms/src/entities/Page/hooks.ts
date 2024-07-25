import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPage, getPage } from './api'

const useGetPage = (id: string) => {
    return useQuery({
        queryKey: ['page', id],
        queryFn: () => getPage(id),
    })
}

const useCreatePage = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ['page'],
        mutationFn: createPage,
        onSuccess: (body) => {
            console.log(body)

            queryClient.invalidateQueries({
                queryKey: ['site', { siteId: body.siteId }],
            })
        },
    })
}

export { useGetPage, useCreatePage }
