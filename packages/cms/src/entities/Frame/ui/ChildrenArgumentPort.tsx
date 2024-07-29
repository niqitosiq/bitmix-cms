import { Schema } from '@entities/Schema'
import { ActionIcon, Flex, Text, TooltipFloating } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
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
                position={Position.Bottom}
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

                    <TooltipFloating label={`${type}`} position="top">
                        <ActionIcon
                            size={'xs'}
                            style={{ pointerEvents: 'all', zIndex: 10 }}
                        >
                            <IconInfoCircle></IconInfoCircle>
                        </ActionIcon>
                    </TooltipFloating>
                </Flex>
            </Handle>
        )
    }
)
