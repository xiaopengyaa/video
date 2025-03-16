import process from 'node:process'
import { unheadVueComposablesImports } from '@unhead/vue'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import Sitemap from 'vite-plugin-sitemap'
import VueDevTools from 'vite-plugin-vue-devtools'
import { loadEnv } from 'vite'
import { createViteVConsole } from './vconsole'

export function createVitePlugins(mode: string) {
  const env = loadEnv(mode, process.cwd())

  return [
    VueRouter({
      extensions: ['.vue'],
      // filePatterns: ['**/index.vue'],
      routesFolder: 'src/views',
      dts: 'src/types/typed-router.d.ts',
    }),
    vue(),
    Sitemap({
      outDir: env.VITE_APP_OUT_DIR || 'dist',
    }),
    Components({
      extensions: ['vue'],
      resolvers: [VantResolver()],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/types/components.d.ts',
    }),
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
      ],
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        unheadVueComposablesImports,
        {
          'vue-router/auto': ['useLink'],
        },
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: [
        'src/composables',
      ],
      resolvers: [VantResolver()],
    }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    createViteVConsole(),
    VueDevTools(),
  ]
}
