import { Handle, Position } from '@xyflow/react'
import { memo } from 'react'

type Props = {
    isConnectable: boolean
}

export const ChildrenArgumentPort = memo(({ isConnectable }: Props) => {
    return (
        <div>
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
        </div>
    )
})
