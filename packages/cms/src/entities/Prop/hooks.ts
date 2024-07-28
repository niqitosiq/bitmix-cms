import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProp, updatePropToSchema } from './api'
import { Schema } from '@entities/Schema'
import { UpdatePropsToSchemaBody } from '@api/src/controllers/schemaController'
import { Prop } from './types'

const useUpdatePropInSchema = (id: Schema['id']) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['prop', { id }],
        mutationFn: updatePropToSchema,
        onSuccess: (updated) => {
            queryClient.invalidateQueries({
                queryKey: ['prop', { id }],
            })
            queryClient.invalidateQueries({
                queryKey: ['schema', { id: updated.schemaId }],
            })
            queryClient.invalidateQueries({
                queryKey: ['schema'],
            })
        },
    })
}

const useGetProp = (schemaId: Schema['id'], id?: Prop['id']) => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: ['prop', { id }],
        enabled: !!id,
        queryFn: () => getProp(id!),
        initialData: () => {
            return queryClient.getQueryData(['schema', { id: schemaId }])
        },
    })
}

export { useUpdatePropInSchema, useGetProp }
