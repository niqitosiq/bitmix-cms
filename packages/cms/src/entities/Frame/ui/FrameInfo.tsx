import { Text } from '@mantine/core'
import { Frame } from '../types'

type Props = {
    frame: Frame
}

export const FrameInfo = ({ frame }: Props) => {
    return (
        <>
            <Text size="sm">{frame.name}</Text>
            <Text size="xs">{frame.description}</Text>
        </>
    )
}
