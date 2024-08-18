import { useGetCustomFrames, useGetFrames } from '@entities/Frame'
import { FrameInline } from '@entities/Frame/ui/FrameInline'
import { CreateCustomFrame } from '@features/CreateCustomFrame'
import { Link } from '@tanstack/react-router'

export const ComponentList = () => {
    const { data: frames } = useGetFrames()
    const { data: customFrames } = useGetCustomFrames()

    return (
        <div>
            Components:
            {frames?.map((f) => <FrameInline frame={f} key={f.id} />)}
            {customFrames?.map((f) => (
                <Link
                    key={f.id}
                    to="/frames/$frameId/edit"
                    params={{ frameId: f.id }}
                >
                    <FrameInline frame={f} />
                </Link>
            ))}
            <CreateCustomFrame />
        </div>
    )
}
