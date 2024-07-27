import { useEffect, useState } from 'react'
import { CleanSchema, Schema, SchemaNodeType } from '../types'
import dagre from '@dagrejs/dagre'
import { Edge, useEdgesState, useNodesState } from '@xyflow/react'

type Props = {
    schema: Schema
    children: (props: {
        nodes: SchemaNodeType[]
        edges: Edge[]
        onUpdate: () => void
    }) => JSX.Element
}

const getCleanSchema = (schema: Schema): CleanSchema => {
    return {
        id: schema['id'],
        schema: schema['frameId'],
        parentSchemaId: schema['parentSchemaId'],
        updatedAt: schema['updatedAt'],
        Frame: schema['Frame'],
    }
}

const iterateOverChildrenSchemas = (
    schema: Schema,
    handler: (schema: Schema, parentSchema: Schema) => void
) => {
    if (schema.ChildrenSchema && schema.ChildrenSchema.length) {
        schema.ChildrenSchema.forEach((childSchema) => {
            handler(childSchema, schema)
            iterateOverChildrenSchemas(childSchema, handler)
        })
    }
}

const nodeWidth = 200
const nodeHeight = 100

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
