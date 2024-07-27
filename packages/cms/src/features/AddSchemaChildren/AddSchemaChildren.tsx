import { Frame, useGetFrames } from '@entities/Frame'
import { FrameInline } from '@entities/Frame/ui/FrameInline'
import { Schema } from '@entities/Schema'
import { useCreateSchema, useGetSchema } from '@entities/Schema/hooks'
import { Button, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Loading } from '@shared/ui/Loading'

type Props = {
    id: Schema['id']
}

const FrameSelection = ({ onSelect }: { onSelect: (frame: Frame) => void }) => {
    const { data, isLoading } = useGetFrames()

    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {data?.map((frame) => (
                        <Button key={frame.id} onClick={() => onSelect(frame)}>
                            <FrameInline frame={frame} />
                        </Button>
                    ))}
                </>
            )}
        </div>
    )
}

export const AddSchemaChildren = ({ id }: Props) => {
    const [opened, { toggle, close }] = useDisclosure(false)

    const { mutate } = useCreateSchema()

    return (
        <>
            <Modal opened={opened} onClose={close} title="Frame Selection">
                <FrameSelection
                    onSelect={async (frame) => {
                        await mutate({ parentSchemaId: id, frameId: frame.id })
                        close()
                    }}
                />
            </Modal>
            <Button onClick={toggle}>Add Children</Button>
        </>
    )
}
