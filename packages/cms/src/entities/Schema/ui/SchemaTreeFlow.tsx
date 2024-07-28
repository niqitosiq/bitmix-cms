import { useEffect } from 'react'
import { Schema, SchemaNodeType } from '../types'
import dagre from '@dagrejs/dagre'
import { Edge, useEdgesState, useNodesState } from '@xyflow/react'
import { getCleanSchema, iterateOverChildrenSchemas } from '../utils'
import { useTSManipulator } from '@shared/ui/TypescriptContext/Typescript'

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

        iterateOverChildrenSchemas(schema, (schema, parentSchema) => {
            initalNodes.push({
                id: `${schema.alias}`,
                position: { x: 0, y: 0 },
                data: getCleanSchema(schema),
                type: 'schema',
            })
            initialEdges.push({
                id: `${parentSchema.alias}-${schema.alias}`,
                source: `${parentSchema.alias}`,
                target: `${schema.alias}`,
                animated: true,
            })
            schema.props.forEach((prop) => {
                if (prop.propValue?.schemaReferenceAlias && isReady) {
                    console.log(prop.propValue)

                    initialEdges.push({
                        id: `${schema.alias}-${prop.propValue.schemaReferenceAlias}-${prop.name}`,
                        source: `${prop.propValue.schemaReferenceAlias}-${prop.propValue.schemaReferenceField}`,
                        target: `${schema.alias}-${prop.name}`,
                        type: 'step',
                        // animated: true,
                    })
                }
            })
        })

        const layouted = getLayoutedElements(initalNodes, initialEdges)

        console.log(layouted)
        return layouted
    }

    useEffect(() => {
        const layouted = onUpdate()

        if (!isReady) {
            setNodes([...layouted.nodes])
            setEdges([...layouted.edges])
        } else {
            setNodes([...layouted.nodes])
            setTimeout(() => setEdges([...layouted.edges]), 15000)
        }
    }, [schema, isReady, full])

    console.log(nodes, edges)

    return <>{children({ nodes, edges, onUpdate })}</>
}
