import { Text } from '@mantine/core'
import { CustomFrame, Frame } from '../types'

type Props = {
    frame: Frame | CustomFrame
}

export const FrameInline = ({ frame }: Props) => {
    return <Text size="xs">{frame.name}</Text>
}
