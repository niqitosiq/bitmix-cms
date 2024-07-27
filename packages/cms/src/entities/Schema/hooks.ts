import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSchema, deleteSchema, getSchema } from './api'
import { Schema } from './types'
import { Page } from '@entities/Page'

const useGetSchema = (schemaId?: Schema['id']) => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: ['schema', { id: schemaId }],
        enabled: !!schemaId,
        queryFn: () => getSchema(schemaId!),
        initialData: () => {
            const pages = queryClient.getQueryData(['page'])
            if (!pages) return

            const pageWithSchema = (pages as Page & { Schema: Schema }[]).find(
                (page) => page.Schema.id === schemaId
            )

            if (pageWithSchema) {
                return pageWithSchema.Schema
            }
        },
    })
}

const useCreateSchema = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createSchema,
        onSuccess: (_, { pageId, parentSchemaId }) => {
            if (parentSchemaId)
                queryClient.invalidateQueries({
                    queryKey: ['schema'],
                })
            if (pageId)
                queryClient.invalidateQueries({
                    queryKey: ['page', { id: pageId }],
                })
        },
    })
}

const useDeleteSchema = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteSchema,
        onSuccess: (_, schemaId) => {
            queryClient.invalidateQueries({
                queryKey: ['schema'],
            })
        },
    })
}

export { useGetSchema, useCreateSchema, useDeleteSchema }
