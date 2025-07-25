import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      imports: [
        'vue',
        {
          'element-plus': ['ElLoading']
        }
      ],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@use "@/assets/styles/element-plus-custom.scss" as *;`,
  //     },
  //   },
  // },
})
