import { Schema } from '@entities/Schema'
import { useDeleteSchema } from '@entities/Schema/hooks'
import { ActionIcon, Button } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

type Props = {
    id: Schema['id']
}
export const DeleteSchema = ({ id }: Props) => {
    const { mutate } = useDeleteSchema()
    return (
        <ActionIcon variant="filled" onClick={() => mutate(id)} size={'xs'}>
            <IconTrash />
        </ActionIcon>
    )
}
