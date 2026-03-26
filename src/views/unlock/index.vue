<template>
  <div class="unlock-container">
    <div class="unlock-box">
      <div class="unlock-header">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" class="logo" alt="Logo" />
        <h1 class="title">{{ $t('unlock.title') }}</h1>
      </div>
      
      <div class="unlock-form-container">
        <el-form
          ref="unlockFormRef"
          :model="unlockForm"
          :rules="unlockRules"
          class="unlock-form"
          size="large"
          autocomplete="off"
          @submit.prevent
        >
          <el-form-item prop="userNo">
            <el-input
              v-model="unlockForm.userNo"
              :placeholder="$t('unlock.userNoPlaceholder')"
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
              v-model="unlockForm.password"
              type="password"
              :placeholder="$t('unlock.newPasswordPlaceholder')"
              :disabled="passwordDisabled || redirectCountdown > 0"
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
              v-model="unlockForm.confirmPassword"
              type="password"
              :placeholder="$t('unlock.confirmPasswordPlaceholder')"
              :disabled="passwordDisabled || redirectCountdown > 0"
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
          
          <el-form-item prop="verificationCode">
            <div class="verification-input-group">
              <el-input
                v-model="unlockForm.verificationCode"
                :placeholder="$t('unlock.verificationCodePlaceholder')"
                :disabled="redirectCountdown > 0"
                clearable
                autocomplete="off"
                autocapitalize="off"
                autocorrect="off"
                spellcheck="false"
                data-lpignore="true"
                data-form-type="other"
                @keyup.enter="handleUnlock"
                class="verification-input"
              >
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
              <el-button
                :loading="sendCodeLoading"
                :disabled="countdown > 0 || redirectCountdown > 0"
                class="send-code-button"
                @click="handleSendCode"
              >
                {{ countdown > 0 ? `${countdown}${$t('common.retryAfterSeconds')}` : $t('unlock.sendCode') }}
              </el-button>
            </div>
          </el-form-item>
          
          <el-form-item prop="language">
            <el-select 
              v-model="unlockForm.language" 
              :placeholder="$t('unlock.languagePlaceholder')"
              class="language-select"
              @change="handleLanguageChange"
            >
              <el-option v-for="(label, value) in languages" :key="value" :label="label" :value="value" />
            </el-select>
          </el-form-item>
          
          <el-form-item class="unlock-button-item">
            <el-button
              type="primary"
              :loading="unlockLoading"
              :disabled="redirectCountdown > 0"
              class="login-button"
              @click="handleUnlock"
            >
              {{ redirectCountdown > 0 ? `${redirectCountdown}${$t('unlock.redirectCountdownText')}` : $t('unlock.unlockButton') }}
            </el-button>
          </el-form-item>
          <div class="unlock-link-container">
              <el-link 
                type="info"
                :disabled="redirectCountdown > 0"
                @click="handleLogin"
                >{{ $t('login.backToLogin') }}
              </el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { UNLOCK_SEND_API, UNLOCK_API } from '@/config/api/login/api'
import { useI18n } from 'vue-i18n'
import { User, Lock, Message } from '@element-plus/icons-vue' // 新增图标引入

const { t, locale } = useI18n()
const router = useRouter()
const unlockFormRef = ref(null)
const unlockLoading = ref(false)
const sendCodeLoading = ref(false)
const countdown = ref(0)
const redirectCountdown = ref(0)
const userNoDisabled = ref(false)
const passwordDisabled = ref(false)
let countdownTimer = null
let redirectTimer = null

const unlockForm = reactive({
  userNo: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
  language: localStorage.getItem('language') || 'zh-CN' // 从localStorage获取语言设置
})

// 在组件挂载后进行初始化
onMounted(() => {
  // 重置表单验证状态
  nextTick(() => {
    unlockFormRef.value?.resetFields()
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
})

// 使用计算属性获取翻译后的选项
const languages = computed(() => {
  return {
    'zh-CN': t('unlock.languages.zh-CN'),
    'en-US': t('unlock.languages.en-US')
  }
})

// 密码强度验证函数
const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error(t('unlock.newPasswordRequired')))
    return
  }
  
  // 长度验证：8-16位
  if (value.length < 8 || value.length > 16) {
    callback(new Error(t('unlock.passwordLengthError')))
    return
  }
  
  // 包含小写字母
  if (!/[a-z]/.test(value)) {
    callback(new Error(t('unlock.passwordLowercaseError')))
    return
  }
  
  // 包含大写字母
  if (!/[A-Z]/.test(value)) {
    callback(new Error(t('unlock.passwordUppercaseError')))
    return
  }
  
  // 包含数字
  if (!/[0-9]/.test(value)) {
    callback(new Error(t('unlock.passwordNumberError')))
    return
  }
  
  // 包含特殊字符
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    callback(new Error(t('unlock.passwordSpecialCharError')))
    return
  }
  
  callback()
}

// 解锁表单验证规则
const unlockRules = computed(() => {
  return {
    userNo: [
      { required: true, message: t('unlock.userNoRequired'), trigger: 'blur' }
    ],
    password: [
      { validator: validatePassword, trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: t('unlock.confirmPasswordRequired'), trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== unlockForm.password) {
            callback(new Error(t('unlock.passwordMismatch')))
          } else {
            callback()
          }
        },
        trigger: 'blur'
      }
    ],
    verificationCode: [
      { required: true, message: t('unlock.verificationCodeRequired'), trigger: 'blur' }
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

// 跳转到登录页面
const handleLogin = () => {
  router.push('/login')
}

// 发送验证码
const handleSendCode = () => {
  if (!unlockForm.userNo || !unlockForm.password || !unlockForm.confirmPassword) {
    return
  }

  sendCodeLoading.value = true

  post(
    UNLOCK_SEND_API.UNLOCK_SEND,
    new URLSearchParams({ userNo: String(unlockForm.userNo ?? '').trim() }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  )
    .then(res => {
          if (res.code === 200) {
            ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true,
            })
            // 禁用用户名输入框
            userNoDisabled.value = true
            // 开始倒计时
            startCountdown()
          } else {
            ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true,
            })
          }
        })
        .catch(error => {
          ElMessage({
            message: error.message || t('unlock.sendCodeFailed'),
            type: 'error',
            plain: true,
            showClose: true,
          })
        })
    .finally(() => {
      sendCodeLoading.value = false
    })
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
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

// 解锁
const handleUnlock = () => {
  unlockFormRef.value.validate(valid => {
    if (valid) {
      unlockLoading.value = true

      // 保存语言选择到localStorage
      localStorage.setItem('language', unlockForm.language)

      post(UNLOCK_API.UNLOCK, {
        userNo: unlockForm.userNo,
        password: unlockForm.password,
        verificationCode: unlockForm.verificationCode
      })
        .then(res => {
          if (res.code === 200) {
            ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true,
            })
            // 禁用返回登录链接
            userNoDisabled.value = true
            passwordDisabled.value = true
            // 开始跳转倒计时
            startRedirectCountdown()
          } else {
            ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true,
            })
          }
        })
        .catch(error => {
          ElMessage({
            message: error.message || t('unlock.unlockRequestFailed'),
            type: 'error',
            plain: true,
            showClose: true,
          })
        })
        .finally(() => {
          unlockLoading.value = false
        })
    }
  })
}
</script>

<style scoped>
.unlock-container {
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

.unlock-container::before {
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

.unlock-box {
  width: 480px;
  padding: 0;
  background-color: #fafbfc;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.06), 0 2px 12px rgba(15, 23, 42, 0.04);
  border: none;
  overflow: hidden;
  z-index: 1;
}

.unlock-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 30px;
  background: linear-gradient(180deg, #fcfcfd 0%, #fafbfc 100%);
  color: #4b5563;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
}

.title {
  font-size: 22px;
  font-weight: 500;
  color: #525865;
  margin: 0;
  letter-spacing: 0.5px;
}

.unlock-form-container {
  padding: 16px 40px 40px;
  background-color: #fafbfc;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.unlock-form {
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

/* 与登录页输入区层次一致：浅底、细边框；高度与输入框 48px 对齐 */
.send-code-button {
  width: 120px;
  height: 48px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa !important;
  border: 1px solid #e4e7ed !important;
  color: #1a1a1a !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.send-code-button:not(:disabled):hover {
  background-color: #f5f5f5 !important;
  color: #1a1a1a !important;
  border-color: #dcdfe6 !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
}

.unlock-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e8eaed inset !important;
  background-color: #f3f4f6;
  padding: 0 15px;
  height: 48px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.unlock-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.35) inset !important;
  background-color: #ffffff;
}

.unlock-form :deep(.el-input__wrapper:hover:not(.is-focus)) {
  box-shadow: 0 0 0 1px #dde1e6 inset !important;
  background-color: #eef0f3;
}

.unlock-form :deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.unlock-form :deep(.el-form-item.is-error .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.unlock-form :deep(.el-form-item.is-error .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.unlock-form :deep(.el-input__inner) {
  line-height: 38px;
  height: 38px;
  padding: 0;
  flex: 1;
}

.unlock-form :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  margin-right: 8px;
  color: #9ca3af;
}

.unlock-form :deep(.el-input__suffix) {
  display: flex;
  align-items: center;
  margin-left: 8px;
  color: #9ca3af;
}

.unlock-form :deep(.el-select) {
  width: 100%;
}

.unlock-form :deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px #e8eaed inset !important;
  background-color: #f3f4f6;
  padding: 0 15px;
  height: 48px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.unlock-form :deep(.el-select .el-input__wrapper:hover:not(.is-focus)) {
  box-shadow: 0 0 0 1px #dde1e6 inset !important;
  background-color: #eef0f3;
}

.unlock-form :deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.35) inset !important;
  background-color: #ffffff;
}

.unlock-form :deep(.el-select .el-input__inner) {
  line-height: 38px;
  height: 38px;
  padding: 0;
  flex: 1;
}

.unlock-form :deep(.el-form-item__label) {
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

.unlock-form :deep(.el-form-item__content) {
  line-height: 45px;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

/* 与登录页 .login-button 一致（覆盖 el-button primary 默认色） */
.login-button {
  width: 100%;
  height: 42px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  background: #1a1a1a !important;
  color: #ffffff !important;
  border: none !important;
  margin-top: 10px;
  box-shadow: 0 8px 16px rgba(26, 26, 26, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-button:hover:not(:disabled) {
  background: #303133 !important;
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(26, 26, 26, 0.2);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 8px rgba(26, 26, 26, 0.15);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  background: #1a1a1a !important;
  box-shadow: 0 4px 12px rgba(26, 26, 26, 0.08) !important;
}

.unlock-link-container {
  width: 100%;
  text-align: center;
  margin-top: 10px;
}

/* 响应式调整 */
@media screen and (max-width: 576px) {
  .unlock-box {
    width: 90%;
    max-width: 420px;
  }
  
  .unlock-form-container {
    padding: 25px 20px;
  }
  
  .unlock-form {
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

.language-select {
  width: 100%;
}

.unlock-button-item {
  margin-bottom: 10px;
}

.unlock-button-item :deep(.el-form-item__content) {
  line-height: 1;
}

/* 移除必填标记 */
.unlock-form :deep(.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before) {
  content: '';
}

/* 强力禁用浏览器自动填充样式 */
.unlock-form :deep(input:-webkit-autofill),
.unlock-form :deep(input:-webkit-autofill:hover),
.unlock-form :deep(input:-webkit-autofill:focus),
.unlock-form :deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px #f3f4f6 inset !important;
  -webkit-text-fill-color: #5c6370 !important;
  transition: background-color 5000s ease-in-out 0s !important;
  -webkit-transition: background-color 5000s ease-in-out 0s !important;
}

/* 进一步防止自动填充的样式 */
.unlock-form :deep(input[autocomplete="new-password"]) {
  background: #f3f4f6 !important;
  color: #5c6370 !important;
}

.unlock-form :deep(.el-form-item) {
  margin-bottom: 25px;
}

.unlock-form :deep(.el-form-item:first-child) {
  margin-top: -5px;
}

</style>