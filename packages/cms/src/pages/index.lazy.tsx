import { createLazyFileRoute } from '@tanstack/react-router'
import { Page } from './Index'

export const Route = createLazyFileRoute('/')({
    component: Page,
})
