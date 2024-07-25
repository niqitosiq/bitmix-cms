import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import './index.css'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()
const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                <ReactQueryDevtools initialIsOpen={false} />
                <RouterProvider router={router} />
            </MantineProvider>
        </QueryClientProvider>
    )
}
