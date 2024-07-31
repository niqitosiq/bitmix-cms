import { useGetFrames } from '@entities/Frame'
import { FrameInline } from '@entities/Frame/ui/FrameInline'

export const ComponentList = () => {
    const { data } = useGetFrames()

    return (
        <div>
            Components:
            {data?.map((f) => <FrameInline frame={f} key={f.id} />)}
        </div>
    )
}
