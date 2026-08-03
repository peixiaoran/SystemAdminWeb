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
                :src="userAvatar"
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
              <el-dropdown-item @click="logout">
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
    <div v-if="!loading" class="pmenu-grid">
      <div class="pmenu-row">
        <div
          v-for="(pmenu, index) in pmenues"
          :key="pmenu.moduleId"
          class="pmenu-col card-enter"
          :style="{ animationDelay: `${Math.min(index, 11) * 70}ms` }">
          <div class="pmenu-card" @click="enterPMenu(pmenu)">
            <div class="pmenu-icon">
              <el-icon :size="48">
                <component :is="getValidIconName(pmenu.moduleIcon)" />
              </el-icon>
            </div>
            <div class="pmenu-info">
              <h2>{{ getPMenuName(pmenu) }}</h2>
              <p>{{ getPMenuRemarks(pmenu) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="module-loading">
      <div class="loading-indicator">
        <span class="loading-halo"></span>
        <span class="loading-ring"></span>
        <span class="loading-ring is-inner"></span>
        <el-icon class="loading-core" :size="24"><Grid /></el-icon>
      </div>
      <p class="loading-text">{{ $t('moduleSelect.moduleLoading') }}</p>
      <div class="loading-dots">
        <i></i><i></i><i></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown, Grid } from '@element-plus/icons-vue'
import { post } from '@/utils/request'
import { MODULE_API } from '@/config/api/modulemenu/menu'
import { useUserStore } from '@/stores/user'
import { usePMenuStore } from '@/stores/pmenu'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { resolveFileUrl } from '@/utils/fileUrl'
import { clearClientSession } from '@/utils/sessionCleanup'

const { t, locale } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const username = computed(() => userStore.getDisplayName)
const userAvatar = computed(() => {
  const avatar = userStore.avatar
  return avatar ? resolveFileUrl(avatar) : ''
})
const pmenues = ref([])
const loading = ref(true)
const pmenuStore = usePMenuStore()

// 获取模块数据
const fetchModules = async () => {
  try {
    loading.value = true
    
    // 使用post方法请求模块数据，不需要请求参数
    const res = await post(MODULE_API.GET_MODULES)
    
    if (res && res.code === 200) {
      pmenues.value = res.data || []
    } else {
      ElMessage({
        message: res?.message || t('moduleSelect.moduleError'),
        type: 'warning',
        plain: true,
        showClose: true,
      })
    }
  } catch {
    ElMessage({
      message: t('moduleSelect.moduleErrorRetry'),
      type: 'warning',
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
function getPMenuName(pmenu) {
  if (!pmenu) return ''
  // 兼容后端字段：部分接口使用 moduleNameCh（中文）而非 moduleNameCn
  const nameCn =
    pmenu.moduleNameCn ||
    pmenu.ModuleNameCn ||
    pmenu.moduleNameCh ||
    pmenu.ModuleNameCh ||
    pmenu.moduleName ||
    pmenu.ModuleName ||
    ''
  const nameEn =
    pmenu.moduleNameEn ||
    pmenu.ModuleNameEn ||
    pmenu.moduleName ||
    pmenu.ModuleName ||
    ''
  return locale.value === 'en-US' ? (nameEn || nameCn) : (nameCn || nameEn)
}
function getPMenuRemarks(pmenu) {
  if (!pmenu) return ''
  return locale.value === 'en-US' ? (pmenu.remarkEn || pmenu.remarkCh || pmenu.remarksEn || pmenu.remarksCh || pmenu.remark) : (pmenu.remarkCh || pmenu.remarkEn || pmenu.remarksCh || pmenu.remarksEn || pmenu.remark)
}

// 获取有效的图标名称
function getValidIconName(iconName) {
  if (!iconName || typeof iconName !== 'string') {
    return 'Setting'
  }
  
  // 移除空格和特殊字符，确保是有效的组件名称
  const cleanName = iconName.trim().replace(/[^a-zA-Z0-9]/g, '')
  
  // 如果清理后为空或不是有效的组件名称，返回默认图标
  if (!cleanName || cleanName.length === 0) {
    return 'Setting'
  }
  
  // 确保首字母大写（Vue组件命名规范）
  return cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
}

// 进入模块
const enterPMenu = (pmenu) => {
  if (!pmenu || !pmenu.moduleId || !pmenu.path) {
    ElMessage({
      message: t('moduleSelect.moduleIncomplete'),
      type: 'error',
      plain: true,
      showClose: true,
    })
    return
  }
  
  // 获取模块标识符（用于构建路由路径）
  const pmenuIdentifier = pmenu.path.split('/').filter(Boolean)[0] // 提取一级菜单标识符
  
  // 使用新的模块存储来保存模块信息
  // 兼容字段：moduleNameCh/ModuleNameCn 作为中文名称兜底
  const moduleNameCn =
    pmenu.moduleNameCn ||
    pmenu.ModuleNameCn ||
    pmenu.moduleNameCh ||
    pmenu.ModuleNameCh ||
    pmenu.moduleName ||
    pmenu.ModuleName ||
    ''
  const moduleNameEn =
    pmenu.moduleNameEn ||
    pmenu.ModuleNameEn ||
    pmenu.moduleName ||
    pmenu.ModuleName ||
    ''
  pmenuStore.setCurrentPMenu(
    String(pmenu.moduleId),
    getPMenuName(pmenu),
    pmenuIdentifier,
    moduleNameCn,
    moduleNameEn
  )
  
  // 清空之前的标签记录
  try {
    localStorage.removeItem('tabs-store')
  } catch {
    // localStorage 不可用时忽略，不影响跳转
  }
  
  // 跳转到layout页面，然后由layout处理模块路由
  router.push(`/${pmenuIdentifier}`)
}

// 退出登录
const logout = async () => {
  try {
    const result = await userStore.logout()
    if (result && result.success) {
      clearClientSession({ keepLanguage: true })
      router.replace('/login')
    }
  } catch {
    // 登出异常不额外处理
  }
}
</script>

<style scoped>
/* 与 Element Plus 主题变量对齐，便于随主色 / 暗色链动 */
.module-select-container {
  min-height: 100vh;
  background: #ffffff;
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
  height: 45px;
  padding: 0 8px 0 0;
  background-color: transparent;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}

.language-switcher {
  margin-right: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.user-avatar-wrapper {
  cursor: pointer;
}

.user-avatar {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: var(--el-border-radius-round);
  cursor: pointer;
  transition: background-color var(--el-transition-duration, 0.3s);
}

.user-avatar:hover {
  background-color: var(--el-fill-color-light);
}

.user-avatar :deep(.el-avatar) {
  position: relative;
  left: -2px;
}

.user-details {
  margin: 0 8px;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.dropdown-icon {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.pmenu-grid {
  max-width: 1720px;
  margin: 90px auto 0;
  padding: 20px 40px;
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.pmenu-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  row-gap: 36px;
  column-gap: 96px;
  width: 100%;
  max-width: 1560px;
  justify-items: center;
}

@media (min-width: 1200px) {
  .pmenu-row {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 992px) and (max-width: 1199px) {
  .pmenu-row {
    grid-template-columns: repeat(3, 1fr);
    column-gap: 60px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .pmenu-row {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 48px;
  }
}

@media (max-width: 767px) {
  .pmenu-row {
    grid-template-columns: 1fr;
  }
}

.pmenu-col {
  width: 100%;
  display: flex;
  justify-content: center;
}

.pmenu-card {
  width: 100%;
  max-width: 280px;
  height: 300px;
  display: flex;
  flex-direction: column;
  border-radius: calc(var(--el-border-radius-base) + 10px);
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.22s ease;
  cursor: pointer;
  overflow: hidden;
  background: var(--el-bg-color, #ffffff);
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: var(--el-box-shadow-light);
}

.pmenu-card:hover {
  transform: translateY(-4px);
  border-color: var(--el-color-primary-light-7);
  box-shadow:
    var(--el-box-shadow),
    0 12px 40px color-mix(in srgb, var(--el-color-primary) 10%, transparent);
}

.pmenu-icon {
  height: 108px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  position: relative;
}

.pmenu-icon::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--el-border-color-light),
    transparent
  );
}

.pmenu-info {
  flex: 1;
  padding: 22px 20px 14px 20px;
  background: var(--el-bg-color, #ffffff);
  text-align: center;
  display: flex;
  flex-direction: column;
}

.pmenu-info h2 {
  font-size: 18px;
  margin: 0 0 12px 0;
  color: var(--el-text-color-primary);
  font-weight: 600;
  letter-spacing: 0.02em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pmenu-info p {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin: 0;
  line-height: 1.55;
  height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
}

/* ============ 卡片进场动画 ============ */
.card-enter {
  animation: card-in 0.45s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ============ 加载状态 ============ */
.module-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
  z-index: 1;
  animation: loading-in 0.35s ease both;
}

@keyframes loading-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.loading-indicator {
  position: relative;
  width: 76px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 外层光晕：主色扩散呼吸 */
.loading-halo {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--el-color-primary) 16%, transparent) 0%,
    transparent 68%
  );
  animation: halo-pulse 2s ease-in-out infinite;
}

@keyframes halo-pulse {
  0%, 100% { opacity: 0.45; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.06); }
}

/* 渐变圆环：conic 渐变 + 圆环遮罩，形成带拖尾的旋转弧 */
.loading-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    var(--el-color-primary-light-7) 35%,
    var(--el-color-primary) 100%
  );
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 4px),
    #000 calc(100% - 4px)
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 4px),
    #000 calc(100% - 4px)
  );
  animation: ring-spin 1.1s linear infinite;
}

/* 内环：反向慢转，细一档 */
.loading-ring.is-inner {
  inset: 13px;
  background: conic-gradient(
    from 180deg,
    transparent 0%,
    var(--el-color-primary-light-5) 60%,
    var(--el-color-primary-light-3) 100%
  );
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 2px),
    #000 calc(100% - 2px)
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 2px),
    #000 calc(100% - 2px)
  );
  animation: ring-spin 1.8s linear infinite reverse;
}

@keyframes ring-spin {
  to { transform: rotate(360deg); }
}

/* 中心图标：轻微呼吸缩放 */
.loading-core {
  position: relative;
  color: var(--el-color-primary);
  animation: core-breathe 2s ease-in-out infinite;
}

@keyframes core-breathe {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.12); opacity: 1; }
}

.loading-text {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  letter-spacing: 0.04em;
}

.loading-dots {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: -8px;
}

.loading-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-color-primary-light-5);
  animation: dot-wave 1.2s ease-in-out infinite;
}

.loading-dots i:nth-child(2) {
  animation-delay: 0.16s;
}

.loading-dots i:nth-child(3) {
  animation-delay: 0.32s;
}

@keyframes dot-wave {
  0%, 60%, 100% {
    transform: translateY(0);
    background: var(--el-color-primary-light-7);
  }
  30% {
    transform: translateY(-5px);
    background: var(--el-color-primary);
  }
}

/* 尊重系统「减少动态效果」设置 */
@media (prefers-reduced-motion: reduce) {
  .card-enter,
  .module-loading,
  .loading-halo,
  .loading-core,
  .loading-dots i {
    animation: none;
  }

  .loading-ring {
    animation-duration: 2.4s;
  }

  .pmenu-card {
    transition: none;
  }
}

/* 单个模块卡片宽度优化 */
.single-module-card .pmenu-card {
  max-width: 450px;
  min-width: 350px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header-actions {
    position: static;
    height: auto;
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
  
  .pmenu-grid {
    margin-top: 30px;
    padding: 15px;
  }
  
  .pmenu-card {
    height: 282px;
  }

  .pmenu-icon {
    height: 94px;
  }
  
  .pmenu-info {
    padding: 20px 16px 12px 16px;
  }
  
  .pmenu-info h2 {
    font-size: 16px;
    white-space: normal;
  }
  
  .pmenu-info p {
    font-size: 12px;
    height: 48px;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .loading-indicator {
    width: 64px;
    height: 64px;
  }
}

@media (max-width: 576px) {
  .module-select-container {
    padding: 15px;
  }
  
  .header-actions {
    padding: 10px 0;
  }
  
  .pmenu-grid {
    margin-top: 20px;
    padding: 10px;
  }
  
  .pmenu-card {
    height: 264px;
  }

  .pmenu-icon {
    height: 84px;
  }
  
  .pmenu-info h2 {
    font-size: 15px;
  }
  
  .pmenu-info p {
    font-size: 11px;
    height: 42px;
  }

  .loading-indicator {
    width: 56px;
    height: 56px;
  }
}

/* 下拉：主色 hover 与 LanguageSwitcher / 布局侧栏一致 */
:deep(.el-dropdown-menu) {
  padding: 8px;
  border-radius: calc(var(--el-border-radius-base) + 8px);
  box-shadow: var(--el-box-shadow-light);
  border: 1px solid var(--el-border-color-lighter);
  min-width: 168px;
  background-color: var(--el-bg-color-overlay, var(--el-fill-color-blank));
}

:deep(.el-dropdown-menu__item) {
  padding: 8px 12px;
  border-radius: var(--el-border-radius-base);
  margin-bottom: 4px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
}

:deep(.el-dropdown-menu__item:not(.is-disabled):focus),
:deep(.el-dropdown-menu__item:not(.is-disabled):hover) {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

:deep(.el-dropdown-menu__item i) {
  margin-right: 8px;
  font-size: 16px;
  color: var(--el-text-color-secondary);
}

:deep(.el-dropdown-menu__item:not(.is-disabled):hover i) {
  color: var(--el-color-primary);
}

:deep(.el-dropdown-menu__item--divided) {
  border-top: 1px solid var(--el-border-color-lighter);
  margin-top: 8px;
  padding-top: 8px;
}
</style>

