import { Badge, CardSection, Group, Text } from '@mantine/core'
import type { Site } from '../types'
import { Card } from '@shared/ui/Card'

type Props = {
    id: Site['id']
    name: Site['name']
    children: React.ReactNode
}

export const SiteInline = ({ name, id, children }: Props) => {
    return (
        <Card>
            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{name}</Text>
                <Badge color="gray">#{id}</Badge>
            </Group>

            <Group>{children}</Group>
        </Card>
    )
}
