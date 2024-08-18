import { CustomFrame, useGetCustomFrameById } from '@entities/Frame'
import { FrameInline } from '@entities/Frame/ui/FrameInline'
import { Loading } from '@shared/ui/Loading'
import { createLazyFileRoute } from '@tanstack/react-router'
import { ConfigureSchema } from '@widgets/ConfigureSchema'
import { RenderedSchema } from '@widgets/RenderedSchema'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

const PageEditor = () => {
    const { frameId } = Route.useParams()

    const { data, isLoading: pageLoading } = useGetCustomFrameById(frameId)

    if (pageLoading) {
        return <Loading />
    }

    //@ts-ignore
    const frame: CustomFrame = data

    return (
        <main>
            <PanelGroup direction="horizontal" id="group">
                <Panel id="left-panel">
                    {frame && <FrameInline frame={frame} />}

                    {frame.schemaId && <ConfigureSchema id={frame.schemaId} />}
                </Panel>
                <PanelResizeHandle id="resize-handle" />
                <Panel id="right-panel">
                    {frame.schemaId && <RenderedSchema id={frame.schemaId} />}
                </Panel>
            </PanelGroup>
        </main>
    )
}

export const Route = createLazyFileRoute('/frames/$frameId/edit/')({
    component: PageEditor,
})
