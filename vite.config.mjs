import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { imagetools } from 'vite-imagetools' // 图片优化
import viteCompression from 'vite-plugin-compression' // 产物压缩 (gzip & brotli)
import path from 'path'
import fs from 'node:fs'

function resolveFromRoot(...segments) {
  return path.resolve(process.cwd(), ...segments)
}

function getDevHttpsConfig(env = {}) {
  const envCert = env.VITE_DEV_HTTPS_CERT || env.DEV_HTTPS_CERT
  const envKey = env.VITE_DEV_HTTPS_KEY || env.DEV_HTTPS_KEY
  if (envCert && envKey) {
    const certPath = path.isAbsolute(envCert) ? envCert : resolveFromRoot(envCert)
    const keyPath = path.isAbsolute(envKey) ? envKey : resolveFromRoot(envKey)
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      return {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath),
      }
    }
    console.warn(
      `[vite] 已配置 HTTPS 证书路径，但文件不存在，已回退到 HTTP。\n` +
        `- cert: ${certPath}\n` +
        `- key:  ${keyPath}\n`
    )
    return undefined
  }

  // mkcert 常见输出：
  // The certificate is at "./localhost+2.pem"
  // and the key at "./localhost+2-key.pem"
  const candidates = [
    // 你当前项目的约定（放在 cert/ 目录）
    [resolveFromRoot('cert', 'localhost+2.pem'), resolveFromRoot('cert', 'localhost+2-key.pem')],
    [resolveFromRoot('cert', 'localhost.pem'), resolveFromRoot('cert', 'localhost-key.pem')],
    // 兼容：证书放在项目根目录
    [resolveFromRoot('localhost+2.pem'), resolveFromRoot('localhost+2-key.pem')],
    [resolveFromRoot('localhost.pem'), resolveFromRoot('localhost-key.pem')],
  ]

  for (const [certPath, keyPath] of candidates) {
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      return {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath),
      }
    }
  }

  // 不要因为缺证书导致 dev 启动失败：自动回退到 http，并给出提示
  console.warn(
    `[vite] 未找到 HTTPS 证书文件，已回退到 HTTP。\n` +
      `- 已尝试路径:\n` +
      candidates.map(([c, k]) => `  - cert: ${c}\n    key:  ${k}`).join('\n') +
      `\n你可以把证书放到上述任一位置，或在 .env 中配置：\n` +
      `- VITE_DEV_HTTPS_CERT=cert/xxx.pem\n` +
      `- VITE_DEV_HTTPS_KEY=cert/xxx-key.pem`
  )
  return undefined
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'
  const outDir = env.VITE_BUILD_OUT_DIR || 'dist'
  const isDev = command === 'serve'
  const devHttps = isDev ? getDevHttpsConfig(env) : undefined
  
  return {
    plugins: [
      vue(),
      // 构建阶段按需启用图片优化，提升 dev 启动速度
      isProd && imagetools(),
      // 仅在生产环境生成 .gz/.br 双格式压缩包，降低线上带宽与首屏加载时长
      isProd && viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        deleteOriginFile: false, // 保留原始文件，交给服务器按需选择
        threshold: 10240, // 仅压缩 10kb 以上文件
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
      port: 3001, // 前端开发服务器端口，不影响API请求
      open: true,
      // Vite 6 安全配置 - 限制网络访问
      host: 'localhost',
      // 启用 HTTPS（开发环境，使用 mkcert 生成的证书）
      https: devHttps,
      // 添加安全头
      headers: {
        // 新增HSTS头增强安全
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
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
      // 默认输出到相对路径 dist；支持通过 env 覆盖（建议仍使用相对路径，便于 CI/跨平台）
      outDir,
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
          reserved: ['$t', 'i18n', 't', 'locale', 'ElMessage', 'ElNotification'] // 保留Element提示组件变量名
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

              // echarts 单独打包
              if (id.includes('echarts')) {
                return 'echarts';
              }

              // vue-router 单独打包
              if (id.includes('vue-router')) {
                return 'router';
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
        'vue-i18n', // 新增i18n库预构建
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        'axios',
        'echarts'
      ],
      exclude: ['vue-demi'],
      // 新增vue-i18n预构建以提升启动速度,
      // 新增缓存目录提升构建速度
      cacheDir: 'node_modules/.vite_cache'
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