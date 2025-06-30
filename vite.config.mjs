import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
    },
    server: {
      port: 3001, // 前端开发服务器端口，不影响API请求
      open: true,
      // Vite 6 安全配置 - 限制网络访问
      host: 'localhost',
      // 启用 HTTPS（可选，用于开发环境）
      // https: true,
      // 添加安全头
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block'
      }
    },
    // 定义全局常量替换方式
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      // Vue 3.5 特性标志
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    },
    // 构建选项
    build: {
      outDir: 'E:/MyCode/PlayCode/SystemsWebDist/dist',
      emptyOutDir: true,
      assetsDir: 'assets',
      sourcemap: env.DEV === 'true', // 只在开发环境启用
      // 提高警告阈值为 1000kB
      chunkSizeWarningLimit: 1000,
      minify: 'terser', // 使用terser进行更彻底的代码压缩
      terserOptions: {
        compress: {
          drop_console: env.PROD === 'true', // 生产环境删除console
          drop_debugger: env.PROD === 'true', // 生产环境删除debugger
          pure_funcs: env.PROD === 'true' ? ['console.log', 'console.warn', 'console.info'] : [] // 生产环境删除console语句
        },
        mangle: {
          // 防止i18n相关变量名被混淆
          reserved: ['$t', 'i18n', 't', 'locale']
        },
        format: {
          // 移除注释
          comments: false
        }
      },
      // 启用代码分割优化
      target: 'es2020', // 支持现代浏览器，减少polyfill
      reportCompressedSize: false, // 禁用压缩大小报告以提升构建速度
      // CSS相关优化
      cssCodeSplit: true,
      // 确保生成正确的资源路径
      rollupOptions: {
        // 避免循环依赖警告
        onwarn(warning, warn) {
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          warn(warning);
        },
        output: {
          // 优化的代码分割策略
          manualChunks: function(id) {
            // 按模块打包
            if (id.includes('node_modules')) {
              // 将vue放入单独的chunk中，此时排除element-plus，因为element-plus依赖vue
              if (id.includes('vue') && !id.includes('element-plus') && !id.includes('@element-plus')) {
                return 'vue-core';
              }
              
              // pinia单独打包
              if (id.includes('pinia')) {
                return 'pinia';
              }
              
              // element-plus和图标库整体打包在一起
              if (id.includes('element-plus') || id.includes('@element-plus')) {
                return 'element-plus';
              }
              
              // i18n单独打包确保不被错误优化
              if (id.includes('vue-i18n')) {
                return 'i18n';
              }
              
              // axios
              if (id.includes('axios')) {
                return 'axios';
              }
              
              // 其他依赖
              return 'vendors';
            }
          },
          // 优化文件名生成
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    // Vite 6 性能优化
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        'axios'
      ],
      exclude: ['vue-demi']
    },
    // CSS 预处理器配置
    css: {
      preprocessorOptions: {
        scss: { 
          api: 'modern-compiler' // Sass 现代编译器API
        }
      }
    }
  }
}) 