import { Schema } from '@entities/Schema'
import { iterateOverChildrenSchemas } from '@entities/Schema/utils'
import { Transpiled } from '@entities/TranspiledCode'
import { Affix, Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTSManipulator } from '@shared/ui/TypescriptContext/Typescript'
import { useEffect } from 'react'

type Props = {
    code?: Transpiled['code']
    schema?: Schema
    children: React.ReactNode
    map?: Transpiled['map'] | null
}

export const UpdateTSExecutable = ({ code, map, schema, children }: Props) => {
    const [opened, { open, close }] = useDisclosure(false)

    const {
        manipulatorRef,
        isReady,
        setExtraLength,
        extraLength,
        setMap,
        setFull,
        full,
        ataRef,
    } = useTSManipulator()

    const handler = async () => {
        const uniqueTypes = new Map()

        if (schema) {
            uniqueTypes.set(schema.Frame?.name, schema.Frame?.type)
            iterateOverChildrenSchemas(schema, (schema) => {
                if (uniqueTypes.has(schema.Frame?.name)) return
                uniqueTypes.set(schema.Frame?.name, schema.Frame?.type)
            })
        }

        const framesTypeDefenition = `
            type Library = {
                ${Array.from(uniqueTypes.entries()).map(
                    ([name, type]) => `${name}: ${type}`
                )}
            }
        `

        const additionalDefenition = `
            type DebugComponent = (props: { id: string | undefined, children: React.ReactNode }) => React.ReactNode;
            const DebugComponent: DebugComponent = (window as any).DebugComponent;
            const library: Library = (window as any).library;
        `

        const allBefore =
            `${framesTypeDefenition}; ${additionalDefenition} const root = () => { return`.replace(
                /(\r\n|\n|\r|\t)/gm,
                ''
            )

        const fullDefenition = `${allBefore}${code}}`

        if (manipulatorRef?.current && code && isReady) {
            await ataRef?.current(fullDefenition)
            console.log('i just started to do all another!!')

            manipulatorRef?.current.updateFile('input.tsx', fullDefenition)
            if (setExtraLength) setExtraLength(allBefore.length - 2)
            if (setMap && map) setMap(map)
            if (setFull) setFull(fullDefenition)

            console.log(
                manipulatorRef.current.languageService.getSyntacticDiagnostics(
                    'input.tsx'
                ),
                manipulatorRef.current.languageService.getSemanticDiagnostics(
                    'input.tsx'
                )
            )
        }
    }
    useEffect(() => {
        handler()
    }, [isReady, code])

    return (
        <>
            {children}
            <Affix position={{ bottom: 20, right: 90 }}>
                <Button onClick={open}>Show TS Debug info</Button>
            </Affix>

            <Modal opened={opened} onClose={close} title="TS Debug info">
                ExtraLength: {extraLength}
                <p>Map: {JSON.stringify(map, null, 4)}</p>
                <p>fullDefenition: {full}</p>
            </Modal>
        </>
    )
}
