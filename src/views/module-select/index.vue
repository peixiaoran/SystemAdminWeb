<template>
  <div class="module-select-container">
    <div class="header-actions">
      <language-switcher class="language-switcher" />
      <div class="user-info">
        <el-dropdown trigger="click">
          <div class="user-avatar-wrapper">
            <div class="user-avatar">
              <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
              <div class="user-details">
                <span class="username">{{ username }}</span>
                <span class="role-tag"></span>
              </div>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <el-icon><User /></el-icon>
                <span>{{ $t('moduleSelect.userInfo') }}</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-icon><Setting /></el-icon>
                <span>{{ $t('moduleSelect.accountSettings') }}</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="margin-right: 8px;">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span>{{ $t('common.safeLogout') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="module-grid">
      <el-row :gutter="30" justify="center">
        <el-col 
          :xs="24" 
          :sm="modules.length === 1 ? 16 : 12" 
          :md="modules.length === 1 ? 12 : 8" 
          :lg="modules.length === 1 ? 10 : 6" 
          :xl="modules.length === 1 ? 8 : 4" 
          v-for="module in modules" 
          :key="module.domainId"
        >
          <div class="module-card" @click="enterModule(module)">
            <div class="module-icon">
              <el-icon :size="54">
                <component :is="module.domainIcon" />
              </el-icon>
            </div>
            <div class="module-info">
              <h2>{{ module.domainName }}</h2>
              <p>{{ module.remarks }}</p>
            </div>
            <div class="module-footer">
              <el-button type="primary" text>
                <span>{{ $t('common.enter') }}</span>
                <el-icon class="enter-icon"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 添加加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-empty :description="$t('moduleSelect.moduleLoading')" :image-size="100">
        <template #image>
          <el-icon :size="60" class="rotating-icon"><Loading /></el-icon>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Loading, User, Setting, ArrowRight } from '@element-plus/icons-vue'
import { post } from '@/utils/request'
import { MODULE_API } from '@/config/api/domainmenu/menu'
import { useUserStore } from '@/stores/user'
import { useModuleStore } from '@/stores/module'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t } = useI18n()
const router = useRouter()
const username = ref('管理员')
const modules = ref([])
const loading = ref(true)
const userStore = useUserStore()
const moduleStore = useModuleStore()

// 获取模块数据
const fetchModules = async () => {
  try {
    loading.value = true
    
    // 使用post方法请求模块数据，不需要请求参数
    const res = await post(MODULE_API.GET_MODULES)
    
    if (res && res.code === '200') {
      modules.value = res.data || []
      // 提取所有模块路径
      const modulePaths = modules.value.map(module => ({
        domainId: module.domainId,
        domainName: module.domainName,
        path: module.path
      }))
    } else {
      ElMessage.error(res?.message || t('moduleSelect.moduleError'))
    }
  } catch (error) {
    ElMessage.error(t('moduleSelect.moduleErrorRetry'))
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取模块数据
onMounted(() => {
  fetchModules()
})

// 进入模块
const enterModule = (module) => {
  if (!module || !module.domainId || !module.path) {
    ElMessage.error(t('moduleSelect.moduleIncomplete'))
    return
  }
  
  // 获取模块标识符（用于构建路由路径）
  const moduleIdentifier = module.path.split('/').filter(Boolean)[0] // 提取模块标识符
  
  // 使用新的模块存储来保存模块信息
  moduleStore.setCurrentModule(
    String(module.domainId), 
    module.domainName, 
    moduleIdentifier
  )
  
  // 检查是否有未关闭的标签
  try {
    const tabsData = localStorage.getItem('tabs-store')
    if (tabsData) {
      const { visitedTabs, activeTabName } = JSON.parse(tabsData)
      
      // 如果有访问过的标签且有活动标签
      if (Array.isArray(visitedTabs) && visitedTabs.length > 0 && activeTabName) {
        // 检查最后活动的标签是否属于当前模块
        if (activeTabName.startsWith(`/${moduleIdentifier}/`)) {
          console.log('恢复上次会话，跳转到:', activeTabName)
          // 直接跳转到最后活动的标签页
          router.push(activeTabName)
          return
        }
      }
    }
  } catch (error) {
    console.error('读取标签数据失败:', error)
  }
  
  // 如果没有未关闭的标签或标签不属于当前模块，则跳转到模块首页
  console.log('进入模块:', moduleIdentifier)
  router.push(`/${moduleIdentifier}/index`)
}

// 退出登录
const logout = async () => {
  try {
    // 确认对话框
    await ElMessageBox.confirm(t('common.confirmLogout'), t('common.tip'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
    
    // 调用退出登录接口
    await userStore.logout()
    
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('common.failed'))
    }
  }
}
</script>

<style scoped>
.module-select-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px 30px 60px;
  overflow: hidden;
}

.module-select-container::before {
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

.header-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: transparent;
  position: relative;
  z-index: 1;
}

.language-switcher {
  margin-right: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar-wrapper {
  cursor: pointer;
}

.user-avatar {
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-avatar:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.user-details {
  margin: 0 8px;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.dropdown-icon {
  color: #909399;
  font-size: 12px;
}

.module-grid {
  max-width: 1440px;
  margin: 20px auto 0;
  padding: 20px 0;
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.el-row {
  margin: 0 -15px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.el-col {
  padding: 0 15px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.module-card {
  width: 100%;
  min-width: 260px;
  height: 320px;
  background-color: #fff;
  border-radius: 16px;
  border: 1px solid #e4e7ed;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.module-icon {
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #3b82f6;
  padding: 10px 0;
}

.module-info {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  text-align: center;
  border-top: 1px solid #ebeef5;
}

.module-info h2 {
  font-size: 22px;
  margin: 0 0 16px 0;
  color: #303133;
  font-weight: 600;
}

.module-info p {
  font-size: 15px;
  color: #606266;
  margin: 0;
  line-height: 1.6;
  height: 50px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.module-footer {
  display: flex;
  justify-content: center;
  padding: 0 0 20px 0;
}

.module-footer .el-button {
  border-radius: 20px;
  padding: 8px 20px;
}

.enter-icon {
  margin-left: 4px;
}

.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(245, 247, 250, 0.9);
  z-index: 10;
  backdrop-filter: blur(5px);
}

.rotating-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 单个模块卡片宽度优化 */
.single-module-card .module-card {
  max-width: 450px;
  min-width: 350px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    padding: 20px;
  }
  
  .language-switcher {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .user-avatar {
    margin: 0 auto;
  }
  
  .module-grid {
    margin-top: 30px;
    padding: 10px;
  }
  
  .el-row {
    margin: 0 -10px;
  }
  
  .el-col {
    padding: 0 10px;
    margin-bottom: 20px;
    flex: 0 0 100%;
    max-width: 500px;
  }
  
  .module-card {
    height: auto;
    min-height: 280px;
  }
  
  .single-module-card .module-card {
    max-width: 100%;
    min-width: 100%;
  }
}

@media (max-width: 576px) {
  .module-select-container {
    padding: 15px;
  }
  
  .header-actions {
    padding: 10px 0;
  }
  
  .module-grid {
    margin-top: 20px;
  }
  
  .el-col {
    max-width: 100%;
  }
  
  .module-info h2 {
    font-size: 20px;
  }
  
  .module-info p {
    font-size: 14px;
  }
}

/* 修改Element Plus下拉菜单的样式 */
:deep(.el-dropdown-menu) {
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  min-width: 160px;
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 4px;
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
}

:deep(.el-dropdown-menu__item i) {
  margin-right: 8px;
  font-size: 16px;
  color: #909399;
}

:deep(.el-dropdown-menu__item--divided) {
  border-top: 1px solid #ebeef5;
  margin-top: 8px;
  padding-top: 8px;
}
</style>