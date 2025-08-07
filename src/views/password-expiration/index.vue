<template>
  <div class="password-expiration-container">
    <div class="password-expiration-box">
      <div class="password-expiration-header">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" class="logo" alt="Logo" />
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
                {{ countdown > 0 ? `${countdown}s` : $t('passwordExpiration.sendCode') }}
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
import { post } from '@/utils/request'
import { UNLOCKEXPIRATION_SEND_API, PWD_EXPIRATION_UPDATE_API } from '@/config/api/login/api'

const router = useRouter()
const { t, locale } = useI18n()
const formRef = ref()

// 表单数据
const form = reactive({
  userNo: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
  language: localStorage.getItem('language') || 'zh-TW' // 从localStorage获取语言设置
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

// 使用计算属性获取翻译后的语言选项
const languages = computed(() => {
  return {
    'zh-TW': t('passwordExpiration.languages.zh-TW'),
    'en-US': t('passwordExpiration.languages.en-US')
  }
})

// 表单验证规则
const rules = computed(() => ({
  userNo: [
    { required: true, message: t('passwordExpiration.accountRequired'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('passwordExpiration.newPasswordRequired'), trigger: 'blur' }
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
  
  try {
    sendingCode.value = true
    const res = await post(UNLOCKEXPIRATION_SEND_API.UNLOCK_EXPIRATION_SEND, null, {
      params: { userNo: form.userNo }
    })
    
    if (res && res.code === '200') {
      ElMessage({
        message: res.message || t('passwordExpiration.sendCodeSuccess'),
        type: 'success',
        plain: true,
        showClose: true
      })
      
      // 禁用账号输入框
      userNoDisabled.value = true
      
      // 开始倒计时
      startCountdown()
    } else {
      ElMessage({
        message: res.message || t('passwordExpiration.sendCodeFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
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
      
      const res = await post(PWD_EXPIRATION_UPDATE_API.PWD_EXPIRATION_UPDATE, {
        userNo: form.userNo,
        password: form.password,
        verificationCode: form.verificationCode
      })
      
      if (res && res.code === '200') {
        ElMessage({
          message: res.message || t('passwordExpiration.submitSuccess'),
          type: 'success',
          plain: true,
          showClose: true
        })
        
        // 开始跳转倒计时
        startRedirectCountdown()
      } else {
        ElMessage({
          message: res.message || t('passwordExpiration.submitFailed'),
          type: 'error',
          plain: true,
          showClose: true
        })
        formDisabled.value = false
      }
    } catch (error) {
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
  background: #fff;
  position: relative;
  overflow: hidden;
  padding: 2px;
  flex: 1;
  width: 100%;
}

.password-expiration-box {
  width: 500px;
  padding: 0;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(50, 50, 93, 0.1), 0 8px 20px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  backdrop-filter: blur(5px);
  z-index: 1;
  border: 1px solid #ebeef5;
}

.password-expiration-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  background: linear-gradient(135deg, #FFA726 0%, #FF8A65 100%);
  color: white;
}

.logo {
  width: 70px;
  height: 70px;
  margin-bottom: 18px;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.password-expiration-form-container {
  padding: 50px 40px;
  background-color: #f5f7fa;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.expiration-form {
  width: 100%;
  max-width: 400px;
  margin-top: -10px;
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
  height: 36px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expiration-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px rgba(200, 200, 200, 0.8) inset;
  padding: 0 15px;
  height: 44px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.expiration-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.5) inset;
}

.expiration-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.5) inset;
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
  line-height: 38px;
  height: 38px;
  padding: 0;
  flex: 1;
}

.expiration-form :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.expiration-form :deep(.el-input__suffix) {
  display: flex;
  align-items: center;
  margin-left: 8px;
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
  color: #606266;
}

.submit-button {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #FFA726 0%, #FF8A65 100%);
  border: none;
  margin-left: 0;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.1);
}

.submit-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px rgba(50, 50, 93, 0.15);
  background: linear-gradient(135deg, #FFB74D 0%, #FFAB91 100%);
}

.submit-button:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(50, 50, 93, 0.1);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.1) !important;
}

.submit-button:disabled:hover {
  background: linear-gradient(135deg, #FFA726 0%, #FF8A65 100%) !important;
  transform: none !important;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.1) !important;
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
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #606266 !important;
  transition: background-color 5000s ease-in-out 0s !important;
  -webkit-transition: background-color 5000s ease-in-out 0s !important;
}

/* 进一步防止自动填充的样式 */
.expiration-form :deep(input[autocomplete="new-password"]) {
  background: white !important;
  color: #606266 !important;
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

.language-select :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px rgba(200, 200, 200, 0.8) inset;
  padding: 0 15px;
  height: 44px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.language-select :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.5) inset;
}

.language-select :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.5) inset;
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