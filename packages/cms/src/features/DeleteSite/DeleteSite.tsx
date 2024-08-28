import { Site, useDeleteSite } from '@entities/Site'
import { ActionIcon, Button } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

type Props = {
    id: Site['id']
}
export const DeleteSite = ({ id }: Props) => {
    const { mutate } = useDeleteSite()
    const icon = <IconTrash />

    return <ActionIcon onClick={() => mutate(id)} color='red' variant='filled' aria-label='Delete' size='xl'>
        <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
    </ActionIcon>
}
