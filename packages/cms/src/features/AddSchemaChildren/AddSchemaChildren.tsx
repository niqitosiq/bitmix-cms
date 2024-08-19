import {
    CustomFrame,
    Frame,
    useGetCustomFrames,
    useGetFrames,
} from '@entities/Frame'
import { FrameInline } from '@entities/Frame/ui/FrameInline'
import { Schema } from '@entities/Schema'
import {
    useAttachSchema,
    useCreateSchema,
    useGetSchema,
} from '@entities/Schema/hooks'
import { Button, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Loading } from '@shared/ui/Loading'
import { IconPlus } from '@tabler/icons-react'

type Props = {
    id: Schema['id']
}

const FrameSelection = ({
    onSelect,
    onCustomSelect,
}: {
    onSelect: (frame: Frame) => void
    onCustomSelect: (frame: CustomFrame) => void
}) => {
    const { data, isLoading } = useGetFrames()
    const { data: customFrames } = useGetCustomFrames()

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
                    {customFrames?.map((schema) => (
                        <Button
                            key={schema.id}
                            onClick={() => onCustomSelect(schema)}
                        >
                            <FrameInline frame={schema} />
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
    const { mutate: attach } = useAttachSchema()

    return (
        <>
            <Modal opened={opened} onClose={close} title="Frame Selection">
                <FrameSelection
                    onSelect={async (frame) => {
                        await mutate({ parentSchemaId: id, frameId: frame.id })
                        close()
                    }}
                    onCustomSelect={async (schema) => {
                        await attach({
                            childSchemaId: schema.schemaId!,
                            parentSchemaId: id,
                        })
                        close()
                    }}
                />
            </Modal>
            <Button onClick={toggle} size="compact-xs" w={'100%'}>
                Children <IconPlus width="15px" height="15px" />
            </Button>
        </>
    )
}
