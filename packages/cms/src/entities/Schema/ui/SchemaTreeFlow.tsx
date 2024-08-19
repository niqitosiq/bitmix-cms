import { useEffect } from 'react'
import { Schema, SchemaNodeType } from '../types'
import { Edge, useEdgesState, useNodesState } from '@xyflow/react'
import { getCleanSchema, iterateOverChildrenSchemas } from '../utils'
import { useTSManipulator } from '@shared/ui/TypescriptContext'
import dagre from '@dagrejs/dagre'

type Props = {
    schema: Schema
    hideCustom: Boolean
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

export const SchemaTreeFlow = ({ schema, children, hideCustom }: Props) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<SchemaNodeType>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

    const { isReady, full } = useTSManipulator()

    const onUpdate = () => {
        const initalNodes: SchemaNodeType[] = [
            {
                id: `${schema.alias}`,
                position: { x: 0, y: 0 },
                data: getCleanSchema(schema),
                type: 'schema',
            },
        ]
        const initialEdges: Edge[] = []

        iterateOverChildrenSchemas(
            schema,
            (schema, parentSchema) => {
                initalNodes.push({
                    id: `${schema.alias}`,
                    position: { x: 0, y: 0 },
                    data: getCleanSchema(schema),
                    type: 'schema',
                    zIndex: 1,
                })
                initialEdges.push({
                    id: `${parentSchema.alias}-${schema.alias}`,
                    source: `${parentSchema.alias}`,
                    sourceHandle: 'hierarchy',
                    targetHandle: 'hierarchy',
                    target: `${schema.alias}`,
                })
                schema.props.forEach((prop) => {
                    if (prop.propValue?.schemaReferenceAlias && isReady) {
                        initialEdges.push({
                            id: `${schema.alias}-${prop.propValue.schemaReferenceAlias}-${prop.name}`,
                            sourceHandle: `${prop.propValue.schemaReferenceAlias}-${prop.propValue.schemaReferenceField}`,
                            targetHandle: `${schema.alias}-${prop.name}`,
                            source: `${prop.propValue.schemaReferenceAlias}`,
                            target: `${schema.alias}`,
                            zIndex: 1000,
                            type: 'step',
                            animated: true,
                        })
                    }
                })
            },
            (_, schema) => hideCustom && schema.Frame?.name === 'Frame'
        )

        const layouted = getLayoutedElements(initalNodes, initialEdges)

        return layouted
    }

    useEffect(() => {
        const layouted = onUpdate()

        setNodes([...layouted.nodes])
        setEdges([...layouted.edges])
    }, [schema, isReady, full])

    return <>{children({ nodes, edges, onUpdate })}</>
}
