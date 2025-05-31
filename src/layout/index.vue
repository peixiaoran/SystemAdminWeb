<template>
  <div class="app-container">
    <!-- 侧边菜单 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside-container">
      <div class="logo-container">
        <div class="logo-content" v-if="!isCollapse">
          <img src="/favicon.svg" alt="Logo" class="logo-icon" />
          <h1 class="logo-text">Vue Admin</h1>
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
            <el-breadcrumb-item :to="{ path: '/' }">{{ $t('common.home') }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentSystemName">{{ currentSystemName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="right-menu">
          <!-- 返回首页按钮，使用SVG -->
          <div class="home-button" @click="returnToModuleSelect">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>{{ $t('common.backToHome') }}</span>
          </div>
          
          <!-- 语言切换下拉菜单 -->
          <el-dropdown trigger="click" class="language-dropdown">
            <div class="language-selector">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span class="language-text">{{ currentLanguageLabel }}</span>
              <el-icon class="el-icon-arrow-down"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLanguageChange('zh-CN')">中文简体</el-dropdown-item>
                <el-dropdown-item @click="handleLanguageChange('zh-TW')">中文繁体</el-dropdown-item>
                <el-dropdown-item @click="handleLanguageChange('en-US')">English</el-dropdown-item>
                <el-dropdown-item @click="handleLanguageChange('vi-VN')">Tiếng Việt</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <el-dropdown trigger="click">
            <div class="avatar-wrapper">
              <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
              <span class="username">{{ username }}</span>
              <el-icon class="el-icon-arrow-down"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>{{ $t('common.personalInfo') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('common.changePassword') }}</el-dropdown-item>
                <el-dropdown-item divided @click="logout">{{ $t('common.logout') }}</el-dropdown-item>
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
          <div class="context-menu-item" @click="refreshSelectedTag">{{ $t('common.refreshPage') }}</div>
          <div class="context-menu-item" @click="closeSelectedTag">{{ $t('common.closeCurrentTab') }}</div>
          <div class="context-menu-item" @click="closeOthersTags">{{ $t('common.closeOtherTabs') }}</div>
          <div class="context-menu-item" @click="closeAllTags">{{ $t('common.closeAllTabs') }}</div>
        </div>
      </div>
      
      <!-- 主要内容区域 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="page-slide" mode="out-in">
            <keep-alive :include="cachedTabs">
              <component :is="markRaw(Component)" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch, markRaw, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import { MENU_API } from '@/config/api/domainmenu/menu'
import { useUserStore } from '@/stores/user'
import { useModuleStore } from '@/stores/module'
import { Fold, Expand, ArrowDown, Back } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

// 状态
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const moduleStore = useModuleStore()
const { t, locale } = useI18n()
const isCollapse = ref(false)
const menuList = ref([])
const username = ref('')
const currentSystemName = ref('')

// 标签相关状态
const activeTabName = ref('')
const visitedTabs = ref([])
const cachedTabs = ref([])

// 监听语言变化，更新标签标题
watch(() => locale.value, () => {
  // 更新所有标签的标题
  visitedTabs.value.forEach((tab, index) => {
    if (tab.titleKey && tab.titleKey.startsWith('route.')) {
      visitedTabs.value[index].title = t(tab.titleKey)
    }
  })
  // 更新页面标题
  const currentRoute = router.currentRoute.value
  if (currentRoute.meta.title) {
    document.title = t(currentRoute.meta.title) + ' - ' + t('common.systemTitle')
  }
}, { immediate: true })

const currentLanguageLabel = computed(() => {
  const languageMap = {
    'zh-CN': '中文简体',
    'zh-TW': '中文繁体',
    'en-US': 'English',
    'vi-VN': 'Tiếng Việt'
  }
  return languageMap[locale.value] || '中文简体'
})

const handleLanguageChange = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
  
  // 刷新当前页面
  const currentPath = route.path
  const index = cachedTabs.value.indexOf(currentPath.replace(/\//g, '-'))
  if (index > -1) {
    cachedTabs.value.splice(index, 1)
  }
  
  nextTick(() => {
    router.replace('/').then(() => {
      nextTick(() => {
        router.replace(currentPath)
      })
    })
  })
}

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
  
  // 检查点击的菜单路径是否对应一个标签
  const isPathInTabs = visitedTabs.value.some(tab => tab.path === index);
  
  if (isPathInTabs) {
    // 如果菜单路径已存在标签，更新活动标签
    activeTabName.value = index;
    
    // 保存当前活动标签到本地存储
    saveTabsToStorage();
  } else {
    // 如果不存在对应标签，尝试获取路由信息
    const matchedRoute = router.resolve(index);
    
    // 检查是否是有效路由且没有noTag标记
    if (matchedRoute && matchedRoute.matched && matchedRoute.matched.length > 0) {
      const hasNoTagMark = matchedRoute.meta && matchedRoute.meta.noTag;
      
      // 如果路由不应该有标签，则不处理
      if (hasNoTagMark) {
        return;
      }
      
      // 获取路由标题和图标
      const routeTitleKey = matchedRoute.meta?.title || '未命名页面';
      const routeTitle = routeTitleKey.startsWith('route.') ? t(routeTitleKey) : routeTitleKey;
      const routeIcon = matchedRoute.meta?.icon || 'Document';
      
      // 添加新标签
      visitedTabs.value.push({
        title: routeTitle,
        titleKey: routeTitleKey,
        path: index,
        icon: routeIcon,
        name: index.replace(/\//g, '-')
      });
      
      // 添加到缓存列表
      const componentName = index.replace(/\//g, '-');
      if (!cachedTabs.value.includes(componentName)) {
        cachedTabs.value.push(componentName);
      }
      
      // 更新活动标签
      activeTabName.value = index;
      
      // 保存标签状态
      saveTabsToStorage();
    }
  }
}

// 保存标签到本地存储
const saveTabsToStorage = () => {
  try {
    const tabsData = {
      visitedTabs: visitedTabs.value,
      activeTabName: activeTabName.value,
      cachedTabs: cachedTabs.value
    }
    localStorage.setItem('tabs-store', JSON.stringify(tabsData))
  } catch (error) {
  }
}

// 监听路由变化，保持菜单激活状态和标签选中状态同步
watch(() => route.path, (newPath, oldPath) => {
  // 始终更新激活的菜单项
  activeMenu.value = newPath
  
  // 确保展开对应的菜单
  nextTick(() => {
    openMenuForPath(newPath)
  })
  
  // 处理特殊路径：模块选择或首页
  if (newPath === moduleStore.moduleIndexPath || newPath === '/' || newPath === '/module-select' || newPath === '/login') {
    // 特殊路径不处理标签逻辑
    return;
  }
  
  // 检查新路径是否在现有标签中
  const isPathInTabs = visitedTabs.value.some(tab => tab.path === newPath);
  
  // 如果新路径在标签中，直接更新活动标签
  if (isPathInTabs) {
    activeTabName.value = newPath;
    return;
  }
  
  // 如果新路径不在标签中，但是不是由刷新引起的路由变化（oldPath存在），尝试添加新标签
  if (oldPath && oldPath !== '/' && oldPath !== '/login') {
    // 尝试获取路由信息以添加新标签
    const matchedRoute = router.resolve(newPath)
    if (matchedRoute && matchedRoute.name) {
      // 检查是否有noTag标记
      const hasNoTagMark = matchedRoute.meta && matchedRoute.meta.noTag
      if (hasNoTagMark) {
        // 有noTag标记，不添加标签但更新活动标签
        activeTabName.value = newPath
        return
      }
      
      // 尝试从路由元数据中获取标题和图标
      const routeTitleKey = matchedRoute.meta?.title || '未命名页面'
      const routeTitle = routeTitleKey.startsWith('route.') ? t(routeTitleKey) : routeTitleKey
      const routeIcon = matchedRoute.meta?.icon || 'Document'
      
      // 添加新标签
      visitedTabs.value.push({
        title: routeTitle,
        titleKey: routeTitleKey,
        path: newPath,
        icon: routeIcon,
        name: newPath.replace(/\//g, '-')
      })
      
      // 添加到缓存列表
      if (!cachedTabs.value.includes(newPath.replace(/\//g, '-'))) {
        cachedTabs.value.push(newPath.replace(/\//g, '-'))
      }
      
      // 设置为活动标签
      activeTabName.value = newPath
      
      // 保存标签状态
      saveTabsToStorage()
    }
  }
}, { immediate: true });

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
    // 从moduleStore获取当前选择的domainId
    const domainId = moduleStore.currentDomainId
    if (!domainId) {
      ElMessage.warning('未选择系统模块，请先选择一个模块')
      router.push('/module-select')
      return
    }
    
    // 更新当前系统名称
    currentSystemName.value = moduleStore.currentSystemName
    
    // 请求菜单数据
    const res = await post(MENU_API.GET_MENU, { domainId })
    
    if (res && res.code === '200') {
      // 处理菜单数据，将其与路由数据对应起来
      menuList.value = processMenuData(res.data || [])
    } else {
      ElMessage.error(res?.message || '获取菜单数据失败')
    }
  } catch (error) {
    ElMessage.error('获取菜单数据失败，请稍后重试')
  }
}

// 处理菜单数据，将API返回的菜单与路由匹配
const processMenuData = (menuData) => {
  // 获取当前路由器中的所有路由
  const routes = router.getRoutes()
  
  // 处理菜单数据，确保menuIcon属性存在
  return menuData.map(menu => {
    // 尝试查找匹配的路由，优先匹配name
    const matchedRoute = routes.find(route => 
      route.name === menu.menuId || 
      route.path === getFormattedPath(menu.path)
    )
    
    // 如果找到匹配的路由，使用路由的meta信息补充菜单数据
    if (matchedRoute && matchedRoute.meta) {
      menu.menuIcon = menu.menuIcon || matchedRoute.meta.icon || 'Document'
      // 可以在这里添加更多路由信息到菜单
    } else {
      // 如果没有匹配的路由，设置默认图标
      menu.menuIcon = menu.menuIcon || 'Document'
    }
    
    // 如果有子菜单，递归处理
    if (menu.menuChildList && menu.menuChildList.length > 0) {
      menu.menuChildList = processMenuData(menu.menuChildList)
    }
    
    return menu
  })
}

// 切换菜单折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 退出登录
const logout = async () => {
  try {
    await ElMessageBox.confirm(t('common.confirmLogout'), t('common.tip'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
    
    // 清除标签缓存
    localStorage.removeItem('tabs-store')
    
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

  const formattedPath = getFormattedPath(path)

  try {
    // 获取匹配的路由
    const matchedRoute = router.resolve(formattedPath)
    
    // 如果路由不存在，显示警告并返回
    if (!matchedRoute || !matchedRoute.matched || matchedRoute.matched.length === 0) {
      ElMessage.warning(`路由 ${formattedPath} 不存在`)
      return
    }
    
    // 检查路由是否有noTag标记
    const hasNoTagMark = matchedRoute.meta && matchedRoute.meta.noTag
    
    // 如果路由有noTag标记，则不添加标签
    if (hasNoTagMark) {
      activeTabName.value = formattedPath
      activeMenu.value = formattedPath
      router.push(formattedPath)
      return
    }
    
    // 如果路由有重定向，且重定向到空路径，则不添加标签，也不跳转
    if (matchedRoute.redirectedFrom === '') {
      return
    }
    
    // 从路由元数据中获取标题和图标，并使用i18n翻译
    const routeTitleKey = matchedRoute.meta?.title || menuName
    const routeTitle = routeTitleKey.startsWith('route.') ? t(routeTitleKey) : menuName
    const routeIcon = matchedRoute.meta?.icon || menuIcon || 'Document'
    
    // 检查是否已存在相同路径的标签
    const isExist = visitedTabs.value.some(tab => tab.path === formattedPath)
    if (!isExist) {
      // 添加新标签
      const newTab = {
        title: routeTitle,
        titleKey: routeTitleKey,
        path: formattedPath,
        icon: routeIcon,
        name: formattedPath.replace(/\//g, '-')
      }
      
      visitedTabs.value.push(newTab)
      
      // 添加到缓存列表
      const componentName = formattedPath.replace(/\//g, '-')
      if (!cachedTabs.value.includes(componentName)) {
        cachedTabs.value.push(componentName)
      }
    } else {
      // 如果标签已存在，更新标题（可能是因为语言变化）
      const existingTabIndex = visitedTabs.value.findIndex(tab => tab.path === formattedPath)
      if (existingTabIndex !== -1) {
        visitedTabs.value[existingTabIndex].title = routeTitle
      }
    }
    
    // 设置当前活动标签和菜单
    activeTabName.value = formattedPath
    activeMenu.value = formattedPath
    
    // 无论是否是新标签，都保存标签状态到本地存储
    saveTabsToStorage()
    
    // 跳转到对应路由
    router.push(formattedPath)
  } catch (error) {
    // 处理导航错误
    console.error('导航错误:', error)
    ElMessage.error('导航失败，请检查路由配置')
  }
}

// 处理标签点击
const handleTabClick = async (tab) => {
  const path = tab.props.name;
  activeMenu.value = path;
  activeTabName.value = path;
  
  // 保存当前活动标签
  saveTabsToStorage()

  await router.push(path)
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
          // 如果没有其他标签，跳转到当前模块的index首页
          const moduleIndexPath = moduleStore.moduleIndexPath
          if (moduleIndexPath !== '/module-select') {
            activeTabName.value = moduleIndexPath
            // 使用nextTick确保DOM更新后再跳转
            nextTick(() => {
              router.push(moduleIndexPath)
            })
          } else {
            // 如果没有模块信息，则跳转到模块选择页面
            // 使用nextTick确保DOM更新后再跳转
            nextTick(() => {
              router.push('/module-select')
            })
          }
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
  
  // 保存标签状态到本地存储
  saveTabsToStorage()
  
  // 如果移除后没有标签了，也跳转到模块首页
  if (visitedTabs.value.length === 0) {
    const moduleIndexPath = moduleStore.moduleIndexPath
    if (moduleIndexPath !== '/module-select') {
      activeTabName.value = moduleIndexPath
      // 使用nextTick确保DOM更新后再跳转
      nextTick(() => {
        router.push(moduleIndexPath)
      })
    } else {
      // 使用nextTick确保DOM更新后再跳转
      nextTick(() => {
        router.push('/module-select')
      })
    }
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
  
  // 保存标签状态到本地存储
  saveTabsToStorage()
  
  // 跳转到当前选中的标签
  activeTabName.value = path
  // 使用nextTick确保DOM更新后再跳转
  nextTick(() => {
    router.push(path)
  })
}

// 关闭所有标签
const closeAllTags = () => {
  visitedTabs.value = []
  cachedTabs.value = []
  
  // 保存标签状态到本地存储
  saveTabsToStorage()
  
  // 跳转到当前模块的首页
  const moduleIndexPath = moduleStore.moduleIndexPath
  if (moduleIndexPath !== '/module-select') {
    activeTabName.value = moduleIndexPath
    // 使用nextTick确保DOM更新后再跳转
    nextTick(() => {
      router.push(moduleIndexPath)
    })
  } else {
    // 使用nextTick确保DOM更新后再跳转
    nextTick(() => {
      router.push('/module-select')
    })
  }
}

// 返回首页
const returnToModuleSelect = () => {
  // 使用nextTick确保DOM更新后再跳转
  nextTick(() => {
    router.push('/module-select')
  })
}

// 在组件挂载后执行
onMounted(async () => {
  // 从用户存储或本地存储获取用户名
  if (userStore.username) {
    username.value = userStore.username;
  } else {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      username.value = storedUsername;
    } else {
      // 默认用户名
      username.value = t('moduleSelect.userInfo');
    }
  }
  
  // 获取当前路径
  const currentPath = route.path
  
  // 尝试从本地存储恢复标签状态
  try {
    const tabsData = localStorage.getItem('tabs-store')
    if (tabsData) {
      const { visitedTabs: storedTabs, activeTabName: storedActiveTab, cachedTabs: storedCachedTabs } = JSON.parse(tabsData)
      
      if (Array.isArray(storedTabs) && storedTabs.length > 0) {
        // 处理存储的标签，确保翻译标题
        storedTabs.forEach(tab => {
          // 如果存在titleKey且以route.开头，使用翻译函数处理
          if (tab.titleKey && tab.titleKey.startsWith('route.')) {
            tab.title = t(tab.titleKey)
          } else if (tab.title && typeof tab.title === 'string' && tab.title.startsWith('route.')) {
            // 对于没有titleKey但title是以route.开头的情况
            tab.titleKey = tab.title
            tab.title = t(tab.title)
          }
        })
        
        visitedTabs.value = storedTabs
      }
      
      // 优先使用当前路径作为活动标签，避免闪烁
      if (currentPath !== '/' && currentPath !== '/module-select' && currentPath !== '/login') {
        const isCurrentPathInTabs = visitedTabs.value.some(tab => tab.path === currentPath)
        if (isCurrentPathInTabs) {
          // 当前路径在标签中，直接设置为活动标签
          activeTabName.value = currentPath
          activeMenu.value = currentPath
        } else if (storedActiveTab) {
          // 当前路径不在标签中，使用存储的活动标签
          activeTabName.value = storedActiveTab
          activeMenu.value = storedActiveTab
        }
      } else if (storedActiveTab) {
        // 对于特殊路径，使用存储的活动标签
        activeTabName.value = storedActiveTab
        activeMenu.value = storedActiveTab
      }
      
      if (Array.isArray(storedCachedTabs) && storedCachedTabs.length > 0) {
        cachedTabs.value = storedCachedTabs
      }
    }
  } catch (error) {
    console.error('恢复标签状态失败:', error)
  }
  
  // 获取菜单数据
  await fetchMenuData()
  
  // 处理初始路由
  if (currentPath === '/' || currentPath === '/module-select' || currentPath === '/login') {
    // 对于根路径或模块选择页，不进行特殊处理
  } else {
    // 检查当前路径是否在标签中
    const isCurrentPathInTabs = visitedTabs.value.some(tab => tab.path === currentPath)
    
    // 获取匹配的路由
    const matchedRoute = router.resolve(currentPath)
    
    // 检查是否有noTag标记
    const hasNoTagMark = matchedRoute && matchedRoute.meta && matchedRoute.meta.noTag
    
    // 如果路由有noTag标记，则不添加标签，只设置活动菜单
    if (hasNoTagMark) {
      activeTabName.value = currentPath
      activeMenu.value = currentPath
      return
    }
    
    if (!isCurrentPathInTabs && activeTabName.value && activeTabName.value !== currentPath) {
      // 当前路径不在标签中，跳转到激活的标签
      router.push(activeTabName.value)
    } else if (!isCurrentPathInTabs) {
      // 如果当前路径不在标签中，且没有激活标签，添加当前路径到标签
      if (matchedRoute && matchedRoute.name) {
        // 尝试从路由元数据中获取标题和图标
        const routeTitleKey = matchedRoute.meta?.title || '未命名页面'
        // 如果标题键以route.开头，使用翻译函数
        const routeTitle = routeTitleKey.startsWith('route.') ? t(routeTitleKey) : routeTitleKey
        const routeIcon = matchedRoute.meta?.icon || 'Document'
        
        // 添加新标签
        visitedTabs.value.push({
          title: routeTitle,
          titleKey: routeTitleKey,
          path: currentPath,
          icon: routeIcon,
          name: currentPath.replace(/\//g, '-')
        })
        
        // 添加到缓存列表
        if (!cachedTabs.value.includes(currentPath.replace(/\//g, '-'))) {
          cachedTabs.value.push(currentPath.replace(/\//g, '-'))
        }
        
        // 保存标签状态
        saveTabsToStorage()
      }
      
      // 设置当前路径为活动标签
      activeTabName.value = currentPath
      activeMenu.value = currentPath
    }
  }
  
  // 确保在初始化时展开对应的菜单
  nextTick(() => {
    openMenuForPath(activeMenu.value)
  })
})

// 确保打开对应路径的菜单
const openMenuForPath = (path) => {
  if (!path) return;
  
  // 尝试找到匹配的菜单项
  const findAndOpenParentMenu = (items, targetPath) => {
    for (const item of items) {
      // 如果当前菜单项有子菜单
      if (item.menuChildList && item.menuChildList.length > 0) {
        // 检查子菜单中是否有匹配的路径
        const hasMatchingChild = item.menuChildList.some(child => 
          getFormattedPath(child.path) === targetPath ||
          targetPath.startsWith(getFormattedPath(child.path) + '/')
        );
        
        // 如果在子菜单中找到匹配项，则打开当前菜单
        if (hasMatchingChild) {
          // 这里我们仅需要设置activeMenu，el-menu会根据default-active属性自动展开
          return true;
        }
        
        // 递归检查子菜单
        if (findAndOpenParentMenu(item.menuChildList, targetPath)) {
          return true;
        }
      } else if (getFormattedPath(item.path) === targetPath) {
        // 如果当前菜单项路径匹配
        return true;
      }
    }
    
    return false;
  };
  
  // 对所有顶级菜单项执行查找
  findAndOpenParentMenu(menuList.value, path);
}
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
  padding: 8px 13px;
  overflow: hidden;
  background-color: #fff;
  height: 35px;
  display: flex;
  align-items: center;
  border-bottom: none;
  margin-top: -3px;
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
  margin-top: -2px;
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
  padding: 0 14px;
  margin: 0;
  border-radius: 6px;
}

.el-menu-vertical:deep(.el-menu-item i) {
  margin-right: 12px;
}

.el-menu-vertical:deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
  padding: 0 14px;
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
  padding-left: 16px !important;
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
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.home-button:hover {
  color: #409EFF;
  background-color: #ecf5ff;
}

.home-button .icon {
  margin-right: 4px;
}

/* 语言切换下拉菜单样式 */
.language-dropdown {
  margin-right: 15px;
}

.language-selector {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.language-selector:hover {
  color: #409EFF;
  background-color: #ecf5ff;
}

.language-text {
  margin: 0 4px;
  font-size: 14px;
  color: #606266;
}

.language-selector .icon {
  color: #606266;
}

.language-selector:hover .icon {
  color: #409EFF;
}
</style>
