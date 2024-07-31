import { lazy } from 'react'

export const library = {
    Page: lazy(() => import('./src/Page')),
    Paragraph: lazy(() => import('./src/Paragraph')),
    QueryParser: lazy(() => import('./src/QueryParser')),
}
