<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" class="logo" alt="Logo" />
        <h1 class="title">Vue Admin管理系统</h1>
      </div>
      
      <div class="login-form-container">
        
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          size="large"
          autocomplete="off"
        >
          <!-- 添加隐藏的用户名和密码字段，用于迷惑浏览器的自动填充 -->
          <input type="text" style="display:none" />
          <input type="password" style="display:none" />
          
          <el-form-item prop="loginNo" label="用户名">
            <el-input
              v-model="loginForm.loginNo"
              placeholder="请输入用户名"
              clearable
              :name="'username_' + randomStr"
              autocomplete="off"
              data-lpignore="true"
            />
          </el-form-item>
          
          <el-form-item prop="passWrod" label="密码">
            <el-input
              v-model="loginForm.passWrod"
              type="password"
              placeholder="请输入密码"
              show-password
              :name="'password_' + randomStr"
              autocomplete="off"
              data-lpignore="true"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          
          <el-form-item prop="factory" label="厂区">
            <el-select 
              v-model="loginForm.factory" 
              placeholder="请选择厂区"
              class="factory-select"
            >
              <el-option label="乙盛台灣" value="ETW" />
              <el-option label="無錫欣冠" value="ESW" />
              <el-option label="東莞乙宏" value="ESD" />
              <el-option label="煙台正乙" value="ESC" />
              <el-option label="馬來西亞" value="EMY" />
              <el-option label="馬來西亞" value="EMJ" />
              <el-option label="越南厂" value="ESV" />
              <el-option label="墨西哥MUSG" value="EST" />
              <el-option label="新加坡ESONSG" value="ESH" />
              <el-option label="蒙特雷" value="ESM" />
              <el-option label="新加坡ESONSG" value="MTY" />
            </el-select>
          </el-form-item>
          
          <el-form-item prop="language" label="语言">
            <el-select 
              v-model="loginForm.language" 
              placeholder="请选择语言"
              class="language-select"
            >
              <el-option label="中文简体" value="zh-CN" />
              <el-option label="中文繁体" value="zh-TW" />
              <el-option label="English" value="en-US" />
              <el-option label="Việt Nam" value="vi-VN" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="login-button"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { LOGIN_API } from '@/config/api/login/api'
import { addRoutes } from '@/router'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
// 生成随机字符串，用于每次页面加载时创建不同的input name
const randomStr = ref(Math.random().toString(36).substring(2, 15))

const loginForm = reactive({
  loginNo: '',
  passWrod: '',
  factory: 'ETW', // 默认设置为乙盛台灣
  language: 'zh-CN' // 默认设置为中文简体
})

// 在组件挂载后清除表单内容
onMounted(() => {
  // 确保表单清空，防止浏览器填充
  loginForm.loginNo = ''
  loginForm.passWrod = ''
  
  // 延迟后再次清空，以防止某些浏览器在页面加载后延迟填充
  setTimeout(() => {
    loginForm.loginNo = ''
    loginForm.passWrod = ''
  }, 100)
})

const loginRules = {
  loginNo: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  passWrod: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  factory: [
    { required: true, message: '请选择厂区', trigger: 'change' }
  ]
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
        ...loginForm,
        language: loginForm.language || 'zh-CN', // 确保有默认值
        factory: loginForm.factory || 'ETW' // 确保有默认值
      })
        .then(res => {
          
          if (res.code === '200') {
            localStorage.setItem('token', res.data)
            // 设置固定标题
            document.title = 'SystemsAdmin管理系统'
            // 登录成功后添加动态路由
            addRoutes()
            ElMessage.success(res.message || '登录成功')
            router.push('/module-select')
          } else {
            ElMessage.error(res.message || '登录失败')
          }
        })
        .catch(error => {
          ElMessage.error('登录请求失败，请稍后重试')
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
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
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
  font-size: 26px;
  font-weight: 600;
  color: white;
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-form-container {
  padding: 45px 50px;
  background-color: #f5f7fa;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.login-form {
  width: 100%;
}

.login-form :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px rgba(220, 223, 230, 0.6) inset;
  padding: 0 15px;
  height: 38px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.3) inset;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.3) inset;
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
  box-shadow: 0 0 0 1px rgba(220, 223, 230, 0.6) inset;
  padding: 0 15px;
  height: 38px;
  border-radius: 4px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
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
  width: 60px;
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
}

.login-button {
  width: 75%;
  height: 38px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #409EFF 0%, #337ecc 100%);
  border: none;
  margin-left: 60px;
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
    max-width: 450px;
  }
  
  .login-form-container {
    padding: 30px 35px;
  }
}

.language-select {
  width: 100%;
}

/* 移除必填标记 */
.login-form :deep(.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before) {
  content: '';
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
  margin-bottom: 20px;
}
</style> 