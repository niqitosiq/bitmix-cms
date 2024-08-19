import { PageInline } from '@entities/Page'
import { useGetPage } from '@entities/Page/hooks'
import { Loading } from '@shared/ui/Loading'
import { createLazyFileRoute } from '@tanstack/react-router'
import { ConfigureSchema } from '@widgets/ConfigureSchema'
import { RenderedSchema } from '@widgets/RenderedSchema'
import {
    getPanelElement,
    getPanelGroupElement,
    getResizeHandleElement,
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from 'react-resizable-panels'

const PageEditor = () => {
    const { pageId } = Route.useParams()

    const { data: page, isLoading: pageLoading } = useGetPage(pageId)
    if (pageLoading) {
        return <Loading />
    }

    return (
        <main>
            <PanelGroup direction="horizontal" id="group">
                <Panel id="left-panel">
                    {page && (
                        <PageInline
                            id={pageId}
                            name={page.name}
                            url={page.url}
                        />
                    )}

                    <ConfigureSchema id={page?.Schema.id!} hideCustom />
                </Panel>
                <PanelResizeHandle id="resize-handle" />
                <Panel id="right-panel">
                    <RenderedSchema id={page?.Schema.id!} />
                </Panel>
            </PanelGroup>
        </main>
    )
}

export const Route = createLazyFileRoute('/pages/$pageId/edit/')({
    component: PageEditor,
})
