<template>
  <div class="password-expiration-container">
    <!-- 工作流主题背景装饰（密码更新：暖灰色调） -->
    <svg class="password-expiration-bg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <pattern id="pe-bg-dots" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.6" fill="#5d636e" opacity="0.05" />
        </pattern>
        <radialGradient id="pe-bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#5d636e" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#5d636e" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="pe-bg-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#5d636e" stop-opacity="0.08" />
          <stop offset="1" stop-color="#5d636e" stop-opacity="0.035" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#pe-bg-dots)" />
      <ellipse cx="180" cy="160" rx="520" ry="420" fill="url(#pe-bg-glow)" />
      <ellipse cx="1280" cy="760" rx="560" ry="440" fill="url(#pe-bg-glow)" />
      <g stroke="url(#pe-bg-line)" fill="none" stroke-width="2">
        <path d="M150 150 H250 q14 0 14 14 V210" />
        <path d="M264 250 V300 q0 14 -14 14 H150" />
        <path d="M150 314 V210" opacity="0.7" />
        <rect x="120" y="120" width="60" height="60" rx="16" fill="#5d636e" fill-opacity="0.03" />
        <rect x="236" y="180" width="56" height="56" rx="16" fill="#5d636e" fill-opacity="0.05" />
        <rect x="120" y="290" width="56" height="56" rx="16" fill="#5d636e" fill-opacity="0.03" />
      </g>
      <g stroke="url(#pe-bg-line)" fill="none" stroke-width="2" transform="translate(1290 740) rotate(180)">
        <path d="M150 150 H250 q14 0 14 14 V210" />
        <path d="M264 250 V300 q0 14 -14 14 H150" />
        <path d="M150 314 V210" opacity="0.7" />
        <rect x="120" y="120" width="60" height="60" rx="16" fill="#5d636e" fill-opacity="0.03" />
        <rect x="236" y="180" width="56" height="56" rx="16" fill="#5d636e" fill-opacity="0.05" />
        <rect x="120" y="290" width="56" height="56" rx="16" fill="#5d636e" fill-opacity="0.03" />
      </g>
    </svg>
    <div class="password-expiration-box">
      <div class="password-expiration-header">
        <svg class="logo" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Password renewal workflow">
          <defs>
            <linearGradient id="pe-grad" x1="6" y1="8" x2="57" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#9aa0a9" />
              <stop offset="1" stop-color="#5d636e" />
            </linearGradient>
          </defs>
          <!-- 循环流程线 -->
          <path id="pe-c1" d="M22 16 H44.5 q4.5 0 4.5 4.5 V24" stroke="url(#pe-grad)" stroke-width="2.4" stroke-linecap="round" opacity="0.5" />
          <path id="pe-c2" d="M49 40 V43.5 q0 4.5 -4.5 4.5 H22" stroke="url(#pe-grad)" stroke-width="2.4" stroke-linecap="round" opacity="0.5" />
          <path id="pe-c3" d="M14 40 V24" stroke="url(#pe-grad)" stroke-width="2.4" stroke-linecap="round" opacity="0.5" />
          <!-- 闭环回流箭头 -->
          <path d="M11.5 27 L14 24 L16.5 27" stroke="url(#pe-grad)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
          <circle r="1.9" fill="#6b7280" class="wf-dot">
            <animateMotion dur="3s" repeatCount="indefinite"><mpath href="#pe-c1" /></animateMotion>
          </circle>
          <circle r="1.9" fill="#6b7280" class="wf-dot">
            <animateMotion dur="3s" begin="1s" repeatCount="indefinite"><mpath href="#pe-c2" /></animateMotion>
          </circle>
          <circle r="1.9" fill="#6b7280" class="wf-dot">
            <animateMotion dur="3s" begin="2s" repeatCount="indefinite"><mpath href="#pe-c3" /></animateMotion>
          </circle>
          <!-- 节点1：密码表单 -->
          <rect x="6" y="8" width="16" height="16" rx="5" fill="#ffffff" stroke="url(#pe-grad)" stroke-width="2.4" />
          <path d="M10.5 13.5 H17.5 M10.5 17 H15" stroke="url(#pe-grad)" stroke-width="1.8" stroke-linecap="round" />
          <!-- 节点3：时效（时钟） -->
          <rect x="6" y="40" width="16" height="16" rx="5" fill="#ffffff" stroke="url(#pe-grad)" stroke-width="2.4" />
          <circle cx="14" cy="48" r="4" fill="none" stroke="url(#pe-grad)" stroke-width="1.6" />
          <path d="M14 48 V45.4 M14 48 L16 49" stroke="url(#pe-grad)" stroke-width="1.6" stroke-linecap="round" />
          <!-- 节点2：更新（强调，刷新） -->
          <rect class="wf-active" x="41" y="24" width="16" height="16" rx="5" fill="url(#pe-grad)" />
          <path d="M45.6 29.6 A4 4 0 0 1 52.4 29.6" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" fill="none" />
          <path d="M52.4 29.6 l1.5 -0.7 l0.1 1.9 z" fill="#ffffff" />
          <path d="M52.4 34.4 A4 4 0 0 1 45.6 34.4" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round" fill="none" />
          <path d="M45.6 34.4 l-1.5 0.7 l-0.1 -1.9 z" fill="#ffffff" />
        </svg>
        <h1 class="title">{{ $t('passwordExpiration.title') }}</h1>
      </div>
      
      <div class="password-expiration-form-container">
        <el-form 
          ref="formRef" 
          :model="form" 
          :rules="rules" 
          class="expiration-form"
          size="large"
          autocomplete="off"
          @submit.prevent="handleSubmit"
        >
          <!-- 账号输入框 -->
          <el-form-item prop="userNo">
            <el-input
              v-model="form.userNo"
              :placeholder="$t('passwordExpiration.accountPlaceholder')"
              :disabled="userNoDisabled || redirectCountdown > 0"
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
          
          <!-- 新密码输入框 -->
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              :placeholder="$t('passwordExpiration.newPasswordPlaceholder')"
              :disabled="formDisabled || redirectCountdown > 0"
              show-password
              clearable
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              data-lpignore="true"
              data-form-type="other"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <!-- 确认密码输入框 -->
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              :placeholder="$t('passwordExpiration.confirmPasswordPlaceholder')"
              :disabled="formDisabled || redirectCountdown > 0"
              show-password
              clearable
              autocomplete="off"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              data-lpignore="true"
              data-form-type="other"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <!-- 人机验证：仅用于保护“发送验证码”，防止被脚本批量刷验证码 -->
          <el-form-item>
            <div ref="turnstileContainer" class="turnstile-container"></div>
          </el-form-item>

          <!-- 验证码输入框 -->
          <el-form-item prop="verificationCode">
            <div class="verification-input-group">
              <el-input
                v-model="form.verificationCode"
                :placeholder="$t('passwordExpiration.verificationCodePlaceholder')"
                :disabled="formDisabled || redirectCountdown > 0"
                clearable
                autocomplete="off"
                autocapitalize="off"
                autocorrect="off"
                spellcheck="false"
                data-lpignore="true"
                data-form-type="other"
                @keyup.enter="handleSubmit"
                class="verification-input"
              >
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
              <el-button
                type="info"
                :loading="sendingCode"
                :disabled="countdown > 0 || redirectCountdown > 0"
                class="send-code-button"
                @click="handleSendCode"
                plain
              >
                {{ countdown > 0 ? `${countdown}${$t('common.retryAfterSeconds')}` : $t('passwordExpiration.sendCode') }}
              </el-button>
            </div>
          </el-form-item>
          
          <!-- 语言选择 -->
          <el-form-item prop="language">
            <el-select 
              v-model="form.language" 
              :placeholder="$t('passwordExpiration.languagePlaceholder')"
              class="language-select"
              @change="handleLanguageChange"
            >
              <el-option v-for="(label, value) in languages" :key="value" :label="label" :value="value" />
            </el-select>
          </el-form-item>
          
          <!-- 修改密码按钮 -->
          <el-form-item class="submit-button-item">
            <el-button
              type="primary"
              :loading="submitting"
              :disabled="formDisabled || redirectCountdown > 0"
              class="submit-button"
              @click="handleSubmit"
            >
              {{ redirectCountdown > 0 ? `${redirectCountdown}${$t('passwordExpiration.redirectCountdownText')}` : $t('passwordExpiration.submitButton') }}
            </el-button>
          </el-form-item>
          
          <!-- 返回登录页面链接 -->
          <div class="back-to-login-container">
            <el-link 
              type="info"
              @click="handleBackToLogin"
              :disabled="redirectCountdown > 0"
            >{{ $t('passwordExpiration.backToLogin') }}</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { post, isHandled } from '@/utils/request'
import { PWD_EXPIRATION_SEND_API, PWD_EXPIRATION_UPDATE_API } from '@/config/api/login/api'
import { TURNSTILE_SITE_KEY } from '@/config/api/base'

const router = useRouter()
const { t, locale } = useI18n()
const formRef = ref()

// Cloudflare Turnstile 人机验证：仅保护“发送验证码”按钮，防止被脚本批量刷验证码
const turnstileContainer = ref(null)
const turnstileToken = ref('')
let turnstileWidgetId = null

const mapToTurnstileLanguage = (langValue) => {
  const map = {
    'zh-CN': 'zh-cn',
    'en-US': 'en'
  }
  return map[langValue] || 'auto'
}

const renderTurnstile = () => {
  if (!window.turnstile || !turnstileContainer.value) return

  turnstileWidgetId = window.turnstile.render(turnstileContainer.value, {
    sitekey: TURNSTILE_SITE_KEY,
    theme: 'light',
    size: 'flexible',
    language: mapToTurnstileLanguage(form.language),
    callback: (token) => {
      turnstileToken.value = token
    },
    'expired-callback': () => {
      turnstileToken.value = ''
    },
    'error-callback': () => {
      turnstileToken.value = ''
    }
  })
}

// api.js 通过 async defer 加载，若脚本已加载（如从登录页跳转过来）直接渲染，
// 否则监听 index.html 内联脚本广播的 turnstile-ready 事件
const waitForTurnstile = () => {
  if (window.turnstile || window.__turnstileReady) {
    renderTurnstile()
    return
  }
  document.addEventListener('turnstile-ready', renderTurnstile, { once: true })
}

const resetTurnstile = () => {
  turnstileToken.value = ''
  if (window.turnstile && turnstileWidgetId !== null) {
    window.turnstile.reset(turnstileWidgetId)
  }
}

// 表单数据
const form = reactive({
  userNo: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
  language: localStorage.getItem('language') || 'zh-CN' // 从localStorage获取语言设置
})

// 状态管理
const countdown = ref(0)
const redirectCountdown = ref(0)
const sendingCode = ref(false)
const submitting = ref(false)
const userNoDisabled = ref(false)
const formDisabled = ref(false)
let countdownTimer = null
let redirectTimer = null

// 在组件挂载后进行初始化
onMounted(() => {
  // 重置表单验证状态
  nextTick(() => {
    formRef.value?.resetFields()
  })

  // 渲染 Cloudflare Turnstile 验证组件
  nextTick(() => {
    waitForTurnstile()
  })
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  if (redirectTimer) {
    clearInterval(redirectTimer)
  }
  document.removeEventListener('turnstile-ready', renderTurnstile)
  if (window.turnstile && turnstileWidgetId !== null) {
    window.turnstile.remove(turnstileWidgetId)
  }
})

// 使用计算属性获取翻译后的语言选项
const languages = computed(() => {
  return {
    'zh-CN': t('passwordExpiration.languages.zh-CN'),
    'en-US': t('passwordExpiration.languages.en-US')
  }
})

// 密码强度验证函数
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error(t('passwordExpiration.newPasswordRequired')))
    return
  }
  
  // 长度验证：8-16位
  if (value.length < 8 || value.length > 16) {
    callback(new Error(t('passwordExpiration.passwordLengthError')))
    return
  }
  
  // 包含小写字母
  if (!/[a-z]/.test(value)) {
    callback(new Error(t('passwordExpiration.passwordLowercaseError')))
    return
  }
  
  // 包含大写字母
  if (!/[A-Z]/.test(value)) {
    callback(new Error(t('passwordExpiration.passwordUppercaseError')))
    return
  }
  
  // 包含数字
  if (!/[0-9]/.test(value)) {
    callback(new Error(t('passwordExpiration.passwordNumberError')))
    return
  }
  
  // 包含特殊字符
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
    callback(new Error(t('passwordExpiration.passwordSpecialCharError')))
    return
  }
  
  callback()
}

// 表单验证规则
const rules = computed(() => ({
  userNo: [
    { required: true, message: t('passwordExpiration.accountRequired'), trigger: 'blur' }
  ],
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: t('passwordExpiration.confirmPasswordRequired'), trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error(t('passwordExpiration.passwordMismatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  verificationCode: [
    { required: true, message: t('passwordExpiration.verificationCodeRequired'), trigger: 'blur' }
  ]
}))

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
      // 倒计时结束、“发送验证码”按钮重新可点时才需要新 token，这里再刷新人机验证
      resetTurnstile()
    }
  }, 1000)
}

// 开始跳转倒计时
const startRedirectCountdown = () => {
  redirectCountdown.value = 3
  redirectTimer = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      clearInterval(redirectTimer)
      redirectTimer = null
      router.push('/login')
    }
  }, 1000)
}

// 发送验证码
const handleSendCode = async () => {
  if (!form.userNo || !form.password || !form.confirmPassword) {
    return
  }

  if (!turnstileToken.value) {
    ElMessage({
      message: t('passwordExpiration.turnstileRequired'),
      type: 'warning',
      plain: true,
      showClose: true
    })
    return
  }

  try {
    sendingCode.value = true
    // 后端：[FromForm] string userNo — 使用 x-www-form-urlencoded 表单正文
    const res = await post(
      PWD_EXPIRATION_SEND_API.PWD_EXPIRATION_SEND,
      new URLSearchParams({ userNo: String(form.userNo ?? '').trim(), turnstileToken: turnstileToken.value }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    )

    // 网络故障/HTTP 状态码错误（404/超时等）已在 request.js 内部提示过，这里直接返回，
    // 避免走进下面的 res.code === 200 分支——handled 失败响应里 code 固定为 200 占位，
    // 会被误判为业务成功，弹出一条空文案的“成功”提示
    if (isHandled(res)) {
      resetTurnstile()
      return
    }

    if (res && res.code === 200) {
      ElMessage({
        message: res.message,
        type: 'success',
        plain: true,
        showClose: true
      })

      // 禁用账号输入框
      userNoDisabled.value = true

      // 发送成功这里先不重置：token 已被后端消费，重新验证也不会立刻用到
      // （60 秒倒计时内按钮本就禁用），此刻刷新只会让用户刚看到成功提示又看见验证码闪一下。
      // 真正需要新 token 的时刻是倒计时结束、按钮重新可点时，见 startCountdown()
      startCountdown()
    } else {
      // 告警类业务码（如参数校验不通过）留给用户改完直接重试即可，不必强制刷新人机验证；
      // 真正的错误（接口异常等）才立即重置，保证下一次点击就是新 token
      const isWarning = Number(res?.code) === 400
      if (!isWarning) resetTurnstile()
      ElMessage({
        message: res.message,
        type: isWarning ? 'warning' : 'error',
        plain: true,
        showClose: true
      })
    }
  } catch {
    resetTurnstile()
    ElMessage({
      message: t('passwordExpiration.sendCodeFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    sendingCode.value = false
  }
}

// 修改密码
const handleSubmit = async () => {
  // 使用回调方式进行表单验证，避免异常抛出
  formRef.value.validate(async (valid) => {
    if (!valid) {
      return false
    }
    
    try {
      submitting.value = true
      formDisabled.value = true
      
      // 后端 UserPwdExpiration：{ userNo, passWord, verificationCode }
      const res = await post(PWD_EXPIRATION_UPDATE_API.PWD_EXPIRATION_UPDATE, {
        userNo: form.userNo,
        passWord: form.password,
        verificationCode: form.verificationCode
      })

      // 网络故障/HTTP 状态码错误已在 request.js 内部提示过，这里直接复位，不再重复提示
      if (isHandled(res)) {
        formDisabled.value = false
        return
      }

      if (res && res.code === 200) {
        ElMessage({
          message: res.message,
          type: 'success',
          plain: true,
          showClose: true
        })
        
        // 开始跳转倒计时
        startRedirectCountdown()
      } else {
        ElMessage({
          message: res.message,
          type: Number(res?.code) === 400 ? 'warning' : 'error',
          plain: true,
          showClose: true
        })
        formDisabled.value = false
      }
    } catch {
      ElMessage({
        message: t('passwordExpiration.submitFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
      formDisabled.value = false
    } finally {
      submitting.value = false
    }
  })
}

// 语言切换处理
const handleLanguageChange = (value) => {
  locale.value = value
  localStorage.setItem('language', value)
  // 更新document标题
  document.title = t('common.systemTitle')

  // Turnstile 不支持动态切换语言，需移除后按新语言重新渲染
  if (window.turnstile && turnstileWidgetId !== null) {
    window.turnstile.remove(turnstileWidgetId)
    turnstileWidgetId = null
    turnstileToken.value = ''
    nextTick(() => {
      renderTurnstile()
    })
  }
}

// 返回登录页面
const handleBackToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.password-expiration-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f2f3f5;
  position: relative;
  overflow: hidden;
  padding: 2px;
  flex: 1;
  width: 100%;
}

.password-expiration-container::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    120% 85% at 50% -25%,
    rgba(255, 255, 255, 0.9) 0%,
    transparent 58%
  );
  z-index: 0;
}

/* 工作流主题背景装饰 */
.password-expiration-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}

.password-expiration-box {
  width: 480px;
  padding: 0;
  background-color: #fafbfc;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.06), 0 2px 12px rgba(15, 23, 42, 0.04);
  border: none;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.password-expiration-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 30px;
  background: linear-gradient(180deg, #fcfcfd 0%, #fafbfc 100%);
  color: #4b5563;
}

.logo {
  display: block;
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

/* 强调节点：柔和呼吸效果 */
.wf-active {
  transform-box: fill-box;
  transform-origin: center;
  animation: wfPulse 2.6s ease-in-out infinite;
}

@keyframes wfPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.05); }
}

@media (prefers-reduced-motion: reduce) {
  .wf-active { animation: none; }
  .wf-dot { display: none; }
}

.title {
  font-size: 22px;
  font-weight: 500;
  color: #525865;
  margin: 0;
  letter-spacing: 0.5px;
}

.password-expiration-form-container {
  padding: 16px 40px 40px;
  background-color: #fafbfc;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.expiration-form {
  width: 100%;
  max-width: 400px;
  margin-top: 0;
}

.verification-input-group {
  display: flex;
  gap: 10px;
  width: 100%;
  align-items: center;
}

.verification-input {
  flex: 1;
}

.send-code-button {
  width: 120px;
  height: 40px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: none;
}

.send-code-button:not(:disabled):hover {
  background-color: #eceff2;
  color: #4b5563;
  border-color: #d1d5db;
}

.expiration-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e8eaed inset !important;
  background-color: #ffffff;
  padding: 0 15px;
  height: 40px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.expiration-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.35) inset !important;
  background-color: #ffffff;
}

.expiration-form :deep(.el-input__wrapper:hover:not(.is-focus)) {
  box-shadow: 0 0 0 1px #dde1e6 inset !important;
  background-color: #ffffff;
}

.expiration-form :deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.expiration-form :deep(.el-form-item.is-error .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.expiration-form :deep(.el-form-item.is-error .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.expiration-form :deep(.el-input__inner) {
  line-height: 30px;
  height: 30px;
  padding: 0;
  flex: 1;
}

.expiration-form :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  margin-right: 8px;
  color: #9ca3af;
}

.expiration-form :deep(.el-input__suffix) {
  display: flex;
  align-items: center;
  margin-left: 8px;
  color: #9ca3af;
}

.expiration-form :deep(.el-form-item__label) {
  text-align: left;
  line-height: 45px;
  height: 45px;
  padding-right: 12px;
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  color: #7a8494;
}

.submit-button {
  width: 100%;
  height: 42px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  background: linear-gradient(180deg, #8b9099 0%, #787f8a 100%);
  color: #ffffff;
  border: none;
  margin-top: 10px;
  box-shadow: 0 6px 16px rgba(82, 88, 102, 0.18);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-button:not(:disabled):hover {
  background: linear-gradient(180deg, #7a808a 0%, #6a707a 100%);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(82, 88, 102, 0.22);
}

.submit-button:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(82, 88, 102, 0.15);
}

.submit-button:disabled {
  background: #9ca3af;
  opacity: 0.75;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: 0 2px 8px rgba(82, 88, 102, 0.1) !important;
}

.submit-button-item {
  margin-bottom: 10px;
}

.submit-button-item :deep(.el-form-item__content) {
  line-height: 1;
}

/* 移除必填标记 */
.expiration-form :deep(.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before) {
  content: '';
}

/* 强力禁用浏览器自动填充样式 */
.expiration-form :deep(input:-webkit-autofill),
.expiration-form :deep(input:-webkit-autofill:hover),
.expiration-form :deep(input:-webkit-autofill:focus),
.expiration-form :deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
  -webkit-text-fill-color: #5c6370 !important;
  transition: background-color 5000s ease-in-out 0s !important;
  -webkit-transition: background-color 5000s ease-in-out 0s !important;
}

/* 进一步防止自动填充的样式 */
.expiration-form :deep(input[autocomplete="new-password"]) {
  background: #ffffff !important;
  color: #5c6370 !important;
}

.expiration-form :deep(.el-form-item) {
  margin-bottom: 25px;
}

.expiration-form :deep(.el-form-item:first-child) {
  margin-top: -5px;
}

.language-select {
  width: 100%;
}

.language-select :deep(.el-input__wrapper),
.language-select :deep(.el-select__wrapper) {
  box-shadow: 0 0 0 1px #e8eaed inset !important;
  background-color: #ffffff;
  padding: 0 15px;
  min-height: 40px;
  height: 40px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.turnstile-container {
  width: 100%;
}

.expiration-form :deep(.el-form-item:has(.turnstile-container)) {
  margin-bottom: 20px;
}

.expiration-form :deep(.el-form-item:has(.turnstile-container) .el-form-item__content) {
  justify-content: stretch;
}

.language-select :deep(.el-input__wrapper:hover:not(.is-focus)),
.language-select :deep(.el-select__wrapper.is-hovering:not(.is-focused)) {
  box-shadow: 0 0 0 1px #dde1e6 inset !important;
  background-color: #ffffff;
}

.language-select :deep(.el-input__wrapper.is-focus),
.language-select :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.35) inset !important;
  background-color: #ffffff;
}

.back-to-login-container {
  width: 100%;
  text-align: center;
  margin-top: 15px;
}

/* 响应式调整 */
@media screen and (max-width: 576px) {
  .password-expiration-box {
    width: 90%;
    max-width: 420px;
  }
  
  .password-expiration-form-container {
    padding: 25px 20px;
  }
  
  .expiration-form {
    max-width: 380px;
  }
  
  .verification-input-group {
    flex-direction: column;
    gap: 15px;
  }
  
  .send-code-button {
    width: 100%;
  }
}
</style>