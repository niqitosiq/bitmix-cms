import { CleanSchema } from '@entities/Schema'
import { useGetMapOfCurrentSchema } from '@features/GetMapOfCurrentSchema/useGetMapOfCurrentSchema'
import { useTSManipulator } from '@shared/ui/TypescriptContext/Typescript'
import { useEffect, useState } from 'react'

type Props = {
    schema: CleanSchema
    children: (arg: { props?: TsProp[] }) => React.ReactNode
}

const IGNORED_PROPS = ['key', 'children']
// todo move to entity
export type TsProp = {
    name: string | undefined
    type: string | undefined
}
export const GetAvailablePropsForFrame = ({ schema, children }: Props) => {
    const [props, setProps] = useState<TsProp[]>([])
    const { manipulatorRef, map, extraLength, isReady, full } =
        useTSManipulator()

    const { currentSchema } = useGetMapOfCurrentSchema({ schema })

    const handler = () => {
        if (!currentSchema) return

        const completitions =
            manipulatorRef?.current?.languageService.getCompletionsAtPosition(
                'input.tsx',
                currentSchema?.map.component.supplemened + extraLength - 2,
                {
                    includeExternalModuleExports: true,
                    includeInsertTextCompletions: true,
                }
            )

        const detailed = completitions?.entries.slice(0, 15).map((entry) => {
            return manipulatorRef?.current?.languageService.getCompletionEntryDetails(
                'input.tsx',
                currentSchema?.map.component.supplemened + extraLength - 2,
                entry.name,
                {},
                entry.source,
                {},
                entry.data
            )
        })

        if (detailed)
            setProps(
                detailed
                    ?.filter((p) => p && !IGNORED_PROPS.includes(p?.name))
                    .map((p) => ({
                        name: p?.name,
                        type: p?.displayParts.map((p) => p.text).join(''),
                    }))
            )
    }

    useEffect(() => {
        if (isReady) handler()
    }, [schema, map, isReady, full])

    return <>{children({ props })}</>
}
