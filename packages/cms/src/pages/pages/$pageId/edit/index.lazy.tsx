import { PageInline } from '@entities/Page'
import { useGetPage } from '@entities/Page/hooks'
import { useGetSchema } from '@entities/Schema/hooks'
import { Loading } from '@shared/ui/Loading'
import { createLazyFileRoute } from '@tanstack/react-router'
import { ConfigureSchema } from '@widgets/ConfigureSchema'
import { RenderedSchema } from '@widgets/RenderedSchema'

const PageEditor = () => {
    const { pageId } = Route.useParams()

    const { data: page, isLoading: pageLoading } = useGetPage(pageId)
    const { data: schema, isLoading: schemaLoading } = useGetSchema(
        page?.Schema.id
    )

    if (pageLoading || schemaLoading) {
        return <Loading />
    }

    return (
        <div>
            {page && (
                <PageInline
                    id={parseInt(pageId)}
                    name={page.name}
                    url={page.url}
                />
            )}

            <RenderedSchema id={page?.Schema.id!} />
            <ConfigureSchema id={page?.Schema.id!} />
        </div>
    )
}

export const Route = createLazyFileRoute('/pages/$pageId/edit/')({
    component: PageEditor,
})
