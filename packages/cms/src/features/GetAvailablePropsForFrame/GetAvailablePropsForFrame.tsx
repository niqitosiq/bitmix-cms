import { CleanSchema } from '@entities/Schema'
import { useGetMapOfCurrentSchema } from '@features/GetMapOfCurrentSchema/useGetMapOfCurrentSchema'
import { CodePosition } from '@shared/ui/CodePosition'
import { Loading } from '@shared/ui/Loading'
import {
    findNodeAtPosition,
    getResolvedType,
} from '@shared/ui/TypescriptContext'
import { useTSManipulator } from '@shared/ui/TypescriptContext/Typescript'
import { useUpdateNodeInternals } from '@xyflow/react'
import { useEffect, useState } from 'react'
import ts from 'typescript'

type Props = {
    schema: CleanSchema
    children: (arg: { props: TsProp[] }) => React.ReactNode
}

const IGNORED_PROPS = ['children']
// todo move to entity
export type TsProp = {
    name: string | undefined
    type: string | undefined
}

const getPlainType = (parts: ts.SymbolDisplayPart[] | undefined) => {
    const propertyIndex = parts?.findIndex((p) => p.kind === 'propertyName')

    if (!parts || !propertyIndex) return 'any'

    return parts
        ?.slice(propertyIndex + 1)
        .map((p) => p.text)
        .join('')
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

        const sourceFile = manipulatorRef?.current?.languageService
            .getProgram()
            ?.getSourceFile('input.tsx')
        const checker = manipulatorRef?.current?.languageService
            .getProgram()
            ?.getTypeChecker()

        const node = findNodeAtPosition(
            sourceFile!,
            currentSchema?.map.component.own[1]! + extraLength - 2
        )
        if (node && checker) {
            const type = checker.getTypeAtLocation(node)

            const resolvedType = getResolvedType(type, checker)

            if (!resolvedType) return

            const callDeclarations = resolvedType
                .getCallSignatures()[0]
                .getParameters()[0]
                .getDeclarations()

            if (!callDeclarations) return

            const resolvedChildren = checker.getTypeOfSymbolAtLocation(
                resolvedType.getCallSignatures()[0].getParameters()[0],
                callDeclarations[0]
            )

            const properties = resolvedChildren
                .getProperties()
                .map((property) => {
                    if (!property.getDeclarations()) return

                    return {
                        name: property.getName(),
                        type: checker.typeToString(
                            checker.getTypeOfSymbolAtLocation(
                                property,
                                property.getDeclarations()![0]
                            )
                        ),
                    }
                })

            setProps(properties.filter((p) => !!p))
        }

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
