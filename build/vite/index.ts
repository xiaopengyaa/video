import process from 'node:process'
import { unheadVueComposablesImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import Components from 'unplugin-vue-components/vite'
import Sitemap from 'vite-plugin-sitemap'
import VueDevTools from 'vite-plugin-vue-devtools'
import { VueMcp } from 'vite-plugin-vue-mcp'
import { loadEnv } from 'vite'
import { createViteVConsole } from './vconsole'

export function createVitePlugins(mode: string, command: 'build' | 'serve') {
  const env = loadEnv(mode, process.cwd())

  return [
    vue(),
    VueSetupExtend(),
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
        'vue-router',
        'pinia',
        '@vueuse/core',
        unheadVueComposablesImports,
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: [
        'src/composables',
      ],
      resolvers: [VantResolver()],
    }),
    createViteVConsole(command),
    VueDevTools(),
    VueMcp(),
  ]
}
