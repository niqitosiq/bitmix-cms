import { Schema } from '@entities/Schema'
import { ActionIcon, Text, TooltipFloating } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { Handle, OnConnect, Position } from '@xyflow/react'
import { memo } from 'react'

type Props = {
    isConnectable: boolean
    name?: string
    onConnect: OnConnect
    type?: string
    schemaAlias: Schema['alias']
}

export const ChildrenArgumentPort = memo(
    ({ isConnectable, onConnect, schemaAlias, name, type }: Props) => {
        return (
            <Handle
                id={`${schemaAlias}-${name}`}
                type="source"
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
                <TooltipFloating label={type} position="top">
                    <Text size="xs" style={{ pointerEvents: 'none' }}>
                        {name}
                    </Text>
                </TooltipFloating>
            </Handle>
        )
    }
)
