import { Loader, MantineSize } from '@mantine/core'

type Props = {
    size?: MantineSize
}

export const Loading = ({ size }: Props) => {
    return <Loader color="blue" size={size} />
}
