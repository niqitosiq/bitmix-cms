import { ChildrenArgumentPort } from '@entities/Frame/ui/ChildrenArgumentPort'
import { FrameInline } from '@entities/Frame/ui/FrameInline'
import { FramePropsDefenition } from '@entities/Frame/ui/FramePropsDefenition'
import { Prop, useUpdatePropInSchema } from '@entities/Prop'
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
import { ButtonEdge } from '@shared/ui/ButtonEdge'
import { Loading } from '@shared/ui/Loading'
import { NodeCard } from '@shared/ui/NodeCard'
import {
    TypescriptProvider,
    useTSManipulator,
} from '@shared/ui/TypescriptContext/Typescript'
import {
    Connection,
    Handle,
    NodeProps,
    Position,
    ReactFlow,
    useUpdateNodeInternals,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { memo, useEffect } from 'react'

const SchemaNode = ({ data }: NodeProps<SchemaNodeType>) => {
    const { mutate } = useUpdatePropInSchema(data.id)
    const onConnect = (params: Connection, type?: TsProp['type']) => {
        console.log(params)
        mutate({
            schemaAlias: params.targetHandle!.split('-')[0],
            body: {
                name: params.targetHandle!.split('-')[1],
                type,
                reference: {
                    schemaAlias: params.sourceHandle!.split('-')[0],
                    fieldName: params.sourceHandle!.split('-')[1],
                },
            },
        })
    }

    const { full } = useTSManipulator()

    const updateNodeInternals = useUpdateNodeInternals()
    useEffect(() => {
        setTimeout(() => {
            console.log('data.alias', data.alias)
            updateNodeInternals(data.alias)
        }, 15000)
    }, [full])

    return (
        <NodeCard
            headerSlot={
                <>
                    <Handle
                        id={'hierarchy'}
                        type="target"
                        position={Position.Top}
                    />

                    <GetAvailablePropsForFrame schema={data}>
                        {({ props }) => (
                            <Flex justify={'space-around'}>
                                {[...(props || []), ...data.props]?.map(
                                    (prop: TsProp | Prop) => {
                                        const value = data.props.find(
                                            (p) => p.name === prop.name
                                        )?.propValue

                                        return (
                                            <PropIn
                                                key={prop.name}
                                                name={prop.name}
                                                type={prop.type}
                                                schemaAlias={data.alias}
                                                value={value}
                                                onConnect={(params) =>
                                                    onConnect(params, prop.type)
                                                }
                                                isConnectable
                                            >
                                                <UpdatePropViaMockValue
                                                    name={prop.name}
                                                    type={prop.type}
                                                    schemaId={data.id}
                                                    value={value}
                                                />
                                            </PropIn>
                                        )
                                    }
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
                                />
                                <Flex justify={'space-around'}>
                                    {args?.map((arg) => (
                                        <ChildrenArgumentPort
                                            onConnect={(params) =>
                                                onConnect(params)
                                            }
                                            schemaAlias={data.alias}
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

const edgeTypes = {
    prop: ButtonEdge,
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
                                            {JSON.stringify(edges)}
                                            <ReactFlow
                                                nodes={nodes}
                                                edges={edges}
                                                onConnect={onConnect}
                                                nodeTypes={nodeTypes}
                                                edgeTypes={edgeTypes}
                                                fitView
                                                onEdgesChange={(a) => {
                                                    console.log(
                                                        'onEdgesChange',
                                                        a
                                                    )
                                                }}
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
