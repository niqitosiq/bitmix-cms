import { CleanSchema } from '@entities/Schema'
import { useGetMapOfCurrentSchema } from '@features/GetMapOfCurrentSchema/useGetMapOfCurrentSchema'
import { CodePosition } from '@shared/ui/CodePosition'
import { Loading } from '@shared/ui/Loading'
import { useTSManipulator } from '@shared/ui/TypescriptContext/Typescript'
import { useUpdateNodeInternals } from '@xyflow/react'
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

    const updateNodeInternals = useUpdateNodeInternals()

    const handler = () => {
        if (!currentSchema) return

        const completitions =
            manipulatorRef?.current?.languageService.getCompletionsAtPosition(
                'input.tsx',
                currentSchema?.map.component.supplemened + extraLength,
                {
                    includeExternalModuleExports: true,
                    includeInsertTextCompletions: true,
                }
            )

        const detailed = completitions?.entries.map((entry) => {
            return manipulatorRef?.current?.languageService.getCompletionEntryDetails(
                'input.tsx',
                currentSchema?.map.component.supplemened + extraLength,
                entry.name,
                {},
                entry.source,
                {},
                entry.data
            )
        })

        setProps(
            detailed
                ?.filter((p) => p && !IGNORED_PROPS.includes(p?.name))
                .map((p) => ({
                    name: p?.name,
                    type: p?.displayParts.map((p) => p.text).join(''),
                })) || []
        )

        Object.entries(currentSchema.map.component.props).map(
            ([name, value]) => {
                const existingEntries = manipulatorRef?.current?.languageService
                    .getQuickInfoAtPosition(
                        'input.tsx',
                        value[0] + extraLength - 2
                    )
                    ?.displayParts?.map((p) => p.text)
                    .join('')

                if (existingEntries)
                    setProps((prev) => [
                        ...prev,
                        { name, type: existingEntries },
                    ])
            }
        )

        setTimeout(() => {
            updateNodeInternals(schema.alias)
        }, 0)
    }

    useEffect(() => {
        if (isReady) handler()
    }, [schema, map, isReady, full])

    return (
        <>
            {!isReady && <Loading size="xs" />}
            {children({ props })}
        </>
    )
}
