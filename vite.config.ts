import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { viteVConsole } from 'vite-plugin-vconsole'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const getEnv = (key: string) => {
    return loadEnv(mode, process.cwd())[key]
  }

  return {
    base: getEnv('VITE_APP_PUBLIC_PATH'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      vue(),
      viteVConsole({
        entry: path.resolve('src/main.ts'),
        localEnabled: command === 'serve',
        enabled: false,
        config: {
          maxLogNumber: 1000,
          theme: 'light',
        },
      }),
      AutoImport({
        include: [/\.vue$/],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: './src/auto-imports.d.ts',
        resolvers: [VantResolver()],
        eslintrc: {
          enabled: true,
        },
      }),
      Components({
        dts: './src/components.d.ts',
        resolvers: [VantResolver()],
      }),
    ],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/video': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }
})
