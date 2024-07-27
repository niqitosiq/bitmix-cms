import { Card } from '@mantine/core'

type Props = {
    headerSlot?: React.ReactNode
    footerSlot?: React.ReactNode
    children?: React.ReactNode
}

export const NodeCard = ({ headerSlot, footerSlot, children }: Props) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>{headerSlot}</Card.Section>
            <Card.Section>{children}</Card.Section>
            <Card.Section>{footerSlot}</Card.Section>
        </Card>
    )
}
