import { Text } from '@mantine/core'
import { Frame } from '../types'

type Props = {
    frame: Frame
}

export const FrameInline = ({ frame }: Props) => {
    return <Text size="xs">{frame.name}</Text>
}
