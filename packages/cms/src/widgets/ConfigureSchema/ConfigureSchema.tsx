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
import { ManageSchemaVisibleProps } from '@features/ManageSchemaVisibleProps'
import { PinPropValue } from '@features/PinPropValue'
import { TranspileSchema } from '@features/TranspileSchema'
import { UpdatePropViaMockValue } from '@features/UpdatePropViaMockValue'
import { UpdateTSExecutable } from '@features/UpdateTSExecutable/UpdateTSExecutable'
import { Badge, Flex, Text } from '@mantine/core'
import { ButtonEdge } from '@shared/ui/ButtonEdge'
import { Loading } from '@shared/ui/Loading'
import { NodeCard } from '@shared/ui/NodeCard'
import { TypescriptProvider } from '@shared/ui/TypescriptContext/Typescript'
import {
    Connection,
    Handle,
    NodeProps,
    Position,
    ReactFlow,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'
import { memo } from 'react'

const SchemaNode = ({ data }: NodeProps<SchemaNodeType>) => {
    const { mutate } = useUpdatePropInSchema(data.id)
    const onConnect = (params: Connection, type?: TsProp['type']) => {
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
                            <Flex justify={'space-around'} align={'center'}>
                                <ManageSchemaVisibleProps
                                    schema={data}
                                    args={props}
                                >
                                    {({ selectedArgs }) =>
                                        selectedArgs?.map(
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
                                                            onConnect(
                                                                params,
                                                                prop.type
                                                            )
                                                        }
                                                        isConnectable
                                                    >
                                                        <UpdatePropViaMockValue
                                                            name={prop.name}
                                                            type={prop.type}
                                                            schemaId={data.id}
                                                            value={value}
                                                        />
                                                        <PinPropValue
                                                            propName={prop.name}
                                                            propType={prop.type}
                                                            schemaId={data.id}
                                                        />
                                                    </PropIn>
                                                )
                                            }
                                        )
                                    }
                                </ManageSchemaVisibleProps>
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
            <Flex
                direction={'column'}
                align={'center'}
                w={'100%'}
                bd={'1px solid #ccc'}
            >
                <Badge size="xs" color="gray">
                    {data.alias}
                </Badge>
                <Flex justify={'space-between'} w={'100%'} p={'xs'} gap={'10'}>
                    <FrameInline frame={data.Frame!} />
                    <DeleteSchema id={data.id} />
                </Flex>
            </Flex>
        </NodeCard>
    )
}

type Props = {
    id: Schema['id']
    hideCustom?: boolean
}

const nodeTypes = {
    schema: memo(SchemaNode),
}

const edgeTypes = {
    prop: memo(ButtonEdge),
}

export const ConfigureSchema = ({ id, hideCustom = false }: Props) => {
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
                        <SchemaTreeFlow schema={data!} hideCustom={hideCustom}>
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
                                                edgeTypes={edgeTypes}
                                                fitView
                                                onEdgesChange={(a) => {}}
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
