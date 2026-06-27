<template>
  <div class="login-container">
    <!-- 工作流主题背景装饰 -->
    <svg class="login-bg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id="wf-bg-dots" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.6" fill="#000000" opacity="0.04" />
        </pattern>
        <radialGradient id="wf-bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="wf-bg-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#000000" stop-opacity="0.07" />
          <stop offset="1" stop-color="#000000" stop-opacity="0.03" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#wf-bg-dots)" />
      <ellipse cx="180" cy="160" rx="520" ry="420" fill="url(#wf-bg-glow)" />
      <ellipse cx="1280" cy="760" rx="560" ry="440" fill="url(#wf-bg-glow)" />
      <!-- 左上工作流线条 -->
      <g stroke="url(#wf-bg-line)" fill="none" stroke-width="2">
        <path d="M150 150 H250 q14 0 14 14 V210" />
        <path d="M264 250 V300 q0 14 -14 14 H150" />
        <rect x="120" y="120" width="60" height="60" rx="16" fill="#000000" fill-opacity="0.025" />
        <rect x="236" y="180" width="56" height="56" rx="16" fill="#000000" fill-opacity="0.04" />
        <rect x="120" y="290" width="56" height="56" rx="16" fill="#000000" fill-opacity="0.025" />
      </g>
      <!-- 右下工作流线条 -->
      <g stroke="url(#wf-bg-line)" fill="none" stroke-width="2" transform="translate(1290 740) rotate(180)">
        <path d="M150 150 H250 q14 0 14 14 V210" />
        <path d="M264 250 V300 q0 14 -14 14 H150" />
        <rect x="120" y="120" width="60" height="60" rx="16" fill="#000000" fill-opacity="0.025" />
        <rect x="236" y="180" width="56" height="56" rx="16" fill="#000000" fill-opacity="0.04" />
        <rect x="120" y="290" width="56" height="56" rx="16" fill="#000000" fill-opacity="0.025" />
      </g>
    </svg>
    <div class="login-box">
      <div class="login-header">
        <svg class="logo" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Workflow">
          <defs>
            <linearGradient id="wf-grad" x1="6" y1="8" x2="57" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#3a3a3a" />
              <stop offset="1" stop-color="#000000" />
            </linearGradient>
          </defs>
          <!-- 流程连接线 -->
          <path id="wf-c1" d="M22 16 H44.5 q4.5 0 4.5 4.5 V24" stroke="url(#wf-grad)" stroke-width="2.4" stroke-linecap="round" opacity="0.5" />
          <path id="wf-c2" d="M49 40 V43.5 q0 4.5 -4.5 4.5 H22" stroke="url(#wf-grad)" stroke-width="2.4" stroke-linecap="round" opacity="0.5" />
          <!-- 沿流程流动的光点 -->
          <circle r="2" fill="#1a1a1a" class="wf-dot">
            <animateMotion dur="2.4s" repeatCount="indefinite">
              <mpath href="#wf-c1" />
            </animateMotion>
          </circle>
          <circle r="2" fill="#1a1a1a" class="wf-dot">
            <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite">
              <mpath href="#wf-c2" />
            </animateMotion>
          </circle>
          <!-- 节点1：表单/发起 -->
          <rect x="6" y="8" width="16" height="16" rx="5" fill="#ffffff" stroke="url(#wf-grad)" stroke-width="2.4" />
          <path d="M10.5 13.5 H17.5 M10.5 17 H15" stroke="url(#wf-grad)" stroke-width="1.8" stroke-linecap="round" />
          <!-- 节点2：处理中（强调） -->
          <rect class="wf-active" x="41" y="24" width="16" height="16" rx="5" fill="url(#wf-grad)" />
          <circle cx="45.6" cy="32" r="1.25" fill="#ffffff" />
          <circle cx="49" cy="32" r="1.25" fill="#ffffff" />
          <circle cx="52.4" cy="32" r="1.25" fill="#ffffff" />
          <!-- 节点3：已审批 -->
          <rect x="6" y="40" width="16" height="16" rx="5" fill="#ffffff" stroke="url(#wf-grad)" stroke-width="2.4" />
          <path d="M10.6 48 l2.8 2.8 l4.6 -5.6" stroke="url(#wf-grad)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h1 class="title">{{ $t('login.title') }}</h1>
      </div>
      
      <div class="login-form-container">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          size="large"
          autocomplete="off"
          @submit.prevent
        >
          <el-form-item prop="loginNo">
            <el-input
              v-model="loginForm.loginNo"
              :placeholder="$t('login.usernamePlaceholder')"
              clearable
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              data-lpignore="true"
              data-form-type="other"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              :placeholder="$t('login.passwordPlaceholder')"
              show-password
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              data-lpignore="true"
              data-form-type="other"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item prop="language">
            <el-select 
              v-model="loginForm.language" 
              :placeholder="$t('login.languagePlaceholder')"
              class="language-select"
              @change="handleLanguageChange"
            >
              <el-option v-for="(label, value) in languages" :key="value" :label="label" :value="value" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              :disabled="loading"
              class="login-button"
              @click="handleLogin"
            >
              {{ $t('login.loginButton') }}
            </el-button>
          </el-form-item>
          <div class="unlock-link-container">
            <el-link 
              type="info" 
              :disabled="loading"
              @click="handleUnlockAccount"
            >
              {{ $t('login.unlockAccount') }}
            </el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { post, resetAuthErrorState } from '@/utils/request'
import { LOGIN_API } from '@/config/api/login/api'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import { User, Lock } from '@element-plus/icons-vue' // 新增图标引入

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const loginFormRef = ref(null)
const loading = ref(false)

// 与 request.js 保持一致：401 整页刷新后在登录页补弹“登录已过期”提示
const AUTH_EXPIRED_MESSAGE_KEY = '__auth_expired_message__'

// 移除了动态字段名生成逻辑，简化防自动填充机制

const loginForm = reactive({
  loginNo: '',
  password: '',
  language: localStorage.getItem('language') || 'zh-CN' // 从localStorage获取语言设置
})

// 在组件挂载后进行初始化
onMounted(() => {
  // 如果是 401 导致的登出跳转，这里补弹一次提示，保证用户看得到
  try {
    const msg = sessionStorage.getItem(AUTH_EXPIRED_MESSAGE_KEY)
    if (msg) {
      sessionStorage.removeItem(AUTH_EXPIRED_MESSAGE_KEY)
      ElMessage({
        type: 'warning',
        message: msg,
        duration: 3000,
        plain: true,
        showClose: true
      })
    }
  } catch {
    // ignore
  }

  // 重置表单验证状态
  nextTick(() => {
    loginFormRef.value?.resetFields()
  })
})

// 使用计算属性获取翻译后的选项
const languages = computed(() => {
  return {
    'zh-CN': t('login.languages.zh-CN'),
    'en-US': t('login.languages.en-US')
  }
})

// 登录表单验证规则
const loginRules = computed(() => {
  return {
    loginNo: [
      { required: true, message: t('login.usernameRequired'), trigger: 'blur' }
    ],
    password: [
      { required: true, message: t('login.passwordRequired'), trigger: 'blur' }
    ]
  }
})

// 语言切换处理
const handleLanguageChange = (value) => {
  locale.value = value
  localStorage.setItem('language', value)
  // 更新document标题
  document.title = t('common.systemTitle')
}

// 跳转到解锁页面
const handleUnlockAccount = () => {
  router.push('/unlock')
}

// 移除了复杂的输入框焦点处理逻辑，简化用户输入体验

const handleLogin = () => {
  loginFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true

      // 保存语言选择到localStorage
      localStorage.setItem('language', loginForm.language)

      // 使用封装的post方法，它会使用环境变量中的API基础URL
      post(
        LOGIN_API.USER_LOGIN,
        {
          loginNo: loginForm.loginNo,
          password: loginForm.password
        },
        { allowLoginBusinessCodes: true }
      ).then(res => {
          const businessMsg = res?.message ?? ''
          if (res.code === 200) {
            resetAuthErrorState()
            // 设置标题
            document.title = t('common.systemTitle')
            // 获取用户store
            const userStore = useUserStore()

            // Cookie(HttpOnly) 模式：登录成功后由后端写入 Cookie，前端不再接收/保存 token
            // 仍保存必要的用户信息用于前端展示与路由守卫（loginNo/userId）
            userStore.setUserInfo({
              userId: res?.data?.userId || '',
              userNameCn: res?.data?.userNameCn || '',
              userNameEn: res?.data?.userNameEn || '',
              loginNo: res?.data?.loginNo || loginForm.loginNo,
              avatar: res?.data?.avatarAddress || ''
            })
            
            // 企业标准：优先按 ?redirect= 回跳，否则去模块选择页
            const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
            if (redirect && redirect.startsWith('/')) {
              router.replace(redirect)
            } else {
              router.replace('/module-select')
            }
            loading.value = false
          } else if (res.code === 406) {
            // 账号不存在（UserNotFound）
            ElMessage({
              message: businessMsg,
              type: 'error',
              plain: true,
              showClose: true
            })
            loading.value = false
          } else if (res.code === 401 || res.code === 402) {
            // 冻结：跳转解锁页（保持 loading 至跳转，避免重复提交）
            ElMessage({
              message: businessMsg,
              type: 'warning',
              plain: true,
              showClose: true,
              duration: 3000
            })
            setTimeout(() => {
              router.push('/unlock')
            }, 1500)
          } else if (res.code === 403) {
            // 密码错误
            ElMessage({
              message: businessMsg,
              type: 'error',
              plain: true,
              showClose: true
            })
            loading.value = false
          } else if (res.code === 405) {
            // 密码过期：跳转密码过期页
            ElMessage({
              message: businessMsg,
              type: 'warning',
              plain: true,
              showClose: true,
              duration: 3000
            })
            setTimeout(() => {
              router.push('/password-expiration')
            }, 1500)
          } else {
            ElMessage({
              message: businessMsg,
              type: 'error',
              plain: true,
              showClose: true
            })
            loading.value = false
          }
        })
        .catch(error => {
          // 401错误已经在请求拦截器中处理，不再显示额外的错误提示
          if (error?.response?.status !== 401 && error?.code !== 401) {
            ElMessage({
              message: t('login.loginFailedTip'),
              type: 'error',
              plain: true,
              showClose: true,
            })
          }
          loading.value = false
        })
        .finally(() => {
          // 冻结(401/402)与密码过期(405)在跳转前保持 loading，避免重复点击
        })
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(160deg, #ffffff 0%, #f6f7f9 100%);
  position: relative;
  overflow: hidden;
  padding: 2px;
  flex: 1;
  width: 100%;
}

/* 工作流主题背景装饰 */
.login-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}

.login-box {
  width: 480px;
  padding: 0;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 30px;
  background: #ffffff;
  color: #1a1a1a;
}

.logo {
  display: block;
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

/* 处理中节点：柔和呼吸效果 */
.wf-active {
  transform-box: fill-box;
  transform-origin: center;
  animation: wfPulse 2.6s ease-in-out infinite;
}

@keyframes wfPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.05); }
}

/* 尊重系统的“减少动态效果”偏好 */
@media (prefers-reduced-motion: reduce) {
  .wf-active { animation: none; }
  .wf-dot { display: none; }
}

.title {
  font-size: 22px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: 1px;
}

.login-form-container {
  padding: 16px 40px 40px;
  background-color: #ffffff;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-form {
  width: 100%;
  max-width: 400px;
  margin-top: 0;
}

.login-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e4e7ed inset !important;
  background-color: #ffffff;
  padding: 0 15px;
  height: 40px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #1a1a1a inset !important;
  background-color: #ffffff;
}

.login-form :deep(.el-input__wrapper:hover:not(.is-focus)) {
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  background-color: #ffffff;
}

.login-form :deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.login-form :deep(.el-form-item.is-error .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.login-form :deep(.el-form-item.is-error .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.login-form :deep(.el-input__inner) {
  line-height: 30px;
  height: 30px;
  padding: 0;
  flex: 1;
}

.login-form :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.login-form :deep(.el-input__suffix) {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.login-form :deep(.el-select) {
  width: 100%;
}

.login-form :deep(.el-select .el-input__wrapper),
.login-form :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #e4e7ed inset !important;
  background-color: #ffffff;
  padding: 0 15px;
  min-height: 40px;
  height: 40px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.login-form :deep(.el-select .el-input__wrapper:hover:not(.is-focus)),
.login-form :deep(.el-select__wrapper.is-hovering:not(.is-focused)) {
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  background-color: #ffffff;
}

.login-form :deep(.el-select .el-input__wrapper.is-focus),
.login-form :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 2px #1a1a1a inset !important;
  background-color: #ffffff;
}

.login-form :deep(.el-select .el-input__inner) {
  line-height: 30px;
  height: 30px;
  padding: 0;
  flex: 1;
}

.login-form :deep(.el-form-item__label) {
  text-align: left;
  line-height: 45px;
  height: 45px;
  padding-right: 12px;
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  color: #606266;
}

.login-form :deep(.el-form-item__content) {
  line-height: 45px;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.login-button {
  width: 100%;
  height: 42px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  margin-top: 10px;
  box-shadow: 0 8px 16px rgba(26, 26, 26, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-button:hover {
  background: #303133;
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(26, 26, 26, 0.2);
}

.login-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(26, 26, 26, 0.15);
}

/* 响应式调整 */
@media screen and (max-width: 576px) {
  .login-box {
    width: 90%;
    max-width: 420px;
  }
  
  .login-form-container {
    padding: 25px 20px;
  }
  
  .login-form {
    max-width: 380px;
  }
}

.language-select {
  width: 100%;
}

.unlock-link-container {
  width: 100%;
  text-align: center;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

/* 移除必填标记 */
.login-form :deep(.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before) {
  content: '';
}

/* 强力禁用浏览器自动填充样式 */
.login-form :deep(input:-webkit-autofill),
.login-form :deep(input:-webkit-autofill:hover),
.login-form :deep(input:-webkit-autofill:focus),
.login-form :deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #606266 !important;
  transition: background-color 5000s ease-in-out 0s !important;
  -webkit-transition: background-color 5000s ease-in-out 0s !important;
}

/* 进一步防止自动填充的样式 */
.login-form :deep(input[autocomplete="new-password"]) {
  background: white !important;
  color: #606266 !important;
}

/* 自定义表格滚动条样式 */
:deep(.el-scrollbar__bar) {
  width: 8px;
  height: 8px;
}

:deep(.el-scrollbar__thumb) {
  background-color: #dcdfe6;
  border-radius: 4px;
}

:deep(.el-scrollbar__track) {
  background-color: #f5f7fa;
}

/* router-view-container 样式 */
:deep(.router-view-container) {
  padding: 15px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 25px;
}

.login-form :deep(.el-form-item:first-child) {
  margin-top: -5px;
}
</style>

