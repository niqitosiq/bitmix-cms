import { SchemaNodeType } from '@entities/Schema'
import { Edge } from '@xyflow/react'
import { useCallback } from 'react'

type Props = {
    nodes: SchemaNodeType[]
    edges: Edge[]
    children: (props: { onConnect: () => void }) => JSX.Element
}

export const ConnectSchemaNodes = ({ nodes, edges, children }: Props) => {
    const onConnect = useCallback(() => {}, [])

    return <>{children({ onConnect })}</>
}
