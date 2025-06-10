<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" class="logo" alt="Logo" />
        <h1 class="title">{{ $t('login.title') }}</h1>
      </div>
      
      <div class="login-form-container">
        
        <!-- 添加虚假的输入框来欺骗浏览器 -->
        <div style="position: absolute; left: -9999px; opacity: 0;">
          <input type="text" name="fake_username" tabindex="-1" />
          <input type="password" name="fake_password" tabindex="-1" />
        </div>
        
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          size="large"
          autocomplete="new-password"
        >
          
          <el-form-item prop="loginNo">
            <el-input
              v-model="loginForm.loginNo"
              :placeholder="$t('login.usernamePlaceholder')"
              clearable
              autocomplete="new-password"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              data-lpignore="true"
              data-form-type="other"
              :name="'username_' + Math.random().toString(36).substr(2, 9)"
              readonly
              @focus="handleInputFocus"
            />
          </el-form-item>
          
          <el-form-item prop="passWrod">
            <el-input
              v-model="loginForm.passWrod"
              type="password"
              :placeholder="$t('login.passwordPlaceholder')"
              show-password
              autocomplete="new-password"
              autocapitalize="off"
              autocorrect="off"
              spellcheck="false"
              data-lpignore="true"
              data-form-type="other"
              :name="'password_' + Math.random().toString(36).substr(2, 9)"
              readonly
              @focus="handleInputFocus"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          
          <el-form-item prop="factory">
            <el-select 
              v-model="loginForm.factory" 
              :placeholder="$t('login.factoryPlaceholder')"
              class="factory-select"
            >
              <el-option v-for="(label, value) in factories" :key="value" :label="label" :value="value" />
            </el-select>
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
              class="login-button"
              @click="handleLogin"
            >
              {{ $t('login.loginButton') }}
            </el-button>
          </el-form-item>
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

const { t, locale } = useI18n()
const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  loginNo: '',
  passWrod: '',
  factory: 'ESK', // 默认设置为昆山乙盛
  language: localStorage.getItem('language') || 'zh-CN' // 从localStorage获取语言设置
})

// 在组件挂载后进行初始化
onMounted(() => {
  // 重置表单验证状态
  nextTick(() => {
    loginFormRef.value?.resetFields()
    
    // 清除可能的浏览器自动填充
    setTimeout(() => {
      const inputs = document.querySelectorAll('.login-form input')
      inputs.forEach(input => {
        if (input.value && (input.name.includes('username') || input.name.includes('password'))) {
          input.value = ''
        }
      })
      // 确保表单数据也清空
      loginForm.loginNo = ''
      loginForm.passWrod = ''
    }, 100)
  })
})

// 使用计算属性获取翻译后的选项
const factories = computed(() => {
  return {
    ESK: t('login.factories.ESK'),
    ETW: t('login.factories.ETW'),
    ESW: t('login.factories.ESW'),
    ESD: t('login.factories.ESD'),
    ESC: t('login.factories.ESC'),
    EMY: t('login.factories.EMY'),
    EMJ: t('login.factories.EMJ'),
    ESV: t('login.factories.ESV'),
    EST: t('login.factories.EST'),
    ESH: t('login.factories.ESH'),
    ESM: t('login.factories.ESM'),
    MTY: t('login.factories.MTY')
  }
})

const languages = computed(() => {
  return {
    'zh-CN': t('login.languages.zh-CN'),
    'zh-TW': t('login.languages.zh-TW'),
    'en-US': t('login.languages.en-US'),
    'vi-VN': t('login.languages.vi-VN')
  }
})

// 登录表单验证规则
const loginRules = computed(() => {
  return {
    loginNo: [
      { required: true, message: t('login.usernameRequired'), trigger: 'blur' }
    ],
    passWrod: [
      { required: true, message: t('login.passwordRequired'), trigger: 'blur' }
    ],
    factory: [
      { required: true, message: t('login.factoryRequired'), trigger: 'change' }
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

// 处理输入框焦点事件，移除readonly属性
const handleInputFocus = (event) => {
  event.target.removeAttribute('readonly')
}

const handleLogin = () => {
  loginFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true

      // 保存语言和厂区选择到localStorage
      localStorage.setItem('language', loginForm.language)
      localStorage.setItem('factory', loginForm.factory)

      // 使用封装的post方法，它会使用环境变量中的API基础URL
      post(LOGIN_API.USER_LOGIN, {
        loginNo: loginForm.loginNo,
        passWrod: loginForm.passWrod
      })
        .then(res => {
          
          if (res.code === '200') {
            // 保存token
            localStorage.setItem('token', res.data)
            // 设置标题
            document.title = t('common.systemTitle')
            
            // 获取用户store
            const userStore = useUserStore()
            // 设置token
            userStore.setToken(res.data)
            
            // 路由现在是静态的，不需要加载动态路由
    
            
            // 直接跳转到模块选择页
            router.push('/module-select')
          } else {
            ElMessage.error(res.message || t('login.loginFailed'))
          }
        })
        .catch(error => {
          ElMessage.error(t('login.loginFailedTip'))
        })
        .finally(() => {
          loading.value = false
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
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  position: relative;
  overflow: hidden;
  padding: 2px;
  flex: 1;
  width: 100%;
}

.login-container::before {
  content: "";
  position: absolute;
  top: -50px;
  left: -50px;
  right: -50px;
  bottom: -50px;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23bdc3c7' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  z-index: 0;
  animation: backgroundMove 60s linear infinite;
}

@keyframes backgroundMove {
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(20px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
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
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
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
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
  border: none;
  margin-left: 0;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.1);
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 8px rgba(50, 50, 93, 0.15);
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

/* 移除必填标记 */
.login-form :deep(.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before) {
  content: '';
}

/* 禁用浏览器自动填充样式 */
.login-form :deep(input:-webkit-autofill) {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #606266 !important;
  transition: background-color 5000s ease-in-out 0s;
}

.login-form :deep(input:-webkit-autofill:hover) {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #606266 !important;
}

.login-form :deep(input:-webkit-autofill:focus) {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #606266 !important;
}

.login-form :deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  -webkit-text-fill-color: #606266 !important;
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

