import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { viteVConsole } from 'vite-plugin-vconsole'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const getEnv = (key: string) => {
    return loadEnv(mode, process.cwd())[key]
  }

  const PUBLIC_PATH = getEnv('VITE_APP_PUBLIC_PATH')
  const SHOW_VCONSOLE = getEnv('VITE_APP_SHOW_VCONSOLE')
  const CDN_URL = getEnv('VITE_APP_CDN_URL')

  return {
    base: PUBLIC_PATH,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$cdn: '${CDN_URL}';`,
        },
      },
    },
    plugins: [
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
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
      vue(),
      VueSetupExtend(),
      viteVConsole({
        entry: path.resolve('src/main.ts'),
        localEnabled: SHOW_VCONSOLE === '1' && command === 'serve',
        enabled: false,
        config: {
          theme: 'light',
        },
      }),
    ],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/video': {
          target: 'http://localhost:3111',
          // target: 'http://182.254.140.237:3111',
          changeOrigin: true,
        },
      },
    },
  }
})
