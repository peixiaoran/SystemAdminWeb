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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { LOGIN_API } from '@/config/api/login/api'
import { useUserStore } from '@/stores/user'
import { useI18n } from 'vue-i18n'
import { User, Lock } from '@element-plus/icons-vue' // 新增图标引入

const { t, locale } = useI18n()
const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

// 移除了动态字段名生成逻辑，简化防自动填充机制

const loginForm = reactive({
  loginNo: '',
  password: '',
  language: localStorage.getItem('language') || 'zh-CN' // 从localStorage获取语言设置
})

// 在组件挂载后进行初始化
onMounted(() => {
  // 清除登录过期提示标志（不再显示警告提示）
  localStorage.removeItem('sessionExpired')
  
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
      post(LOGIN_API.USER_LOGIN, {
        loginNo: loginForm.loginNo,
        password: loginForm.password
      }).then(res => {
          if (res.code === 200) {
            // 设置标题
            document.title = t('common.systemTitle')
            // 获取员工store
            const userStore = useUserStore()
            // 处理返回的数据
            if (res.data) {
              // 设置token
              if (res.data.token) {
                userStore.setToken(res.data.token)
              } else if (res.data) {
                // 如果直接返回的是token字符串
                userStore.setToken(res.data)
              }
              
              // 设置用户信息
              userStore.setUserInfo({
                userId: res.data.userId || '',
                userNameCn: res.data.userNameCn || '',
                userNameEn: res.data.userNameEn || '',
                loginNo: res.data.loginNo || loginForm.loginNo,
                avatar: res.data.avatarAddress || ''
              })
            }
            
            // 直接跳转到模块选择页
            router.push('/module-select')
            loading.value = false
          } else if (res.code === 210) {
            // 密码过期，显示警告消息后跳转到密码过期修改页面
            // 保持loading状态为true，禁用登录按钮
            ElMessage({
              message: res.message,
              type: 'warning',
              plain: true,
              showClose: true,
              duration: 3000
            })
            setTimeout(() => {
              router.push('/password-expiration')
            }, 1500)
          } else if (res.code === 220) {
            // 账户被锁定，显示警告消息后跳转到解锁页面
            // 保持loading状态为true，禁用登录按钮
            ElMessage({
              message: res.message,
              type: 'warning',
              plain: true,
              showClose: true,
              duration: 3000
            })
            setTimeout(() => {
              router.push('/unlock')
            }, 1500)
          } else {
            ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true,
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
          // 只有在非密码过期和非账户锁定的情况下才重置loading状态
          // 密码过期(210)和账户锁定(220)需要保持按钮禁用状态
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

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  background: linear-gradient(135deg, #409EFF 0%, #1890ff 100%);
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

.login-form-container {
  padding: 50px 40px;
  background-color: #f5f7fa;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-form {
  width: 100%;
  max-width: 400px;
  margin-top: -10px;
}

.login-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px rgba(200, 200, 200, 0.8) inset;
  padding: 0 15px;
  height: 44px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.5) inset;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.5) inset;
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

.login-form :deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px rgba(200, 200, 200, 0.8) inset;
  padding: 0 15px;
  height: 44px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.login-form :deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.5) inset;
}

.login-form :deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.5) inset;
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
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #409EFF 0%, #1890ff 100%);
  border: none;
  margin-left: 0;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.1);
}

.login-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(50, 50, 93, 0.1);
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

