import { Schema } from '@entities/Schema'
import { Transpiled } from '@entities/TranspiledCode'
import { useEffect, useState } from 'react'
import { transpile as originalTranspile } from '../../../../builder/pkg/builder'
import { convertSchemaToTranspileReady } from '@entities/TranspiledCode/utils'

type Props = {
    schema: Schema
    children: (arg: { transpiled: Transpiled | null }) => React.ReactNode
}

export const transpile = (schema: Schema): Transpiled => {
    const transpileReady = convertSchemaToTranspileReady(schema)
    const stringified = JSON.stringify([transpileReady], null, 2)
    return JSON.parse(originalTranspile(stringified))
}

export const TranspileSchema = ({ schema, children }: Props) => {
    const [transpiled, setTranspiled] = useState<Transpiled | null>(null)
    useEffect(() => {
        const result = transpile(schema)
        if (!result.erorrs?.length) setTranspiled(result)
    }, [schema])

    return <>{children({ transpiled })}</>
}
