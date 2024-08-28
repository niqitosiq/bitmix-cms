import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Stack, Table, TableData, Group } from '@mantine/core'
import { CreateSite } from '@features/CreateSite'
import { useDeleteSite, useGetSites } from '@entities/Site'
import { SiteInline } from '@entities/Site/ui/SiteInline'
import { Card } from '@shared/ui/Card'
import { DeleteSite } from '@features/DeleteSite'
import { ShowSitePageDetailed } from '@features/ShowSitePageDetailed/ShowSitePageDetailed'
import { CreatePageForSite } from '@features/CreatePageForSite'
import { IconPlus } from '@tabler/icons-react'

export const SiteList = () => {
    const { data } = useGetSites()
    const icon = <IconPlus />
    const rows = data?.map((site) => (
        <Table.Tr key={site.id}>
            <Table.Td>{site.name}</Table.Td>
            <Table.Td>
                Описание
            </Table.Td>
            <Table.Td>
                <Group justify='flex-start'>
                    <Button rightSection={icon} size='md'>Open</Button>
                    <DeleteSite id={site.id} />
                </Group>
            </Table.Td>
        </Table.Tr>
    ))

    return (
        <Table captionSide='bottom' horizontalSpacing='xl'>
            <Table.Thead>
                <Table.Th>Name</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Action</Table.Th>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
            <Table.Caption >
                <CreateSite />
            </Table.Caption>
        </Table>
    )
}