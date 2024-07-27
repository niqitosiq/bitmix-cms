import { FrameInline } from '@entities/Frame/ui/FrameInline'
import { ChildrenArgumentPort } from '@entities/Frame/ui/PropOut'
import { PropIn } from '@entities/Prop/ui/PropIn'
import { Schema, SchemaNodeType } from '@entities/Schema'
import { useGetSchema } from '@entities/Schema/hooks'
import { SchemaTreeFlow } from '@entities/Schema/ui/SchemaTreeFlow'
import { AddSchemaChildren } from '@features/AddSchemaChildren'
import { ConnectSchemaNodes } from '@features/ConnectSchemaNodes'
import { DeleteSchema } from '@features/DeleteSchema/DeleteSchema'
import { Loading } from '@shared/ui/Loading'
import { NodeCard } from '@shared/ui/NodeCard'
import { NodeProps, ReactFlow } from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { memo } from 'react'
const SchemaNode = ({ data }: NodeProps<SchemaNodeType>) => {
    return (
        <NodeCard
            headerSlot={
                <>
                    <PropIn isConnectable />
                </>
                // <FramePropsDefenition frame={frame}>
                //     {({ name, defenition }) => (
                //         <PropIn
                //             name={name}
                //             defenition={defenition}
                //             value={props.data.props['name']}
                //         />
                //     )}
                // </FramePropsDefenition>
            }
            footerSlot={
                <>
                    <AddSchemaChildren id={data.id} />
                    <ChildrenArgumentPort isConnectable />
                    {/* <FrameChildrenDefinition>
                        {({ name, defenition }) => (
                        )}
                    </FrameChildrenDefinition>
                    <AddSchemaChildren /> */}
                </>
            }
        >
            <FrameInline frame={data.Frame!} />
            <DeleteSchema id={data.id} />
        </NodeCard>
    )
}

type Props = {
    id: Schema['id']
}

const nodeTypes = {
    schema: memo(SchemaNode),
}

export const ConfigureSchema = ({ id }: Props) => {
    const { data, isLoading } = useGetSchema(id)

    if (isLoading) {
        return <Loading />
    }

    return (
        <SchemaTreeFlow schema={data!}>
            {({ nodes, edges }) => (
                <ConnectSchemaNodes nodes={nodes} edges={edges}>
                    {({ onConnect }) => (
                        <div style={{ height: '100vh', width: '100vw' }}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onConnect={onConnect}
                                nodeTypes={nodeTypes}
                                fitView
                            />
                        </div>
                    )}
                </ConnectSchemaNodes>
            )}
        </SchemaTreeFlow>
    )
}
