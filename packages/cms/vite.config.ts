import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { fileURLToPath, URL } from 'url'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        wasm(),
        topLevelAwait(),
        TanStackRouterVite({
            routesDirectory: './src/pages',
            generatedRouteTree: './src/app/routeTree.gen.ts',
            routeFileIgnorePattern: 'Index',
        }),
    ],
    resolve: {
        alias: {
            '@src': fileURLToPath(new URL('./src', import.meta.url)),
            '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
            '@features': fileURLToPath(
                new URL('./src/features', import.meta.url)
            ),
            '@widgets': fileURLToPath(
                new URL('./src/widgets', import.meta.url)
            ),
            '@entities': fileURLToPath(
                new URL('./src/entities', import.meta.url)
            ),
            '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            '@packages': fileURLToPath(new URL('../', import.meta.url)),
            '@app': fileURLToPath(new URL('../api', import.meta.url)),
        },
    },
})
