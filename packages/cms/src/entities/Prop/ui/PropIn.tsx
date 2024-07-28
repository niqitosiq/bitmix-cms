import { ActionIcon, Flex, Text, Tooltip, TooltipFloating } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import { Handle, Position } from '@xyflow/react'
import { memo } from 'react'

type Props = {
    isConnectable: boolean
    name?: string
    type?: string
    value?: string
    children?: React.ReactNode
}

export const PropIn = memo(
    ({ isConnectable, value, name, type, children }: Props) => {
        return (
            <Handle
                id={name}
                type="target"
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
                <TooltipFloating
                    label={`${type}; Value = ${value}`}
                    position="top"
                >
                    <Flex
                        align={'center'}
                        gap={5}
                        style={{ pointerEvents: 'none' }}
                    >
                        <Text size="xs" style={{ pointerEvents: 'auto' }}>
                            {name}
                        </Text>

                        {children}
                    </Flex>
                </TooltipFloating>
            </Handle>
        )
    }
)
