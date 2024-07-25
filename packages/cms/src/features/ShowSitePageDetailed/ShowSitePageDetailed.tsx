import { PageInline } from '@entities/Page'
import { Site, useGetSitePages } from '@entities/Site'
import { Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link } from '@tanstack/react-router'

type Props = {
    siteId: Site['id']
    children: React.ReactNode
}

export const ShowSitePageDetailed = ({ siteId, children }: Props) => {
    const [visible, { toggle }] = useDisclosure()
    const { data } = useGetSitePages(siteId)
    return (
        <div>
            <Button onClick={toggle}>{visible ? 'Hide' : 'Show'} Pages</Button>
            {visible && (
                <>
                    {data?.Pages.map((page) => (
                        <PageInline
                            id={page.id}
                            name={page.name}
                            url={page.url}
                            key={page.id}
                        >
                            <Link to={`/pages/${page.id}/edit`}>
                                <Button>Edit</Button>
                            </Link>
                        </PageInline>
                    ))}

                    {children}
                </>
            )}
        </div>
    )
}
