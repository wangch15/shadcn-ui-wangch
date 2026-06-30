import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'

import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      tsconfigPath: './tsconfig.build.json',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'ShadcnUiWangch',
      fileName: 'shadcn-ui-wangch',
      cssFileName: 'styles',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'vue',
        'tailwindcss',
        '@tanstack/vue-table',
        '@vueuse/core',
        'dayjs',
        'vee-validate',
        'vue-sonner',
      ],
      output: {
        globals: {
          vue: 'Vue',
          tailwindcss: 'Tailwindcss',
          '@tanstack/vue-table': 'VueTable',
          '@vueuse/core': 'VueUse',
        },
      },
    },
    cssCodeSplit: false,
  },
})
