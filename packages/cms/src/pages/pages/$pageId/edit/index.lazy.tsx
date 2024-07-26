import { PageInline } from '@entities/Page'
import { useGetPage } from '@entities/Page/hooks'
import { useGetSchema } from '@entities/Schema/hooks'
import { createLazyFileRoute } from '@tanstack/react-router'

const PageEditor = () => {
    const { pageId } = Route.useParams()

    const { data: page } = useGetPage(pageId)
    const { data: schema } = useGetSchema(page?.Schema.id)

    console.log(schema)

    return (
        <div>
            {page && (
                <PageInline
                    id={parseInt(pageId)}
                    name={page.name}
                    url={page.url}
                />
            )}
        </div>
    )
}

export const Route = createLazyFileRoute('/pages/$pageId/edit/')({
    component: PageEditor,
})
