import { CleanSchema } from '@entities/Schema'
import { useGetMapOfCurrentSchema } from '@features/GetMapOfCurrentSchema/useGetMapOfCurrentSchema'
import { useTSManipulator } from '@shared/ui/TypescriptContext/Typescript'
import { useEffect, useState } from 'react'
import { QuickInfo } from 'typescript'

export type Props = {
    schema: CleanSchema
    children: (arg: { args?: Arg[] | null }) => React.ReactNode
}

type Arg = {
    name: string
    type: string
}

const getTsQuickInfoMeaningful = (displayParts: QuickInfo['displayParts']) => {
    if (!displayParts) return null
    const firstKeyword = displayParts.find((p) => p.kind === 'keyword')

    if (firstKeyword?.text === 'any') return null

    const deepTypeStartsAt = displayParts.findIndex(
        (p) => p.kind === 'punctuation' && p.text === '{'
    )

    const deepType = displayParts.slice(deepTypeStartsAt)

    const fieldsAndItTypes: Arg[] = []

    deepType.forEach((part, index) => {
        if (part.kind === 'punctuation' && part.text === ':') {
            const name = deepType[index - 1].text
            const after = deepType.slice(index + 2)
            const type = after
                .slice(
                    0,
                    after.findIndex(
                        (p) => p.kind === 'punctuation' && p.text === ','
                    )
                )
                .map((p) => p.text)
                .join('')
            fieldsAndItTypes.push({ name, type })
        }
    })

    return fieldsAndItTypes
}

export const FramePropsDefenition = ({ schema, children }: Props) => {
    const [args, setArgs] = useState<Arg[] | null>(null)

    const { manipulatorRef, extraLength, map, full, isReady } =
        useTSManipulator()

    const { currentSchema } = useGetMapOfCurrentSchema({ schema })

    const handler = () => {
        if (!currentSchema) return

        if (
            currentSchema?.map.component.children_params &&
            currentSchema?.map.component.children_params.length === 0
        )
            return

        const childrenArgs =
            manipulatorRef?.current?.languageService.getQuickInfoAtPosition(
                'input.tsx',
                currentSchema?.map.component.children_params[1]! +
                    extraLength -
                    2
            )

        if (!childrenArgs) return

        const args = getTsQuickInfoMeaningful(childrenArgs.displayParts)
        console.log(args)

        setArgs(args)
    }

    useEffect(() => {
        if (isReady) handler()
    }, [isReady, schema, map, full])

    return <>{children({ args })}</>
}
