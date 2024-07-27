import { createContext, useContext, useEffect, useRef, useState } from 'react'
import ts from 'typescript'
import { VirtualTypeScriptEnvironment } from '@typescript/vfs'
import { createTypeScriptSandbox } from './utils'

export type Manipulator = VirtualTypeScriptEnvironment

type TypescriptContextValue = {
    manipulatorRef?: React.MutableRefObject<Manipulator | null>
    isReady: boolean
}

const TypescriptContext = createContext<TypescriptContextValue>({
    isReady: false,
})

type Props = {
    children: React.ReactNode
}

export const TypescriptProvider = ({ children }: Props) => {
    const [isReady, setIsReady] = useState(false)
    const manipulatorRef = useRef<Manipulator | null>(null)

    useEffect(() => {
        createTypeScriptSandbox({}, ts).then(
            (env: VirtualTypeScriptEnvironment) => {
                manipulatorRef.current = env
                setIsReady(true)
            }
        )
    }, [])

    return (
        <TypescriptContext.Provider value={{ isReady, manipulatorRef }}>
            {children}
        </TypescriptContext.Provider>
    )
}

export const useTSManipulator = (): TypescriptContextValue => {
    return useContext(TypescriptContext) || {}
}
