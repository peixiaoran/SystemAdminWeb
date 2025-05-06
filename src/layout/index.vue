<template>
  <div class="app-container">
    <!-- 侧边菜单 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside-container">
      <div class="logo-container">
        <div class="logo-content" v-if="!isCollapse">
          <img src="/favicon.svg" alt="Logo" class="logo-icon" />
          <h1 class="logo-text">Systems管理系统</h1>
        </div>
        <img src="/favicon.svg" alt="Logo" class="logo-mini" v-else />
      </div>
      
      <!-- 菜单组件 -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        router
        class="el-menu-vertical"
        @select="handleMenuSelect"
      >
        <template v-for="menu in menuList" :key="menu.menuId">
          <!-- 一级菜单（有子菜单） -->
          <el-sub-menu v-if="menu.menuChildList && menu.menuChildList.length > 0" :index="menu.path || menu.menuId">
            <template #title>
              <el-icon><component :is="menu.menuIcon || 'Menu'" /></el-icon>
              <span>{{ menu.menuName }}</span>
            </template>
            
            <!-- 二级菜单 -->
            <el-menu-item 
              v-for="subMenu in menu.menuChildList" 
              :key="subMenu.menuId" 
              :index="getFormattedPath(subMenu.path)"
              :class="{'custom-active': isMenuActive(subMenu.path)}"
              @click="addTab(subMenu)"
            >
              <el-icon><component :is="subMenu.menuIcon || 'Document'" /></el-icon>
              <span>{{ subMenu.menuName }}</span>
            </el-menu-item>
          </el-sub-menu>
          
          <!-- 一级菜单（无子菜单） -->
          <el-menu-item v-else :index="menu.path" @click="addTab(menu)">
            <el-icon><component :is="menu.menuIcon || 'Menu'" /></el-icon>
            <span>{{ menu.menuName }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    
    <!-- 主要内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="breadcrumb">
          <div class="collapse-btn-header" @click="toggleCollapse">
            <el-icon v-if="isCollapse"><Expand /></el-icon>
            <el-icon v-else><Fold /></el-icon>
          </div>
          
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentSystemName">{{ currentSystemName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="right-menu">
          <!-- 添加返回首页按钮 -->
          <el-button link @click="returnToModuleSelect" class="home-button">
            <el-icon><Back /></el-icon>
            返回首页
          </el-button>
          
          <el-dropdown trigger="click">
            <div class="avatar-wrapper">
              <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
              <span class="username">{{ username }}</span>
              <el-icon class="el-icon-arrow-down"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 标签栏 -->
      <div class="tags-view-container">
        <el-tabs 
          v-model="activeTabName" 
          type="card" 
          @tab-click="handleTabClick" 
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="tab in visitedTabs"
            :key="tab.path"
            :label="tab.title"
            :name="tab.path"
            closable
            @contextmenu.prevent="(e) => handleContextMenu(e, tab)"
          >
            <template #label>
              <div @contextmenu.prevent="(e) => handleContextMenu(e, tab)" class="tab-label">
                <el-icon class="tab-icon" v-if="tab.icon"><component :is="tab.icon" /></el-icon>
                <span>{{ tab.title }}</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        
        <!-- 右键菜单 -->
        <div v-show="contextMenuVisible" :style="contextMenuStyle" class="context-menu">
          <div class="context-menu-item" @click="refreshSelectedTag">刷新页面</div>
          <div class="context-menu-item" @click="closeSelectedTag">关闭当前标签</div>
          <div class="context-menu-item" @click="closeOthersTags">关闭其他标签</div>
          <div class="context-menu-item" @click="closeAllTags">关闭所有标签</div>
        </div>
      </div>
      
      <!-- 主要内容区域 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="page-slide" mode="out-in">
            <keep-alive :include="cachedTabs">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import { MENU_API } from '@/config/api/login/api'
import { useUserStore } from '@/stores/user'
import { Fold, Expand, ArrowDown, Back } from '@element-plus/icons-vue'
import NProgress from 'nprogress'

// 状态
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)
const menuList = ref([])
const username = ref('管理员')
const currentSystemName = ref('')
const currentDomainId = ref('')

// 格式化路径辅助函数
const getFormattedPath = (path) => {
  if (!path) return '';
  
  // 移除.vue后缀
  let formattedPath = path.endsWith('.vue') ? path.replace('.vue', '') : path;
  
  // 确保路径以/开头
  if (!formattedPath.startsWith('/')) {
    formattedPath = '/' + formattedPath;
  }
  
  return formattedPath;
}

// 当前激活的菜单路径
const activeMenu = ref(route.path);

// 检查菜单项是否激活
const isMenuActive = (menuPath) => {
  const formattedMenuPath = getFormattedPath(menuPath);
  return activeMenu.value === formattedMenuPath;
}

// 处理菜单选择
const handleMenuSelect = (index, indexPath) => {
  activeMenu.value = index;
}

// 标签相关状态
const activeTabName = ref('')
const visitedTabs = ref([])
const cachedTabs = ref([])

// 右键菜单相关
const contextMenuVisible = ref(false)
const contextMenuStyle = reactive({
  left: '0px',
  top: '0px'
})
const tagRightClicked = ref(null)

// 获取菜单数据
const fetchMenuData = async () => {
  try {
    // 从localStorage获取当前选择的domainId
    const domainId = localStorage.getItem('currentDomainId')
    if (!domainId) {
      ElMessage.warning('未选择系统模块，请先选择一个模块')
      router.push('/module-select')
      return
    }
    
    // 保存当前domainId
    currentDomainId.value = domainId
    
    // 从localStorage获取当前选择的系统名称
    const systemName = localStorage.getItem('currentSystemName')
    if (systemName) {
      currentSystemName.value = systemName
    }
    
    // 请求菜单数据
    const res = await post(MENU_API.GET_MENU, { domainId })
    
    if (res && res.code === '200') {
      menuList.value = res.data || []
      console.log('菜单数据:', menuList.value)
      
      // 如果当前没有打开的标签页，则默认跳转到首页
      if (visitedTabs.value.length === 0) {
        router.push('/index')
      }
    } else {
      ElMessage.error(res?.message || '获取菜单数据失败')
    }
  } catch (error) {
    ElMessage.error('获取菜单数据失败，请稍后重试')
  }
}

// 切换菜单折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 退出登录
const logout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    // 用户取消，不处理
  }
}

// 添加标签
const addTab = async (menu) => {
  const { menuName, path, menuIcon } = menu
  
  if (!path) {
    ElMessage.warning('菜单路径未定义')
    return
  }
  
  // 在菜单点击时显示进度条
  NProgress.start()
  
  const formattedPath = getFormattedPath(path);
  
  // 首页路径不添加标签
  if (formattedPath === '/index') {
    activeTabName.value = formattedPath
    activeMenu.value = formattedPath
    router.push(formattedPath).then(() => {
      // 确保路由跳转完成后结束进度条
      NProgress.done()
    })
    return
  }
  
  // 检查路由是否有空重定向标记
  try {
    // 获取匹配的路由
    const matchedRoute = router.resolve(formattedPath)
    
    // 如果路由有emptyRedirect标记，则不添加标签，也不跳转
    if (matchedRoute && matchedRoute.matched && matchedRoute.matched.some(record => record.redirect === '')) {
      // 结束进度条
      NProgress.done()
      return
    }
    
    // 检查是否已存在相同路径的标签
    const isExist = visitedTabs.value.some(tab => tab.path === formattedPath)
    if (!isExist) {
      visitedTabs.value.push({
        title: menuName,
        path: formattedPath,
        icon: menuIcon || 'Document',
        name: formattedPath.replace(/\//g, '-')
      })
      
      // 添加到缓存列表
      if (!cachedTabs.value.includes(formattedPath.replace(/\//g, '-'))) {
        cachedTabs.value.push(formattedPath.replace(/\//g, '-'))
      }
    }
    
    activeTabName.value = formattedPath
    activeMenu.value = formattedPath
    router.push(formattedPath).then(() => {
      // 确保路由跳转完成后结束进度条
      NProgress.done()
    })
  } catch (error) {
    // 处理错误，结束进度条
    NProgress.done()
    console.error('添加标签失败:', error)
  }
}

// 处理标签点击
const handleTabClick = (tab) => {
  const path = tab.props.name;
  activeMenu.value = path;
  
  // 在标签点击时显示进度条
  NProgress.start();
  
  router.push(path).then(() => {
    // 确保路由跳转完成后结束进度条
    NProgress.done()
  })
}

// 移除标签
const removeTab = (targetPath) => {
  // 如果关闭的是当前激活的标签页，则需要跳转到其他标签页
  if (activeTabName.value === targetPath) {
    visitedTabs.value.forEach((tab, index) => {
      if (tab.path === targetPath) {
        const nextTab = visitedTabs.value[index + 1] || visitedTabs.value[index - 1]
        if (nextTab) {
          activeTabName.value = nextTab.path
          router.push(nextTab.path)
        } else {
          // 如果没有其他标签，跳转到首页
          activeTabName.value = '/index'
          router.push('/index')
        }
      }
    })
  }
  
  // 从visitedTabs中移除
  visitedTabs.value = visitedTabs.value.filter(tab => tab.path !== targetPath)
  
  // 从cachedTabs中移除
  const index = cachedTabs.value.indexOf(targetPath.replace(/\//g, '-'))
  if (index > -1) {
    cachedTabs.value.splice(index, 1)
  }
}

// 处理右键菜单
const handleContextMenu = (e, tab) => {
  // 阻止默认右键菜单
  e.preventDefault()
  
  // 设置自定义右键菜单的位置
  contextMenuStyle.left = e.clientX + 'px'
  contextMenuStyle.top = e.clientY + 'px'
  
  // 记录当前右键点击的标签
  tagRightClicked.value = tab
  
  // 显示右键菜单
  contextMenuVisible.value = true
  
  // 点击页面其他区域时关闭右键菜单
  const closeMenu = () => {
    contextMenuVisible.value = false
    document.removeEventListener('click', closeMenu)
  }
  document.addEventListener('click', closeMenu)
}

// 刷新当前标签页
const refreshSelectedTag = () => {
  if (!tagRightClicked.value) return
  
  const { path } = tagRightClicked.value
  
  // 从缓存中移除
  const index = cachedTabs.value.indexOf(path.replace(/\//g, '-'))
  if (index > -1) {
    cachedTabs.value.splice(index, 1)
  }
  
  // 强制刷新 - 修复，直接使用当前路径而不是重定向
  nextTick(() => {
    // 记录当前路径
    const currentPath = path
    // 先跳转到空白页再返回，避免vue-router复用相同组件导致不刷新
    router.replace('/').then(() => {
      nextTick(() => {
        router.replace(currentPath)
      })
    })
  })
}

// 关闭当前标签
const closeSelectedTag = () => {
  if (!tagRightClicked.value) return
  removeTab(tagRightClicked.value.path)
}

// 关闭其他标签
const closeOthersTags = () => {
  if (!tagRightClicked.value) return
  
  const { path } = tagRightClicked.value
  
  visitedTabs.value = visitedTabs.value.filter(tab => tab.path === path)
  cachedTabs.value = cachedTabs.value.filter(name => name === path.replace(/\//g, '-'))
  
  // 跳转到当前选中的标签
  router.push(path)
}

// 关闭所有标签
const closeAllTags = () => {
  visitedTabs.value = []
  cachedTabs.value = []
  router.push('/index')
}

// 返回首页
const returnToModuleSelect = () => {
  router.push('/module-select')
}

// 监听路由变化，保持菜单激活状态同步
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath;
}, { immediate: true })

// 监听路由变化添加标签
onMounted(async () => {
  // 获取菜单数据
  await fetchMenuData()
  
  // 添加当前路由对应的标签
  if (route.name && route.meta.title) {
    addTab({
      menuName: route.meta.title,
      path: route.path,
      menuIcon: route.meta.icon
    })
  }
})
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  border: none;
}

/* 侧边栏样式 */
.aside-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: width 0.3s;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  overflow-x: hidden;
  z-index: 10;
  padding: 6px;
  border: none;
}

.logo-container {
  position: relative;
  padding: 13px;
  overflow: hidden;
  background-color: #fff;
  height: 35px;
  display: flex;
  align-items: center;
  border-bottom: none;
}

.logo-content {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.logo-text {
  font-size: 17px;
  font-weight: bold;
  color: #303133;
  margin: 0;
}

.logo-mini {
  width: 30px;
  height: 30px;
}

.el-menu-vertical {
  border-right: none;
  flex: 1;
  overflow-y: auto;
  padding: 5px 0;
}

.el-menu-vertical:deep(.el-menu) {
  background-color: #fff;
  border-right: none;
}

.el-menu-vertical:deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  margin: 0;
  border-radius: 6px;
}

.el-menu-vertical:deep(.el-menu-item i) {
  margin-right: 12px;
}

.el-menu-vertical:deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
  padding: 0 16px;
  margin: 0;
  border-radius: 6px;
  position: relative;
}

/* 调整一级菜单箭头的位置 */
.el-menu-vertical:deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
  position: absolute;
  right: 12px;
}

.el-menu-vertical:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
  border-radius: 6px;
}

.el-menu-vertical:deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
}

.el-menu-vertical:deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fa;
}

.el-menu-vertical:deep(.el-menu--inline) {
  padding: 0;
  /* 重要: 防止菜单展开时的抖动 */
  overflow: hidden;
}

.el-menu-vertical:deep(.el-menu--inline .el-menu-item) {
  height: 40px;
  line-height: 40px;
  padding-left: 36px !important;
  margin: 4px 0;
  border-radius: 6px;
}

/* 确保二级菜单激活状态样式与一级菜单相同 */
.el-menu-vertical:deep(.el-menu--inline .el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
}

/* 全局激活样式，确保二级菜单也能正确显示激活状态 */
:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff !important;
  color: #409eff !important;
}

/* 自定义滚动条 */
.el-menu-vertical::-webkit-scrollbar {
  width: 6px;
}

.el-menu-vertical::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 3px;
}

.collapse-btn-header {
  position: relative;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  margin-right: 10px;
}

.collapse-btn-header:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 主容器样式 */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: none;
}

.header {
  height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  border-bottom: none;
}

.breadcrumb {
  display: flex;
  align-items: center;
}

.right-menu {
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
}

.username {
  margin: 0 10px;
  color: #606266;
}

/* 标签页样式 */
.tags-view-container {
  background-color: #fff;
  padding: 5px 15px 5px 15px;
  box-shadow: none;
  position: relative;
}

.tags-view-container:deep(.el-tabs__header) {
  margin-bottom: 0;
  border-bottom: none;
}

.tags-view-container:deep(.el-tabs__nav) {
  border: none;
}

.tags-view-container:deep(.el-tabs__item) {
  height: 32px;
  line-height: 32px;
  background: #f5f7fa;
  border: none !important;
  color: #606266;
  margin-right: 5px;
  padding: 0 15px;
  border-radius: 3px;
  transition: all 0.3s;
}

.tags-view-container:deep(.el-tabs__item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
}

.tags-view-container:deep(.el-tabs__item:not(.is-active):hover) {
  background-color: #ebeef5;
}

.tags-view-container:deep(.el-tabs__content) {
  display: none;
}

.tab-icon {
  margin-right: 5px;
}

/* 页面切换动画 */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.3s ease;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 5px 0;
  min-width: 150px;
  z-index: 3000;
  font-size: 14px;
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  color: #606266;
  transition: all 0.2s;
}

.context-menu-item:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

/* 标签样式优化 */
.tab-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  overflow: auto;
  padding: 12px;
  background-color: #f0f2f5;
}

/* 确保菜单图标和文本对齐 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
}

:deep(.el-menu-item i),
:deep(.el-sub-menu__title i) {
  margin-right: 12px;
}

:deep(.el-menu--inline .el-menu-item) {
  padding-left: 20px !important;
}

/* 为二级菜单添加自定义激活状态样式 */
.custom-active {
  background-color: #ecf5ff !important;
  color: #409eff !important;
  font-weight: 500 !important;
}

/* 针对所有菜单项的激活状态样式，提高特异性 */
.el-menu-vertical:deep(.el-menu-item.is-active),
.el-menu-vertical:deep(.el-menu--inline .el-menu-item.is-active) {
  background-color: #ecf5ff !important;
  color: #409eff !important;
  border-radius: 6px;
}

/* 提高选择器特异性，覆盖Element Plus默认样式 */
.el-menu-vertical:deep(.el-menu--inline) .el-menu-item.is-active {
  background-color: #ecf5ff !important;
  color: #409eff !important;
  border-radius: 6px;
}

.home-button {
  margin-right: 15px;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: #606266;
}

.home-button:hover {
  color: #409EFF;
}

.home-button :deep(.el-icon) {
  margin-right: 4px;
  font-size: 16px;
}
</style>
