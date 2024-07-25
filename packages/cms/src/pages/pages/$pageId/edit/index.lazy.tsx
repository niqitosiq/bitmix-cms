import { PageInline } from '@entities/Page'
import { useGetPage } from '@entities/Page/hooks'
import { createLazyFileRoute } from '@tanstack/react-router'

const PageEditor = () => {
    const { pageId } = Route.useParams()

    const { data } = useGetPage(pageId)

    return (
        <div>
            {data && (
                <PageInline
                    id={parseInt(pageId)}
                    name={data.name}
                    url={data.url}
                />
            )}
        </div>
    )
}

export const Route = createLazyFileRoute('/pages/$pageId/edit/')({
    component: PageEditor,
})
