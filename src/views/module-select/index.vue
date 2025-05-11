<template>
  <div class="module-select-container">
    <div class="user-info">
        <el-dropdown trigger="click">
          <div class="user-avatar-wrapper">
            <div class="user-avatar">
              <el-avatar :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
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
                <span>个人信息</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-icon><Setting /></el-icon>
                <span>账号设置</span>
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>


    <div class="module-grid">
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="module in modules" :key="module.domainId">
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
                <span>进入</span>
                <el-icon class="enter-icon"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 添加加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-empty description="正在加载数据..." :image-size="100">
        <template #image>
          <el-icon :size="60" class="rotating-icon"><Loading /></el-icon>
        </template>
      </el-empty>
    </div>

    <!-- 底部版权信息 -->
    <div class="footer">
      <p>© 2023 SystemsAdmin管理系统 · 技术支持</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Loading, User, Setting, SwitchButton, ArrowRight } from '@element-plus/icons-vue'
import { post } from '@/utils/request'
import { MODULE_API } from '@/config/api/domainmenu/menu'
import { useUserStore } from '@/stores/user'
import { useModuleStore } from '@/stores/module'
import { addRoutes } from '@/router'

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
      ElMessage.error(res?.message || '获取模块数据失败')
    }
  } catch (error) {
    ElMessage.error('获取模块数据失败，请稍后重试')
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
    ElMessage.error('模块信息不完整')
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
  
  // 确保添加动态路由
  addRoutes()
  
  // 跳转到对应模块的index首页
  router.push(`/${moduleIdentifier}/index`)
}

// 退出登录
const logout = async () => {
  try {
    // 确认对话框
    await ElMessageBox.confirm('确定要退出登录吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 调用退出登录接口
    await userStore.logout()
    
    // 跳转到登录页
    router.push('/login')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('退出登录失败')
    }
  }
}
</script>

<style scoped>
.module-select-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px 30px 60px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 25px 30px;
  background-color: transparent;
}

.welcome h1 {
  font-size: 28px;
  color: #303133;
  margin: 0 0 12px 0;
  font-weight: 600;
  background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome p {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

.user-info {
  position: absolute;
  top: 20px;
  right: 30px;
  z-index: 1;
}

.user-avatar-wrapper {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.user-details {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.username {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.role-tag {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.dropdown-icon {
  margin-left: 8px;
  font-size: 12px;
  color: #64748b;
}

.module-grid {
  max-width: 1280px;
  margin: 60px auto 0;
  padding: 20px 0;
  flex: 1;
}

.el-row {
  margin: 0 -15px;
}

.el-col {
  padding: 0 15px;
  margin-bottom: 30px;
}

.module-card {
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
  font-size: 20px;
  margin: 0 0 16px 0;
  color: #303133;
  font-weight: 600;
}

.module-info p {
  font-size: 14px;
  color: #606266;
  margin: 0;
  line-height: 1.6;
  height: 45px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.module-footer {
  padding: 0 20px 15px;
  display: flex;
  justify-content: center;
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
  background-color: rgba(255, 255, 255, 0.9);
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

.footer {
  margin-top: 30px;
  text-align: center;
  color: #94a3b8;
  font-size: 13px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    padding: 20px;
  }
  
  .welcome {
    text-align: center;
    margin-bottom: 15px;
  }
  
  .user-avatar {
    margin: 0 auto;
  }
  
  .module-grid {
    margin-top: 40px;
    padding: 10px;
  }
  
  .el-row {
    margin: 0 -10px;
  }
  
  .el-col {
    padding: 0 10px;
    margin-bottom: 20px;
  }
  
  .module-card {
    height: auto;
    min-height: 280px;
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