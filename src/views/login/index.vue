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
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="loginNo">
            <el-input
              v-model="loginForm.loginNo"
              :placeholder="$t('login.usernamePlaceholder')"
              clearable
              :name="'username_' + randomStr"
              autocomplete="new-password"
              data-lpignore="true"
            />
          </el-form-item>
          
          <el-form-item prop="passWrod">
            <el-input
              v-model="loginForm.passWrod"
              type="password"
              :placeholder="$t('login.passwordPlaceholder')"
              show-password
              :name="'password_' + randomStr"
              autocomplete="new-password"
              data-lpignore="true"
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
              native-type="submit"
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { LOGIN_API } from '@/config/api/login/api'
import { addDynamicRoutes, clearRoutesCache } from '@/router'
import { useUserStore } from '@/stores/user'
import { useRouteStore } from '@/stores/route'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const randomStr = ref(Math.random().toString(36).substring(2, 15))

const loginForm = reactive({
  loginNo: '',
  passWrod: '',
  factory: 'ESK',
  language: localStorage.getItem('language') || 'zh-CN'
})

// 初始化清空表单
onMounted(() => {
  loginForm.loginNo = ''
  loginForm.passWrod = ''
})

const factories = computed(() => ({
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
}))

const languages = computed(() => ({
  'zh-CN': t('login.languages.zh-CN'),
  'zh-TW': t('login.languages.zh-TW'),
  'en-US': t('login.languages.en-US'),
  'vi-VN': t('login.languages.vi-VN')
}))

const loginRules = computed(() => ({
  loginNo: [
    { required: true, message: t('login.usernameRequired'), trigger: 'blur' }
  ],
  passWrod: [
    { required: true, message: t('login.passwordRequired'), trigger: 'blur' }
  ],
  factory: [
    { required: true, message: t('login.factoryRequired'), trigger: 'change' }
  ]
}))

const handleLanguageChange = (value) => {
  locale.value = value
  localStorage.setItem('language', value)
  document.title = t('common.systemTitle')
}

const handleLogin = () => {
  loginFormRef.value.validate(valid => {
    if (valid) {
      loading.value = true
      localStorage.setItem('language', loginForm.language)
      localStorage.setItem('factory', loginForm.factory)

      post(LOGIN_API.USER_LOGIN, {
        loginNo: loginForm.loginNo,
        passWrod: loginForm.passWrod
      })
        .then(res => {
          if (res.code === '200') {
            localStorage.setItem('token', res.data)
            document.title = t('common.systemTitle')
            const userStore = useUserStore()
            userStore.setToken(res.data)
            
            // 先清除路由缓存，确保加载最新路由
            clearRoutesCache()
            
            // 加载动态路由并跳转
            console.log('登录成功，开始加载动态路由')
            addDynamicRoutes()
              .then(success => {
                if (success) {
                  console.log('动态路由加载成功，跳转到模块选择页')
                } else {
                  console.warn('动态路由加载失败，但仍然继续')
                }
                // 无论成功失败，都跳转到模块选择页
                router.push('/module-select')
              })
              .catch(error => {
                console.error('动态路由加载出错:', error)
                // 出错仍然跳转
                router.push('/module-select')
              })
          } else {
            ElMessage.error(res.message || t('login.loginFailed'))
          }
        })
        .catch(error => ElMessage.error(t('login.loginFailedTip')))
        .finally(() => loading.value = false)
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
}

.login-box {
  width: 500px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(50, 50, 93, 0.1);
  overflow: hidden;
}

.login-header {
  padding: 30px 0;
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
  color: white;
  text-align: center;
}

.logo {
  width: 70px;
  height: 70px;
  margin-bottom: 18px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.login-form-container {
  padding: 50px 40px;
  background-color: #f5f7fa;
}

.login-form {
  width: 100%;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
}

@media screen and (max-width: 576px) {
  .login-box {
    width: 90%;
  }
  .login-form-container {
    padding: 25px 20px;
  }
}
</style>