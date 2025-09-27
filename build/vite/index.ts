import { unheadVueComposablesImports } from '@unhead/vue'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import Components from 'unplugin-vue-components/vite'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'
import VueDevTools from 'vite-plugin-vue-devtools'
import progress from 'vite-plugin-progress'
import { bundleAnalyzer } from './bundle-analyzer'
import { createViteVConsole } from './vconsole'
import { preloadErrorHandler } from './preload-error-handler'

export function createVitePlugins(mode: string) {
  return [
    // https://github.com/jeddygong/vite-plugin-progress
    progress(),

    vue(),

    // https://github.com/pengzhanbo/vite-plugin-mock-dev-server
    mockDevServerPlugin(),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['vue'],
      resolvers: [VantResolver()],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/types/components.d.ts',
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
      ],
      imports: [
        'vue',
        '@vueuse/core',
        'vue-router',
        unheadVueComposablesImports,
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

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),

    // https://github.com/vadxq/vite-plugin-vconsole
    createViteVConsole(mode),

    // 预加载错误处理插件
    preloadErrorHandler(),

    // https://github.com/vuejs/devtools-next
    VueDevTools(),

    // 打包产物大小分析插件
    bundleAnalyzer(),
  ]
}
