import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProp, updatePropToSchema } from './api'
import { Schema } from '@entities/Schema'
import { UpdatePropsToSchemaBody } from '@api/src/controllers/schemaController'
import { Prop } from './types'

const useUpdatePropInSchema = (
    id: Schema['id'],
    body: UpdatePropsToSchemaBody
) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['prop', { id }],
        mutationFn: () => updatePropToSchema(id, body),
        onSuccess: (updated) => {
            queryClient.setQueryData(['prop', { id }], updated)
        },
    })
}

const useGetProp = (id: Prop['id'], schemaId: Schema['id']) => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: ['prop', { id }],
        queryFn: () => getProp(id),
        initialData: () => {
            return queryClient.getQueryData(['schema', { id: schemaId }])
        },
    })
}

export { useUpdatePropInSchema, useGetProp }
