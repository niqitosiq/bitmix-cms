import { createContext, useContext, useEffect, useRef, useState } from 'react'
import ts from 'typescript'
import { VirtualTypeScriptEnvironment } from '@typescript/vfs'
import { createTypeScriptSandbox } from './utils'
import { Transpiled } from '@entities/TranspiledCode'

export type Manipulator = VirtualTypeScriptEnvironment

type TypescriptContextValue = {
    manipulatorRef?: React.MutableRefObject<Manipulator | null>
    isReady: boolean
    extraLength: number
    setExtraLength?: React.Dispatch<React.SetStateAction<number>>
    map: Transpiled['map'] | null
    setMap?: React.Dispatch<React.SetStateAction<Transpiled['map'] | null>>
    full: string
    setFull?: React.Dispatch<React.SetStateAction<string>>
}

const TypescriptContext = createContext<TypescriptContextValue>({
    isReady: false,
    extraLength: 0,
    map: null,
    full: '',
})

type Props = {
    children: React.ReactNode
}

export const TypescriptProvider = ({ children }: Props) => {
    const [isReady, setIsReady] = useState(false)
    const [extraLength, setExtraLength] = useState(0)
    const [map, setMap] = useState<Transpiled['map'] | null>(null)
    const [full, setFull] = useState<string>('')
    const manipulatorRef = useRef<Manipulator | null>(null)

    useEffect(() => {
        createTypeScriptSandbox({}, ts).then(
            (env: VirtualTypeScriptEnvironment) => {
                manipulatorRef.current = env
                setTimeout(() => setIsReady(true), 3000)
            }
        )
    }, [])

    return (
        <TypescriptContext.Provider
            value={{
                isReady,
                manipulatorRef,
                extraLength,
                setExtraLength,
                map,
                setMap,
                full,
                setFull,
            }}
        >
            {children}
        </TypescriptContext.Provider>
    )
}

export const useTSManipulator = (): TypescriptContextValue => {
    return useContext(TypescriptContext) || {}
}
