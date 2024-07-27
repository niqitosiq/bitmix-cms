import { Transpiled } from '@entities/TranspiledCode'
import { useTSManipulator } from '@shared/ui/TypescriptContext/Typescript'
import { useEffect } from 'react'

type Props = {
    code?: Transpiled['code']
    children: React.ReactNode
}

export const UpdateTSExecutable = ({ code, children }: Props) => {
    const { manipulatorRef, isReady } = useTSManipulator()

    useEffect(() => {
        if (isReady && manipulatorRef?.current && code) {
            manipulatorRef?.current.updateFile('input.tsx', code)
        }
    }, [isReady])

    return <>{children}</>
}
