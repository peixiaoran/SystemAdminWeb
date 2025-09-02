<template>
  <div class="module-select-container">
    <div class="header-actions">
      <language-switcher class="language-switcher" />
      <div class="user-info">
        <el-dropdown trigger="click">
          <div class="user-avatar-wrapper">
            <div class="user-avatar">
              <el-avatar 
                size="small" 
                :src="userAvatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" 
                :alt="username" />
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
    
    <!-- 模块展示区域 -->
    <div v-if="!loading" class="module-grid">
      <div class="module-row">
        <div v-for="module in modules" :key="module.domainId" class="module-col">
          <div class="module-card" @click="enterModule(module)">
            <div class="module-icon">
              <el-icon :size="48">
                <component :is="module.domainIcon || 'Setting'" />
              </el-icon>
            </div>
            <div class="module-info">
              <h2>{{ getModuleName(module) }}</h2>
              <p>{{ getModuleRemarks(module) }}</p>
            </div>
            <div class="module-footer">
              <el-button type="primary" size="small">
                {{ $t('moduleSelect.enterModule') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <el-icon class="loading-icon" :size="60"><Loading /></el-icon>
        <div class="loading-text">{{ $t('moduleSelect.moduleLoading') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Loading, User, Setting, ArrowRight } from '@element-plus/icons-vue'
import { post } from '@/utils/request'
import { MODULE_API } from '@/config/api/domainmenu/menu'
import { useUserStore } from '@/stores/user'
import { useModuleStore } from '@/stores/module'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t, locale } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const username = computed(() => userStore.getDisplayName)
const userAvatar = computed(() => userStore.avatar || '')
const modules = ref([])
const loading = ref(true)
const moduleStore = useModuleStore()

// 获取模块数据
const fetchModules = async () => {
  try {
    loading.value = true
    
    // 使用post方法请求模块数据，不需要请求参数
    const res = await post(MODULE_API.GET_MODULES)
    
    if (res && res.code === 200) {
      modules.value = res.data || []
      // 提取所有模块路径
      const modulePaths = modules.value.map(module => ({
        domainId: module.domainId,
        domainName: module.domainName,
        path: module.path
      }))
    } else {
      ElMessage({
        message: res?.message || t('moduleSelect.moduleError'),
        type: 'error',
        plain: true,
        showClose: true,
      })
    }
  } catch (error) {
    ElMessage({
      message: t('moduleSelect.moduleErrorRetry'),
      type: 'error',
      plain: true,
      showClose: true,
    })
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取模块数据
onMounted(() => {
  fetchModules()
})

// 多语言字段获取
function getModuleName(module) {
  if (!module) return ''
  return locale.value === 'en-US' ? (module.domainNameEn || module.domainNameCn || module.domainName) : (module.domainNameCn || module.domainNameEn || module.domainName)
}
function getModuleRemarks(module) {
  if (!module) return ''
  return locale.value === 'en-US' ? (module.remarksEn || module.remarksCh || module.remarks) : (module.remarksCh || module.remarksEn || module.remarks)
}

// 进入模块
const enterModule = (module) => {
  if (!module || !module.domainId || !module.path) {
    ElMessage({
      message: t('moduleSelect.moduleIncomplete'),
      type: 'error',
      plain: true,
      showClose: true,
    })
    return
  }
  
  // 获取模块标识符（用于构建路由路径）
  const moduleIdentifier = module.path.split('/').filter(Boolean)[0] // 提取模块标识符
  
  // 使用新的模块存储来保存模块信息
  moduleStore.setCurrentModule(
    String(module.domainId),
    getModuleName(module),
    moduleIdentifier,
    module.domainNameCn || '',
    module.domainNameEn || ''
  )
  
  // 清空之前的标签记录
  try {
    localStorage.removeItem('tabs-store')
  } catch (error) {
    console.error('清空标签数据失败:', error)
  }
  
  // 跳转到layout页面，然后由layout处理模块路由
  router.push(`/${moduleIdentifier}`)
}

// 退出登录
const logout = async () => {
  try {
    await ElMessageBox.confirm(t('common.confirmLogout'), t('common.tip'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
    
    const result = await userStore.logout()
    
    // 根据登出结果处理
    if (result && result.success) {
      // 显示后端返回的退出成功信息，如果没有message则使用默认提示
      const successMessage = result.message || t('common.logoutSuccess')
      ElMessage.success(successMessage)
      
      // 清空所有localStorage
      localStorage.clear()
      
      router.push('/login')
    } else {
      // 登出失败，错误信息已在 userStore.logout() 中显示
      console.error('Logout failed:', result?.message)
    }
  } catch (error) {
    // 用户取消，不处理
    if (error !== 'cancel') {
      console.error('Logout error:', error)
    }
  }
}
</script>

<style scoped>
.module-select-container {
  min-height: 100vh;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 30px 60px;
  overflow: hidden;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
  padding: 12px 0 0 0;
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
  margin: 40px auto 0;
  padding: 20px;
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.module-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  justify-items: center;
}

@media (min-width: 1200px) {
  .module-row {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .module-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .module-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .module-row {
    grid-template-columns: 1fr;
  }
}

.module-col {
  width: 100%;
  display: flex;
  justify-content: center;
}

.module-card {
  width: 100%;
  max-width: 280px;
  height: 320px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}




.module-icon {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #409EFF 0%, #1890ff 100%);
  color: #ffffff;
  position: relative;
}

.module-icon::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
}

.module-info {
  flex: 1;
  padding: 24px 20px 16px 20px;
  background: #ffffff;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.module-info h2 {
  font-size: 18px;
  margin: 0 0 12px 0;
  color: #303133;
  font-weight: 600;
  letter-spacing: 0.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-info p {
  font-size: 13px;
  color: #909399;
  margin: 0;
  line-height: 1.5;
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
}

.module-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 20px 20px 20px;
  background: #ffffff;
}

.module-footer .el-button {
  border-radius: 25px;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 500;
  background: linear-gradient(135deg, #409EFF 0%, #1890ff 100%);
  color: #fff;
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(221, 160, 221, 0.3);
  min-width: 120px;
}



.enter-icon {
  margin-left: 6px;
  transition: transform 0.2s ease;
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
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-text {
  color: #606266;
  font-size: 14px;
}

.loading-icon {
  animation: rotate 1s linear infinite;
  color: #409EFF;
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
    padding: 15px;
  }
  
  .module-card {
    height: 300px;
  }
  
  .module-icon {
    height: 100px;
  }
  
  .module-info {
    padding: 20px 16px 12px 16px;
  }
  
  .module-info h2 {
    font-size: 16px;
    white-space: normal;
  }
  
  .module-info p {
    font-size: 12px;
    height: 48px;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
  
  .module-footer {
    padding: 12px 16px 16px 16px;
  }
  
  .module-footer .el-button {
    padding: 10px 20px;
    font-size: 13px;
    min-width: 100px;
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
    padding: 10px;
  }
  
  .module-card {
    height: 280px;
  }
  
  .module-icon {
    height: 90px;
  }
  
  .module-info h2 {
    font-size: 15px;
  }
  
  .module-info p {
    font-size: 11px;
    height: 42px;
  }
  
  .module-footer .el-button {
    padding: 8px 16px;
    font-size: 12px;
    min-width: 90px;
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

