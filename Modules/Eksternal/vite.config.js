import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'

export default defineConfig({
    build: {
        outDir: '../../public/build-eksternal',
        emptyOutDir: true,
        manifest: true,
        sourcemap: false,
    },
    plugins: [
        react({
            include: '**/*.tsx'
        }),
        laravel({
            publicDirectory: '../../public',
            buildDirectory: 'build-eksternal',
            input: [
                __dirname + '/resources/assets/sass/app.scss',
                __dirname + '/resources/assets/js/app.js'
            ],
            refresh: true,
        })
    ],
    root: './resources/js',
    main: './resources/js/app.tsx',
});

//export const paths = [
//    'Modules/Eksternal/resources/assets/sass/app.scss',
//    'Modules/Eksternal/resources/assets/js/app.js',
//];