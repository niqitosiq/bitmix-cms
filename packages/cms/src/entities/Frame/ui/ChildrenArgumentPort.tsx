import { ActionIcon, Text, TooltipFloating } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { Handle, Position } from '@xyflow/react'
import { memo } from 'react'

type Props = {
    isConnectable: boolean
    name?: string
    type?: string
}

export const ChildrenArgumentPort = memo(
    ({ isConnectable, name, type }: Props) => {
        return (
            <Handle
                id={name}
                type="source"
                position={Position.Top}
                onConnect={(params) => console.log('handle onConnect', params)}
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
