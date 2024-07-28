import { Card, Group } from '@mantine/core'

type Props = {
    headerSlot?: React.ReactNode
    footerSlot?: React.ReactNode
    children?: React.ReactNode
}

export const NodeCard = ({ headerSlot, footerSlot, children }: Props) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>{headerSlot}</Card.Section>
            <Card.Section p="xs">
                <Group justify="space-between" mt="md" mb="xs">
                    {children}
                </Group>
            </Card.Section>
            <Card.Section>{footerSlot}</Card.Section>
        </Card>
    )
}
