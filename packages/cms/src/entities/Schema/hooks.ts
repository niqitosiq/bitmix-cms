import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    addVisiblePropToSchema,
    attachSchemaToSchema,
    createSchema,
    deleteSchema,
    deleteVisiblePropFromSchema,
    getSchema,
    pinPropToCustomFrame,
} from './api'
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

const useAttachSchema = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: attachSchemaToSchema,
        onSuccess: (_, {}) => {
            queryClient.invalidateQueries({
                queryKey: ['schema'],
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

const useAddVisiblePropToSchema = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addVisiblePropToSchema,
        onSuccess: (_, { schemaAlias }) => {
            queryClient.invalidateQueries({
                queryKey: ['schema'],
            })
        },
    })
}

const useDeleteVisiblePropFromSchema = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteVisiblePropFromSchema,
        onSuccess: (_, { schemaAlias }) => {
            queryClient.invalidateQueries({
                queryKey: ['schema'],
            })
        },
    })
}

const usePinPropToCustomFrame = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: pinPropToCustomFrame,
        onSuccess: (_, { schemaId }) => {
            queryClient.invalidateQueries({
                queryKey: ['schema'],
            })
        },
    })
}

export {
    useGetSchema,
    useCreateSchema,
    useDeleteSchema,
    useAddVisiblePropToSchema,
    useDeleteVisiblePropFromSchema,
    usePinPropToCustomFrame,
    useAttachSchema,
}
