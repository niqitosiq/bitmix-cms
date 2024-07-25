import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Stack } from '@mantine/core'
import { CreateSite } from '@features/CreateSite'
import { useDeleteSite, useGetSites } from '@entities/Site'
import { SiteInline } from '@entities/Site/ui/SiteInline'
import { Card } from '@shared/ui/Card'
import { DeleteSite } from '@features/DeleteSite'
import { ShowSitePageDetailed } from '@features/ShowSitePageDetailed/ShowSitePageDetailed'
import { CreatePageForSite } from '@features/CreatePageForSite'

export const SiteList = () => {
    const { data } = useGetSites()
    return (
        <Card>
            <Stack>
                {data?.map((site) => (
                    <SiteInline id={site.id} name={site.name} key={site.id}>
                        <DeleteSite id={site.id} />

                        <ShowSitePageDetailed siteId={site.id}>
                            <CreatePageForSite siteId={site.id} />
                        </ShowSitePageDetailed>
                    </SiteInline>
                ))}

                <CreateSite />
            </Stack>
        </Card>
    )
}
