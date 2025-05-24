<template>
  <div class="app-container">
    <!-- 侧边菜单 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside-container">
      <div class="logo-container">
        <div class="logo-content" v-if="!isCollapse">
          <img src="/favicon.svg" alt="Logo" class="logo-icon" />
          <h1 class="logo-text">System Admin</h1>
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
              <el-icon><component :is="getMarkRawComponent(menu.menuIcon || 'Menu')" /></el-icon>
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
              <el-icon><component :is="getMarkRawComponent(subMenu.menuIcon || 'Document')" /></el-icon>
              <span>{{ subMenu.menuName }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 一级菜单（无子菜单） -->
          <el-menu-item v-else :index="menu.path" @click="addTab(menu)">
            <el-icon><component :is="getMarkRawComponent(menu.menuIcon || 'Menu')" /></el-icon>
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
            <el-breadcrumb-item :to="{ path: '/' }">{{ $t('layout.home') }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentSystemName">{{ currentSystemName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="right-menu">
          <!-- 添加返回首页按钮 -->
          <el-popover
            placement="bottom"
            :width="150"
            trigger="hover"
            content="返回系统首页"
          >
            <template #reference>
              <el-button type="default" @click="returnToModuleSelect" class="nav-button home-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svg-icon">
                  <path fill="currentColor" d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2zm-9-9H6.5v5H10v-5zm8.5 0H15v5h3.5v-5zm-8.5-6H6.5v4H10V6zm8.5 0H15v4h3.5V6z"/>
                </svg>
              </el-button>
            </template>
          </el-popover>

          <!-- 添加语言切换下拉菜单 -->
          <el-popover
            placement="bottom"
            :width="150"
            trigger="hover"
            content="切换系统语言"
          >
            <template #reference>
              <el-dropdown trigger="click" @command="handleLanguageChange" class="language-dropdown">
                <el-button type="default" class="nav-button language-selector">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="svg-icon">
                    <path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                  </svg>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="zh-CN">中文简体</el-dropdown-item>
                    <el-dropdown-item command="zh-TW">中文繁体</el-dropdown-item>
                    <el-dropdown-item command="en-US">English</el-dropdown-item>
                    <el-dropdown-item command="vi-VN">Tiếng Việt</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-popover>

          <el-dropdown trigger="click">
            <div class="avatar-wrapper">
              <el-avatar size="small" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
              <span class="username">{{ username }}</span>
              <el-icon class="el-icon-arrow-down"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>{{ $t('layout.personalInfo') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('layout.changePassword') }}</el-dropdown-item>
                <el-dropdown-item divided @click="logout">{{ $t('layout.logout') }}</el-dropdown-item>
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
                <el-icon class="tab-icon" v-if="tab.icon">
                  <component :is="getMarkRawComponent(tab.icon)" />
                </el-icon>
                <span>{{ tab.title }}</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>

        <!-- 右键菜单 -->
        <div v-show="contextMenuVisible" :style="contextMenuStyle" class="context-menu">
          <div class="context-menu-item" @click="refreshSelectedTag">{{ $t('layout.refreshPage') }}</div>
          <div class="context-menu-item" @click="closeSelectedTag">{{ $t('layout.closeCurrentTab') }}</div>
          <div class="context-menu-item" @click="closeOthersTags">{{ $t('layout.closeOtherTabs') }}</div>
          <div class="context-menu-item" @click="closeAllTags">{{ $t('layout.closeAllTabs') }}</div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="page-slide" mode="out-in">
            <keep-alive :include="cachedTabs">
              <component :is="getRouterComponent(Component)" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, watch, markRaw, computed, isRef, defineAsyncComponent, shallowRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import { MENU_API } from '@/config/api/domainmenu/menu'
import { useUserStore } from '@/stores/user'
import { useModuleStore } from '@/stores/module'
import { Fold, Expand, ArrowDown } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import NProgress from 'nprogress'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const moduleStore = useModuleStore()
const { t, locale } = useI18n()
const isCollapse = ref(false)
const menuList = ref([])
const username = ref('管理员')
const currentSystemName = ref('')

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
  
  // 启动进度条
  NProgress.start()
  
  nextTick(() => {
    router.replace('/').then(() => {
      nextTick(() => {
        router.replace(currentPath).then(() => {
          // 完成进度条
          NProgress.done()
        }).catch(() => {
          NProgress.done()
        })
      })
    }).catch(() => {
      NProgress.done()
    })
  })
}

const getFormattedPath = (path) => {
  if (!path) return ''
  let formattedPath = path.endsWith('.vue') ? path.replace('.vue', '') : path
  if (!formattedPath.startsWith('/')) {
    formattedPath = '/' + formattedPath
  }
  return formattedPath
}

const activeMenu = ref(route.path)

const isMenuActive = (menuPath) => {
  const formattedMenuPath = getFormattedPath(menuPath)
  return activeMenu.value === formattedMenuPath
}

const handleMenuSelect = (index, indexPath) => {
  activeMenu.value = index
}

const activeTabName = ref('')
const visitedTabs = ref([])
const cachedTabs = ref([])

const saveTabsToStorage = () => {
  try {
    // 在保存前处理图标组件，确保不会将响应式对象保存到localStorage
    const processedTabs = visitedTabs.value.map(tab => {
      if (tab.icon && typeof tab.icon === 'object') {
        // 创建一个新对象而不是修改原始对象
        return { ...tab, icon: null }
      }
      return tab
    })
    
    const tabsData = {
      visitedTabs: processedTabs,
      activeTabName: activeTabName.value,
      cachedTabs: cachedTabs.value
    }
    localStorage.setItem('tabs-store', JSON.stringify(tabsData))
  } catch (error) {}
}

watch(() => route.path, (newPath) => {
  activeMenu.value = newPath

  if ((newPath === moduleStore.moduleIndexPath || newPath === '/') && visitedTabs.value.length > 0) {
    activeTabName.value = visitedTabs.value[0].path
    if (newPath !== visitedTabs.value[0].path) {
      nextTick(() => {
        router.push(visitedTabs.value[0].path)
      })
    }
    return
  }

  if (visitedTabs.value.length > 0) {
    const isPathInTabs = visitedTabs.value.some(tab => tab.path === newPath)
    if (isPathInTabs) {
      activeTabName.value = newPath
    } else if (activeTabName.value === '') {
      activeTabName.value = visitedTabs.value[0].path
    }
  }
}, { immediate: true })

const contextMenuVisible = ref(false)
const contextMenuStyle = reactive({ left: '0px', top: '0px' })
const tagRightClicked = ref(null)

const fetchMenuData = async () => {
  try {
    const domainId = moduleStore.currentDomainId
    if (!domainId) {
      ElMessage.warning('未选择系统模块，请先选择一个模块')
      router.push('/module-select')
      return
    }

    currentSystemName.value = moduleStore.currentSystemName

    const res = await post(MENU_API.GET_MENU, { domainId })

    if (res && res.code === '200') {
      menuList.value = res.data || []
    } else {
      ElMessage.error(res?.message || '获取菜单数据失败')
    }
  } catch (error) {
    ElMessage.error('获取菜单数据失败，请稍后重试')
  }
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const logout = async () => {
  try {
    await ElMessageBox.confirm(t('common.confirmLogout'), t('common.tip'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })

    localStorage.removeItem('tabs-store')

    await userStore.logout()
    router.push('/login')
  } catch (error) {}
}

const addTab = async (menu) => {
  const { menuName, path, menuIcon } = menu

  if (!path) {
    ElMessage.warning('菜单路径未定义')
    return
  }

  NProgress.start()

  const formattedPath = getFormattedPath(path)

  try {
    const matchedRoute = router.resolve(formattedPath)

    const hasNoTagMark = matchedRoute && matchedRoute.meta && matchedRoute.meta.noTag

    if (hasNoTagMark) {
      activeTabName.value = formattedPath
      activeMenu.value = formattedPath
      router.push(formattedPath).then(() => {
        NProgress.done()
      }).catch(error => {
        NProgress.done()
      })
      return
    }

    if (matchedRoute && matchedRoute.matched && matchedRoute.matched.some(record => record.redirect === '')) {
      NProgress.done()
      return
    }

    const isExist = visitedTabs.value.some(tab => tab.path === formattedPath)
    if (!isExist) {
      const icon = menuIcon && typeof menuIcon === 'object' ? markRaw(menuIcon) : menuIcon

      visitedTabs.value.push({
        title: menuName,
        path: formattedPath,
        icon: icon,
        name: formattedPath.replace(/\//g, '-')
      })

      if (!cachedTabs.value.includes(formattedPath.replace(/\//g, '-'))) {
        cachedTabs.value.push(formattedPath.replace(/\//g, '-'))
      }

      saveTabsToStorage()
    }

    activeTabName.value = formattedPath
    activeMenu.value = formattedPath
    router.push(formattedPath).then(() => {
      NProgress.done()
    }).catch(error => {
      NProgress.done()
    })
  } catch (error) {
    NProgress.done()
  }
}

const handleTabClick = async (tab) => {
  const path = tab.props.name
  activeMenu.value = path
  activeTabName.value = path

  saveTabsToStorage()

  NProgress.start()
  await router.push(path)
}

const removeTab = (targetPath) => {
  if (activeTabName.value === targetPath) {
    visitedTabs.value.forEach((tab, index) => {
      if (tab.path === targetPath) {
        const nextTab = visitedTabs.value[index + 1] || visitedTabs.value[index - 1]
        if (nextTab) {
          activeTabName.value = nextTab.path
          router.push(nextTab.path)
        } else {
          const moduleIndexPath = moduleStore.moduleIndexPath
          if (moduleIndexPath !== '/module-select') {
            activeTabName.value = moduleIndexPath
            nextTick(() => {
              router.push(moduleIndexPath)
            })
          } else {
            activeTabName.value = ''
            nextTick(() => {
              router.push('/module-select')
            })
          }
        }
      }
    })
  }

  visitedTabs.value = visitedTabs.value.filter(tab => tab.path !== targetPath)

  const index = cachedTabs.value.indexOf(targetPath.replace(/\//g, '-'))
  if (index > -1) {
    cachedTabs.value.splice(index, 1)
  }

  saveTabsToStorage()

  if (visitedTabs.value.length === 0) {
    const moduleIndexPath = moduleStore.moduleIndexPath
    if (moduleIndexPath !== '/module-select') {
      activeTabName.value = moduleIndexPath
      nextTick(() => {
        router.push(moduleIndexPath)
      })
    } else {
      activeTabName.value = ''
      nextTick(() => {
        router.push('/module-select')
      })
    }
  }
}

const handleContextMenu = (e, tab) => {
  e.preventDefault()

  contextMenuStyle.left = e.clientX + 'px'
  contextMenuStyle.top = e.clientY + 'px'

  // 确保标签的icon是非响应式的
  if (tab.icon && typeof tab.icon === 'object') {
    tagRightClicked.value = { ...tab, icon: markRaw(tab.icon) }
  } else {
    tagRightClicked.value = tab
  }

  contextMenuVisible.value = true

  const closeMenu = () => {
    contextMenuVisible.value = false
    document.removeEventListener('click', closeMenu)
  }
  document.addEventListener('click', closeMenu)
}

const refreshSelectedTag = () => {
  if (!tagRightClicked.value) return

  const { path } = tagRightClicked.value

  const index = cachedTabs.value.indexOf(path.replace(/\//g, '-'))
  if (index > -1) {
    cachedTabs.value.splice(index, 1)
  }

  nextTick(() => {
    const currentPath = path
    router.replace('/').then(() => {
      nextTick(() => {
        router.replace(currentPath)
      })
    })
  })
}

const closeSelectedTag = () => {
  if (!tagRightClicked.value) return
  removeTab(tagRightClicked.value.path)
}

const closeOthersTags = () => {
  if (!tagRightClicked.value) return

  const { path } = tagRightClicked.value

  visitedTabs.value = visitedTabs.value.filter(tab => tab.path === path)
  cachedTabs.value = cachedTabs.value.filter(name => name === path.replace(/\//g, '-'))

  saveTabsToStorage()

  activeTabName.value = path
  nextTick(() => {
    router.push(path)
  })
}

const closeAllTags = () => {
  visitedTabs.value = []
  cachedTabs.value = []

  saveTabsToStorage()

  const moduleIndexPath = moduleStore.moduleIndexPath
  if (moduleIndexPath !== '/module-select') {
    activeTabName.value = moduleIndexPath
    nextTick(() => {
      router.push(moduleIndexPath)
    })
  } else {
    activeTabName.value = ''
    nextTick(() => {
      router.push('/module-select')
    })
  }
}

const returnToModuleSelect = () => {
  nextTick(() => {
    router.push('/module-select')
  })
}

watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
}, { immediate: true })

onMounted(async () => {
  await fetchMenuData()

  const hasRestoredTabs = restoreTabsFromStorage()

  if (hasRestoredTabs) {
    if ((route.path === moduleStore.moduleIndexPath || route.path === '/') && visitedTabs.value.length > 0) {
      activeTabName.value = visitedTabs.value[0].path
      activeMenu.value = visitedTabs.value[0].path

      if (route.path !== visitedTabs.value[0].path) {
        nextTick(() => {
          router.push(visitedTabs.value[0].path)
        })
      }
      return
    }

    if (!activeTabName.value && visitedTabs.value.length > 0) {
      activeTabName.value = visitedTabs.value[0].path
      activeMenu.value = visitedTabs.value[0].path
    }

    const currentPath = route.path
    const isCurrentPathInTabs = visitedTabs.value.some(tab => tab.path === currentPath)
    if (isCurrentPathInTabs) {
      activeTabName.value = currentPath
      activeMenu.value = currentPath
    }

    return
  }

  if (route.name && route.meta.title &&
    route.path !== moduleStore.moduleIndexPath &&
    !route.path.includes('/module-select')) {
    const hasNoTagMark = route.meta && route.meta.noTag

    if (!hasNoTagMark) {
      const icon = route.meta.icon && typeof route.meta.icon === 'object' 
        ? markRaw(route.meta.icon) 
        : route.meta.icon
        
      addTab({
        menuName: route.meta.title,
        path: route.path,
        menuIcon: icon
      })
    } else {
      activeMenu.value = route.path
      activeTabName.value = route.path
    }
  }
})

const restoreTabsFromStorage = () => {
  try {
    const tabsData = localStorage.getItem('tabs-store')
    if (tabsData) {
      const { visitedTabs: storedTabs, activeTabName: storedActiveName, cachedTabs: storedCachedTabs } = JSON.parse(tabsData)

      if (Array.isArray(storedTabs) && storedTabs.length > 0) {
        visitedTabs.value = storedTabs.map(tab => {
          if (tab.icon && typeof tab.icon === 'object') {
            return { ...tab, icon: markRaw(tab.icon) }
          }
          return tab
        })

        if (route.path === moduleStore.moduleIndexPath || route.path === '/') {
          activeTabName.value = storedTabs[0].path
          activeMenu.value = storedTabs[0].path
        } else if (storedActiveName) {
          activeTabName.value = storedActiveName
          activeMenu.value = storedActiveName
        } else {
          activeTabName.value = storedTabs[0].path
          activeMenu.value = storedTabs[0].path
        }
      }

      if (Array.isArray(storedCachedTabs) && storedCachedTabs.length > 0) {
        cachedTabs.value = storedCachedTabs
      }

      return true
    }
  } catch (error) {}
  return false
}

// 检查一个对象是否可能是Vue组件
const isComponent = (obj) => {
  return obj && (
    typeof obj === 'object' && 
    (obj.render || 
     obj.setup || 
     obj.template || 
     obj.__file || 
     obj.__asyncLoader ||
     obj.__v_isVNode ||  // 检查是否为VNode
     obj.type ||         // 检查是否为VNode
     obj.__esModule ||   // 检查是否为ES模块
     (obj.hasOwnProperty && obj.hasOwnProperty('__v_isReadonly')) ||
     (obj.hasOwnProperty && obj.hasOwnProperty('__v_raw'))
    )
  )
}

const getMarkRawComponent = (component) => {
  // 处理可能的组件对象
  if (!component) return component;
  
  // 如果已经是非响应式对象或原始值，直接返回
  if (typeof component !== 'object' || Object.isExtensible(component) === false) {
    return component;
  }
  
  try {
    // 如果它看起来像一个组件，使用markRaw处理
    if (isComponent(component)) {
      return markRaw(component);
    }
    
    // 处理可能含有组件的Suspense对象
    if (component.default && isComponent(component.default)) {
      return markRaw(component);
    }
    
    // 处理动态导入的组件(vite/webpack动态导入结果)
    if (component.__esModule && component.default) {
      return markRaw(component);
    }
    
    // 处理函数式组件
    if (typeof component === 'function') {
      return markRaw(component);
    }
    
    // 处理可能的Promise组件（异步组件）
    if (component.then && typeof component.then === 'function') {
      return markRaw(component);
    }
    
    // 如果是其他类型的对象，保守地使用markRaw处理
    return markRaw(component);
  } catch (e) {
    // 如果有任何错误，安全地返回原始组件
    console.error('处理组件时出错:', e);
    return component;
  }
}

// 处理路由组件的特殊函数
const getRouterComponent = (Component) => {
  // 检查组件是否为undefined或null
  if (!Component) return null;
  
  // 使用shallowRef避免递归响应式
  const shallowComponent = shallowRef(Component);
  
  // 应用markRaw防止组件变为响应式
  return markRaw(Component);
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
  overflow: hidden;
}

.el-menu-vertical:deep(.el-menu--inline .el-menu-item) {
  height: 40px;
  line-height: 40px;
  padding-left: 36px !important;
  margin: 4px 0;
  border-radius: 6px;
}

.el-menu-vertical:deep(.el-menu--inline .el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
}

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
.el-menu-item,
.el-sub-menu__title {
  display: flex;
  align-items: center;
  padding-left: 16px !important;
}

.el-menu-item i,
.el-sub-menu__title i {
  margin-right: 12px;
}

.el-menu--inline .el-menu-item {
  padding-left: 20px !important;
}

.custom-active {
  background-color: #ecf5ff !important;
  color: #409eff !important;
  font-weight: 500 !important;
}

.el-menu-vertical:deep(.el-menu-item.is-active),
.el-menu-vertical:deep(.el-menu--inline .el-menu-item.is-active) {
  background-color: #ecf5ff !important;
  color: #409eff !important;
  border-radius: 6px;
}

.language-dropdown {
  margin-right: 15px;
}

.language-selector {
  font-size: 14px;
}

/* 导航按钮共享样式 */
.nav-button {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  padding: 6px;
  height: 32px;
  width: 32px;
  transition: all 0.3s;
}

.nav-button:hover {
  background-color: #f5f5f5;
  color: #409EFF;
}

.nav-button :deep(.el-icon) {
  font-size: 18px;
}

/* 返回首页按钮样式 */
.home-button {
  margin-right: 15px;
}

/* 添加SVG图标样式 */
.svg-icon {
  width: 18px;
  height: 18px;
  transition: all 0.3s;
}

.nav-button:hover .svg-icon {
  color: #409EFF;
}
</style>
