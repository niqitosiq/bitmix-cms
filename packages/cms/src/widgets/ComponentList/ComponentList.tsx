import { useGetCustomFrames, useGetFrames } from '@entities/Frame'
import { FrameInline } from '@entities/Frame/ui/FrameInline'
import { CreateCustomFrame } from '@features/CreateCustomFrame'
import { Link } from '@tanstack/react-router'

export const ComponentList = () => {
    const { data: frames } = useGetFrames()
    const { data: customFrames } = useGetCustomFrames()

    return (
        <div>
            
        </div>
    )
}
