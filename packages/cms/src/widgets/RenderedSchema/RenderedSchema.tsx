import { Schema } from '@entities/Schema'
import { useGetSchema } from '@entities/Schema/hooks'
import { transpile } from '@features/TranspileSchema/TranspileSchema'
import { DebugComponent } from '@shared/ui/DebugComponent'
import React, { useEffect, useRef, useState } from 'react'
import { library } from '../../../library/library'

type Props = {
    id: Schema['id']
}
export const RenderedSchema = ({ id }: Props) => {
    const [render, setRender] = useState(true)
    const renderedRef = useRef<React.ReactNode | null>(null)
    const { data } = useGetSchema(id)

    const transpiled = data && transpile(data)

    const handler = async () => {
        if (!transpiled) return

        const { code } = transpiled

        try {
            const F = new Function(`
                return function getRoot(React, DebugComponent, library) { 
                  return () => { return ${code} }
                }`)

            renderedRef.current = F()(React, DebugComponent, library)()
            setRender((r) => !r)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        handler()
    }, [data])

    if (!transpiled) return

    return (
        <div className="p-4 bg-slate-600 h-full">
            <div className="bg-white">{renderedRef.current}</div>
        </div>
    )
}
