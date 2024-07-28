import { CleanSchema } from '@entities/Schema'
import { useTSManipulator } from '@shared/ui/TypescriptContext/Typescript'
import { useMemo } from 'react'

type Args = {
    schema: CleanSchema
}
export const useGetMapOfCurrentSchema = ({ schema }: Args) => {
    const { map } = useTSManipulator()
    const currentSchema = useMemo(
        () => map?.find((element) => element.id === schema.alias),
        [map, schema.alias]
    )

    return { currentSchema }
}
