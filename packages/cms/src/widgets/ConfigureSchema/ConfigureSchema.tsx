import { ChildrenArgumentPort } from '@entities/Frame/ui/ChildrenArgumentPort'
import { FrameInline } from '@entities/Frame/ui/FrameInline'
import { FramePropsDefenition } from '@entities/Frame/ui/FramePropsDefenition'
import { Prop } from '@entities/Prop'
import { PropIn } from '@entities/Prop/ui/PropIn'
import { Schema, SchemaNodeType } from '@entities/Schema'
import { useGetSchema } from '@entities/Schema/hooks'
import { SchemaTreeFlow } from '@entities/Schema/ui/SchemaTreeFlow'
import { AddSchemaChildren } from '@features/AddSchemaChildren'
import { ConnectSchemaNodes } from '@features/ConnectSchemaNodes'
import { DeleteSchema } from '@features/DeleteSchema/DeleteSchema'
import { GetAvailablePropsForFrame } from '@features/GetAvailablePropsForFrame'
import { TsProp } from '@features/GetAvailablePropsForFrame/GetAvailablePropsForFrame'
import { TranspileSchema } from '@features/TranspileSchema'
import { UpdatePropViaMockValue } from '@features/UpdatePropViaMockValue'
import { UpdateTSExecutable } from '@features/UpdateTSExecutable/UpdateTSExecutable'
import { Flex } from '@mantine/core'
import { Loading } from '@shared/ui/Loading'
import { NodeCard } from '@shared/ui/NodeCard'
import { TypescriptProvider } from '@shared/ui/TypescriptContext/Typescript'
import { Handle, NodeProps, Position, ReactFlow } from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { memo } from 'react'

const SchemaNode = ({ data }: NodeProps<SchemaNodeType>) => {
    return (
        <NodeCard
            headerSlot={
                <>
                    <Handle
                        id={'hierarchy'}
                        type="target"
                        position={Position.Top}
                        style={{ background: '#555' }}
                        onConnect={(params) =>
                            console.log('handle onConnect', params)
                        }
                        isConnectable={false}
                    />

                    <GetAvailablePropsForFrame schema={data}>
                        {({ props }) => (
                            <Flex justify={'space-around'}>
                                {[...(props || []), ...data.props]?.map(
                                    (prop: TsProp | Prop) => (
                                        <PropIn
                                            key={prop.name}
                                            name={prop.name}
                                            type={
                                                prop.type ||
                                                (prop as Prop).propValue?.type!
                                            }
                                            value={
                                                data.props.find(
                                                    (p) => p.name === prop.name
                                                )?.propValue?.value!
                                            }
                                            isConnectable
                                        >
                                            <UpdatePropViaMockValue
                                                name={prop.name}
                                                type={
                                                    prop.type ||
                                                    (prop as Prop).propValue
                                                        ?.type
                                                }
                                                schemaId={data.id}
                                                value={
                                                    data.props.find(
                                                        (p) =>
                                                            p.name === prop.name
                                                    )?.propValue
                                                }
                                            />
                                        </PropIn>
                                    )
                                )}
                            </Flex>
                        )}
                    </GetAvailablePropsForFrame>
                </>
            }
            footerSlot={
                <>
                    <FramePropsDefenition schema={data}>
                        {({ args }) => (
                            <>
                                <Handle
                                    id={'hierarchy'}
                                    type="source"
                                    position={Position.Bottom}
                                    style={{ background: '#555' }}
                                    onConnect={(params) =>
                                        console.log('handle onConnect', params)
                                    }
                                    isConnectable={false}
                                />
                                <Flex justify={'space-around'}>
                                    {args?.map((arg) => (
                                        <ChildrenArgumentPort
                                            key={arg.name}
                                            name={arg.name}
                                            type={arg.type}
                                            isConnectable
                                        />
                                    ))}
                                </Flex>
                                {args && <AddSchemaChildren id={data.id} />}
                            </>
                        )}
                    </FramePropsDefenition>
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
        <TypescriptProvider>
            <TranspileSchema schema={data!}>
                {({ transpiled }) => (
                    <UpdateTSExecutable
                        code={transpiled?.jsx}
                        map={transpiled?.map}
                        schema={data!}
                    >
                        <SchemaTreeFlow schema={data!}>
                            {({ nodes, edges }) => (
                                <ConnectSchemaNodes nodes={nodes} edges={edges}>
                                    {({ onConnect }) => (
                                        <div
                                            style={{
                                                height: '100vh',
                                                width: '100vw',
                                            }}
                                        >
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
                    </UpdateTSExecutable>
                )}
            </TranspileSchema>
        </TypescriptProvider>
    )
}
