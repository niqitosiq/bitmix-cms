import { FrameChildrenDefinition } from '@entities/Frame/ui/FrameChildrenDefinition'
import { FrameInline } from '@entities/Frame/ui/FrameInline'
import { FramePropsDefenition } from '@entities/Frame/ui/FramePropsDefenition'
import { PropIn } from '@entities/Prop/ui/PropIn'
import { Schema } from '@entities/Schema'
import { useGetSchema } from '@entities/Schema/hooks'
import { SchemaTreeFlow } from '@entities/Schema/ui/SchemaTreeFlow'
import { AddSchemaChildren } from '@features/AddSchemaChildren'
import { ConnectSchemaNodes } from '@features/ConnectSchemaNodes'
import { Loading } from '@shared/ui/Loading'
import { NodeCard } from '@shared/ui/NodeCard'
import { Node, NodeProps, ReactFlow } from '@xyflow/react'

export type SchemaNodeType = Node<{}, 'schema'>

const SchemaNode = (props: NodeProps<SchemaNodeType>) => {
    return (
        <NodeCard
            headerSlot={
                <FramePropsDefenition frame={frame}>
                    {({ name, defenition }) => (
                        <PropIn
                            name={name}
                            defenition={defenition}
                            value={props.data.props['name']}
                        />
                    )}
                </FramePropsDefenition>
            }
            footerSlot={
                <>
                    <FrameChildrenDefinition>
                        {({ name, defenition }) => (
                            <PropOut name={name} defenition={defenition} />
                        )}
                    </FrameChildrenDefinition>
                    <AddSchemaChildren />
                </>
            }
        >
            <FrameInline />
        </NodeCard>
    )
}

type Props = {
    id: Schema['id']
}

const nodeTypes = {
    schemaNode: SchemaNode,
}

export const ConfigureSchema = ({ id }: Props) => {
    const { data, isLoading } = useGetSchema(id)

    if (isLoading) {
        return <Loading />
    }

    return (
        <SchemaTreeFlow schema={data}>
            {({ nodes, edges }) => (
                <ConnectSchemaNodes nodes={nodes} edges={edges}>
                    {({ onConnect }) => (
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            fitView
                        />
                    )}
                </ConnectSchemaNodes>
            )}
        </SchemaTreeFlow>
    )
}
