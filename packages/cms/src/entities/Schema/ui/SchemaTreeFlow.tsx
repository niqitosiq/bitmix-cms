import { useEffect } from 'react'
import { Schema, SchemaNodeType } from '../types'
import dagre from '@dagrejs/dagre'
import { Edge, useEdgesState, useNodesState } from '@xyflow/react'
import { getCleanSchema, iterateOverChildrenSchemas } from '../utils'

type Props = {
    schema: Schema
    children: (props: {
        nodes: SchemaNodeType[]
        edges: Edge[]
        onUpdate: () => void
    }) => JSX.Element
}

const nodeWidth = 150
const nodeHeight = 150

const getLayoutedElements = (
    nodes: SchemaNodeType[],
    edges: Edge[],
    direction = 'TB'
) => {
    const dagreGraph = new dagre.graphlib.Graph()
    dagreGraph.setDefaultEdgeLabel(() => ({}))

    dagreGraph.setGraph({ rankdir: direction })

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    })

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id)
        const newNode = {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        }

        return newNode
    })

    return { nodes: newNodes, edges }
}

export const SchemaTreeFlow = ({ schema, children }: Props) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<SchemaNodeType>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

    const onUpdate = () => {
        const initalNodes: SchemaNodeType[] = [
            {
                id: `${schema.id}`,
                position: { x: 0, y: 0 },
                data: getCleanSchema(schema),
                type: 'schema',
            },
        ]
        const initialEdges: Edge[] = []

        iterateOverChildrenSchemas(schema, (schema, parentSchema) => {
            initalNodes.push({
                id: `${schema.id}`,
                position: { x: 0, y: 0 },
                data: getCleanSchema(schema),
                type: 'schema',
            })
            initialEdges.push({
                id: `${parentSchema.id}-${schema.id}`,
                source: `${parentSchema.id}`,
                target: `${schema.id}`,
                animated: true,
            })
        })

        const layouted = getLayoutedElements(initalNodes, initialEdges)

        setNodes(layouted.nodes)
        setEdges(layouted.edges)
    }

    useEffect(() => {
        onUpdate()
    }, [schema])

    return <>{children({ nodes, edges, onUpdate })}</>
}
