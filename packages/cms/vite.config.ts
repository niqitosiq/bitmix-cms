import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
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
            src: './src',
            shared: './src/shared',
            features: './src/features',
            widgets: './src/widgets',
            entities: './src/entities',
            pages: './src/pages',
        },
    },
})
