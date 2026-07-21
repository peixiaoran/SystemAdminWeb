import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { imagetools } from 'vite-imagetools'
import viteCompression from 'vite-plugin-compression'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'
  const outDir = env.VITE_BUILD_OUT_DIR || 'dist'

  return {
    // 生产部署在 /systemadminweb/ 子路径；createWebHashHistory 会自动读取 import.meta.env.BASE_URL
    base: isProd ? '/systemadminweb/' : '/',
    plugins: [
      vue(),
      isProd && imagetools(),
      isProd && viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        deleteOriginFile: false, // 保留原始文件，交给服务器按需选择
        threshold: 10240,
        verbose: false
      }),
      isProd && viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: false,
        threshold: 10240,
        verbose: false
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
    server: {
      port: 3001,
      host: 'localhost',
      open: true,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },
    build: {
      outDir,
      emptyOutDir: true,
      assetsDir: 'assets',
      sourcemap: env.DEV === 'true',
      // element-plus 为全局注册的大型库（约 1.16MB，已单独成 chunk 并压缩），放宽阈值避免误报
      chunkSizeWarningLimit: 1300,
      // Rolldown 内置的 Rust 压缩器（oxc），替代 terser 后构建显著提速，产物结构不变
      minify: 'oxc',
      target: 'es2020',
      reportCompressedSize: false,
      cssCodeSplit: true,
      rolldownOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          // 第三方预构建产物中位置不规范的 /* #__PURE__ */ 注解，仅影响 tree-shaking 提示
          if (warning.code === 'INVALID_ANNOTATION' && /node_modules/.test(warning.id || warning.loc?.file || '')) return;
          warn(warning);
        },
        output: {
          manualChunks: function(id) {
            if (id.includes('node_modules')) {
              // element-plus 依赖 vue，需先排除再归入 vue-core
              if (id.includes('vue') && !id.includes('element-plus') && !id.includes('@element-plus')) {
                return 'vue-core';
              }

              if (id.includes('pinia')) {
                return 'pinia';
              }

              if (id.includes('element-plus') || id.includes('@element-plus')) {
                return 'element-plus';
              }

              if (id.includes('vue-i18n')) {
                return 'i18n';
              }

              if (id.includes('axios')) {
                return 'axios';
              }

              if (id.includes('echarts') || id.includes('zrender')) {
                return 'echarts';
              }

              if (id.includes('vue-router')) {
                return 'router';
              }

              return 'vendors';
            }
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // oxc 只能整体丢弃 console.*，无法像 terser 的 pure_funcs 那样保留 console.error
          minify: {
            compress: {
              dropConsole: isProd,
              dropDebugger: isProd
            },
            mangle: true,
            codegen: { legalComments: 'none' }
          }
        }
      }
    },
    optimizeDeps: {
      include: [
        'vue-i18n',
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        'axios',
        // echarts 已按需引入（src/utils/echarts.js），仅预构建核心入口
        'echarts/core'
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  }
})
