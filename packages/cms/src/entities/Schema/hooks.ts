import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSchema } from './api'
import { Schema } from './types'
import { Page } from '@entities/Page'

const useGetSchema = (schemaId: Schema['id']) => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: ['schema'],
        queryFn: () => getSchema(schemaId),
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

export { useGetSchema }
