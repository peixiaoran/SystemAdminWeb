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
          <el-card
            class="module-card"
            shadow="hover"
            @click="enterModule(module)"
            :body-style="{ padding: '0', height: '100%' }"
          >
            <div class="module-icon">
              <el-icon :size="54">
                <component :is="module.domainIcon" />
              </el-icon>
            </div>
            <div class="module-info">
              <h2>{{ getModuleName(module) }}</h2>
              <p>{{ getModuleRemarks(module) }}</p>
              <div class="module-footer">
                <el-button type="primary" round>
                  <span>{{ $t('common.enter') }}</span>
                  <el-icon class="enter-icon"><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </el-card>
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

// 多语言字段获取
function getModuleName(module) {
  if (!module) return ''
  return locale.value === 'en-US' ? (module.domainNameEn || module.domainNameCh || module.domainName) : (module.domainNameCh || module.domainNameEn || module.domainName)
}
function getModuleRemarks(module) {
  if (!module) return ''
  return locale.value === 'en-US' ? (module.remarksEn || module.remarksCh || module.remarks) : (module.remarksCh || module.remarksEn || module.remarks)
}

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
    getModuleName(module),
    moduleIdentifier,
    module.domainNameCh || '',
    module.domainNameEn || ''
  )
  
  // 清空之前的标签记录
  try {
    localStorage.removeItem('tabs-store')
  } catch (error) {
    console.error('清空标签数据失败:', error)
  }
  
  // 直接跳转到模块首页
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
  max-width: 320px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 16px;
  transition: box-shadow 0.3s, border-color 0.3s, background 0.3s;
  cursor: pointer;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08), 0 1.5px 4px 0 rgba(0, 0, 0, 0.04);
}


.module-icon {
  height: 105px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d3d4d6;
  color: #ffffff;
  border-bottom: none;
}

.module-info {
  flex: 1;
  padding: 20px 20px 10px 20px;
  background: #ffffff;
  text-align: center;
  overflow: hidden;
}

.module-info h2 {
  font-size: 20px;
  margin: 0 0 10px 0;
  color: #303133;
  font-weight: 700;
  letter-spacing: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-info p {
  font-size: 14px;
  color: #606266;
  margin: 0;
  line-height: 1.6;
  min-height: 40px;
  max-height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  hyphens: auto;
}

/* 移除module-footer的背景、边框等样式，只保留布局 */
.module-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 0;
  border-top: none;
  background: none;
}

.module-footer .el-button {
  border-radius: 20px;
  padding: 8px 24px;
  font-size: 15px;
  font-weight: 500;
  background: #d3d4d6;
  color: #fff;
  border: none;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(211, 212, 214, 0.12);
}
.module-footer .el-button:hover {
  background: #c0c4cc;
  color: #fff;
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
    min-width: 100%;
    max-width: 100%; /* 移动端占满容器宽度 */
    height: auto;
  }
  
  .single-module-card .module-card {
    max-width: 100%;
    min-width: 100%;
  }
  .module-info {
    padding: 18px 10px 8px 10px;
  }
  .module-info h2 {
    font-size: 18px; /* 移动端适当缩小标题字体 */
    white-space: normal; /* 移动端允许标题换行 */
  }
  .module-info p {
    font-size: 13px; /* 移动端适当缩小描述字体 */
    max-height: 38px; /* 移动端适当缩小最大高度 */
  }
  .module-footer {
    padding: 12px 0 14px 0;
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
  
  .module-card {
    max-width: 100%; /* 小屏幕完全占满 */
  }
  
  .module-info h2 {
    font-size: 16px; /* 小屏幕进一步缩小 */
  }
  
  .module-info p {
    font-size: 12px; /* 小屏幕进一步缩小 */
    max-height: 32px; /* 小屏幕进一步缩小最大高度 */
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

