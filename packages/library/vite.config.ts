import { defineConfig, Rollup } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            preserveEntrySignatures: 'allow-extension',
            input: ['./library.ts'],
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
                manualChunks: (id) => {
                    console.log(id)
                    if (id.includes('library/src')) {
                        return id.split('/').pop()?.split('.tsx')[0]
                    }
                    if (id.includes('react')) {
                        return 'react'
                    }
                    if (id.includes('library.ts')) {
                        return 'library'
                    }
                },
            },
        },
    },
})
