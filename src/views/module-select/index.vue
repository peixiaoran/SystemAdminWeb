<template>
  <div class="module-select-container">
    <div class="module-grid">
      <el-row :gutter="30">
        <el-col :span="24" v-for="module in modules" :key="module.domainId">
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
import { Loading, ArrowRight } from '@element-plus/icons-vue'
import { post } from '@/utils/request'
import { MODULE_API } from '@/config/api/domainmenu/menu'
import { useUserStore } from '@/stores/user'
import { useModuleStore } from '@/stores/module'
import { addRoutes } from '@/router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const modules = ref([])
const loading = ref(true)
const userStore = useUserStore()
const moduleStore = useModuleStore()

const fetchModules = async () => {
  try {
    loading.value = true
    const res = await post(MODULE_API.GET_MODULES)
    if (res && res.code === '200') {
      modules.value = res.data || []
    } else {
      ElMessage.error(res?.message || t('moduleSelect.moduleError'))
    }
  } catch (error) {
    ElMessage.error(t('moduleSelect.moduleErrorRetry'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchModules()
})

const enterModule = (module) => {
  if (!module || !module.domainId || !module.path) {
    ElMessage.error(t('moduleSelect.moduleIncomplete'))
    return
  }
  const moduleIdentifier = module.path.split('/').filter(Boolean)[0]
  moduleStore.setCurrentModule(String(module.domainId), module.domainName, moduleIdentifier)
  addRoutes()
  router.push(`/${moduleIdentifier}/index`)
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

.module-grid {
  margin-top: 20px;
}

.el-row {
  margin: 0 -15px;
  width: 100%;
}

.el-col {
  padding: 0 15px;
}

.module-card {
  width: 100%;
  max-width: 320px;
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
  margin: 0 auto 30px;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(59, 130, 246, 0.1);
  border-color: #d0e1fd;
}

.module-icon {
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #3b82f6;
  padding: 10px 0;
  transition: all 0.3s ease;
}

.module-card:hover .module-icon {
  background: linear-gradient(135deg, #e0f2fe 0%, #c7e8ff 100%);
  color: #2563eb;
}

.module-info {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  text-align: center;
  border-top: 1px solid #ebeef5;
  transition: all 0.3s ease;
}

.module-card:hover .module-info {
  background-color: #fafcff;
}

.module-info h2 {
  font-size: 20px;
  margin: 0 0 16px 0;
  color: #303133;
  font-weight: 600;
  transition: all 0.3s ease;
}

.module-card:hover .module-info h2 {
  color: #3b82f6;
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
  display: flex;
  justify-content: center;
  padding: 0 0 20px 0;
  transition: all 0.3s ease;
}

.module-footer .el-button {
  border-radius: 20px;
  padding: 8px 20px;
  transition: all 0.3s ease;
}

.module-card:hover .module-footer .el-button {
  background-color: #3b82f6;
  color: white;
}

.enter-icon {
  margin-left: 4px;
  transition: transform 0.3s ease;
}

.module-card:hover .enter-icon {
  transform: translateX(3px);
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

/* 响应式调整 */
@media (max-width: 768px) {
  .module-grid {
    padding: 10px;
  }

  .el-col {
    padding: 0 10px;
  }

  .module-card {
    height: auto;
    min-height: 280px;
  }
}
</style>
