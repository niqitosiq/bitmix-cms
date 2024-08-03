import { lazy } from 'react'

export const library = {
    Page: lazy(() => import('./src/Page')),
    Paragraph: lazy(() => import('./src/Paragraph')),
    QueryParser: lazy(() => import('./src/QueryParser')),
    Carousel: lazy(() => import('./src/Carousel')),
    CarouselItem: lazy(() => import('./src/CarouselItem')),
    CarouselContent: lazy(() => import('./src/CarouselContent')),
    Image: lazy(() => import('./src/Image')),
}
