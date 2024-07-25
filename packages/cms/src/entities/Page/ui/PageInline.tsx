import { useGetSitePages } from '@entities/Site'
import { Page } from '../types'
import { Card } from '@shared/ui/Card'
import { Button, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'

type Props = {
    id: Page['id']
    name: Page['name']
    url: Page['url']
    children: React.ReactNode
}

export const PageInline = ({ id, name, url, children }: Props) => {
    return (
        <Card>
            <Text size="md">{name}</Text>
            <Text>{url}</Text>

            {children}
        </Card>
    )
}
