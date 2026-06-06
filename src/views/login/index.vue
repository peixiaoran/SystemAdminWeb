<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" class="logo" alt="Logo" />
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
          } else if (res.code === 400) {
            // 账号不存在
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
  background: #fff;
  position: relative;
  overflow: hidden;
  padding: 2px;
  flex: 1;
  width: 100%;
}

.login-box {
  width: 480px;
  padding: 0;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
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
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
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
  height: 48px;
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
  line-height: 38px;
  height: 38px;
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
  min-height: 48px;
  height: 48px;
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
  line-height: 38px;
  height: 38px;
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

