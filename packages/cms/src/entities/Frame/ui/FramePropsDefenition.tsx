import { CleanSchema } from '@entities/Schema'
import { useGetMapOfCurrentSchema } from '@features/GetMapOfCurrentSchema/useGetMapOfCurrentSchema'
import { Loading } from '@shared/ui/Loading'
import { useTSManipulator } from '@shared/ui/TypescriptContext/Typescript'
import { useUpdateNodeInternals } from '@xyflow/react'
import { useEffect, useState } from 'react'
import ts, { QuickInfo } from 'typescript'

export type Props = {
    schema: CleanSchema
    children: (arg: { args?: ChildrenArg[] | null }) => React.ReactNode
}

export type ChildrenArg = {
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

    const fieldsAndItTypes: ChildrenArg[] = []

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
    const [args, setArgs] = useState<ChildrenArg[] | null>(null)

    const { manipulatorRef, extraLength, map, full, isReady } =
        useTSManipulator()

    const { currentSchema } = useGetMapOfCurrentSchema({ schema })

    const updateNodeInternals = useUpdateNodeInternals()
    const handler = () => {
        if (!currentSchema) return

        if (
            currentSchema?.map.component.children_params &&
            currentSchema?.map.component.children_params.length === 0
        )
            return

        updateNodeInternals(schema.alias)

        const sourceFile = manipulatorRef?.current?.languageService
            .getProgram()
            ?.getSourceFile('input.tsx')
        const checker = manipulatorRef?.current?.languageService
            .getProgram()
            ?.getTypeChecker()

        function findNodeAtPosition(
            sourceFile: ts.SourceFile,
            position: number
        ): ts.Node | undefined {
            function find(node: ts.Node): ts.Node | undefined {
                if (position >= node.getStart() && position < node.getEnd()) {
                    return ts.forEachChild(node, find) || node
                }
                return undefined
            }
            return find(sourceFile)
        }

        const node = findNodeAtPosition(
            sourceFile!,
            currentSchema?.map.component.children_params[1]! + extraLength - 2
        )
        function getResolvedType(type: ts.Type, checker: ts.TypeChecker) {
            if (!type.symbol?.declarations) return null

            const symbol = checker.getSymbolAtLocation(
                type.symbol.declarations[0]
            )
            if (symbol?.declarations) {
                const typeOfSymbol = checker.getTypeOfSymbolAtLocation(
                    symbol,
                    symbol.declarations[0]
                )
                return typeOfSymbol
            }
            return type
        }

        if (node && checker) {
            const type = checker.getTypeAtLocation(node)

            const resolvedType = getResolvedType(type, checker)
            setArgs(
                resolvedType?.getProperties().map((prop) => {
                    const propType = checker.getTypeOfSymbolAtLocation(
                        prop,
                        node
                    )
                    return {
                        name: prop.getName(),
                        type: checker.typeToString(propType),
                    }
                }) || null
            )
        }
    }

    useEffect(() => {
        if (isReady) handler()
    }, [isReady, schema, map, full])

    return (
        <>
            {!isReady && <Loading size="xs" />}
            {children({ args })}
        </>
    )
}
