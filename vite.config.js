import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'Modules/Eksternal/resources/assets/js/styles/app.css',
                'Modules/Eksternal/resources/assets/js/app.tsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    build: {
        target: 'es2020',
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (
                            id.includes('react/') ||
                            id.includes('react-dom/') ||
                            id.includes('react-router-dom/') ||
                            id.includes('react-router/')
                        ) {
                            return 'vendor-react';
                        }
                        if (id.includes('@tanstack/react-query')) {
                            return 'vendor-tanstack';
                        }
                        if (
                            id.includes('lucide-react') ||
                            id.includes('react-feather') ||
                            id.includes('sweetalert2') ||
                            id.includes('react-hot-toast')
                        ) {
                            return 'vendor-ui';
                        }
                        if (
                            id.includes('react-hook-form') ||
                            id.includes('@hookform') ||
                            id.includes('zod')
                        ) {
                            return 'vendor-forms';
                        }
                        if (id.includes('bootstrap') || id.includes('react-bootstrap')) {
                            return 'vendor-bootstrap';
                        }
                        if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
                            return 'vendor-redux';
                        }
                    }
                },
            },
        },
    },
    esbuild: {
        legalComments: 'none',
    },
});
