import { Site, useDeleteSite } from '@entities/Site'
import { Button } from '@mantine/core'

type Props = {
    id: Site['id']
}
export const DeleteSite = ({ id }: Props) => {
    const { mutate } = useDeleteSite()

    return <Button onClick={() => mutate(id)}>Delete Site</Button>
}
