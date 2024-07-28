import { ActionIcon, Flex, Text, Tooltip, TooltipFloating } from '@mantine/core'
import { IconEdit, IconInfoCircle } from '@tabler/icons-react'
import { Handle, Position, OnConnect } from '@xyflow/react'
import { memo } from 'react'
import { Prop } from '../types'
import { Schema } from '@entities/Schema'

type Props = {
    isConnectable: boolean
    name?: string
    type?: string
    value?: Prop['propValue']
    children?: React.ReactNode
    onConnect: OnConnect
    schemaAlias: Schema['alias']
}

export const PropIn = memo(
    ({
        isConnectable,
        schemaAlias,
        onConnect,
        value,
        name,
        type,
        children,
    }: Props) => {
        return (
            <Handle
                id={`${schemaAlias}-${name}`}
                type="target"
                position={Position.Top}
                onConnect={onConnect}
                isConnectable={true}
                style={{
                    position: 'static',
                    background: 'var(--mantine-primary-color-light-hover)',
                    width: 'auto',
                    height: 'auto',
                    padding: '5px',
                    borderRadius: '5px',
                    border: 0,
                    transform: 'none',
                }}
            >
                <Flex
                    align={'center'}
                    gap={5}
                    style={{ pointerEvents: 'none' }}
                >
                    <Text size="xs" style={{ pointerEvents: 'none' }}>
                        {name}
                    </Text>

                    <TooltipFloating
                        label={`${type}; Value = ${value?.value}`}
                        position="top"
                    >
                        <ActionIcon
                            size={'xs'}
                            style={{ pointerEvents: 'all', zIndex: 10 }}
                        >
                            <IconInfoCircle></IconInfoCircle>
                        </ActionIcon>
                    </TooltipFloating>

                    {children}
                </Flex>
            </Handle>
        )
    }
)
