<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <div class="sidebar-container" :class="{ 'is-collapse': isCollapse }">
      <div class="logo-container">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" alt="Logo" class="logo-image" />
        <h1 class="logo-title">{{ currentSystem }}</h1>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="menuLoading" class="menu-loading">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span>加载菜单中...</span>
      </div>
      
      <el-menu
        v-else
        :default-active="activeMenu"
        class="sidebar-menu"
        background-color="#ffffff"
        text-color="#303133"
        active-text-color="#639af8"
        :collapse="isCollapse"
        :unique-opened="false"
        router
        @select="(index, indexPath) => handleMenuSelect(index, indexPath)"
        @open="handleSubMenuOpen"
        @close="handleSubMenuClose"
      >
        <template v-for="route in routes" :key="route.path">
          <!-- 一级菜单 - 没有子菜单或子菜单为空 -->
          <el-menu-item 
            v-if="!route.children || route.children.length === 0" 
            :index="currentBasePath + (route.path ? '/' + route.path : '')"
            :data-menu-name="route.meta ? route.meta.title : route.name"
            :data-menu-icon="route.meta ? route.meta.icon : ''"
          >
            <el-icon v-if="route.meta && route.meta.icon">
              <component v-if="route.meta && route.meta.icon" :is="route.meta.icon" />
            </el-icon>
            <template #title>
              <span class="menu-title">{{ route.meta ? route.meta.title : route.name }}</span>
            </template>
          </el-menu-item>
          
          <!-- 一级菜单 - 有子菜单 -->
          <el-sub-menu 
            v-else 
            :index="currentBasePath + '/' + route.path"
            :data-menu-name="route.meta ? route.meta.title : route.name"
            :data-menu-icon="route.meta ? route.meta.icon : ''"
          >
            <template #title>
              <el-icon v-if="route.meta && route.meta.icon">
                <component v-if="route.meta && route.meta.icon" :is="route.meta.icon" />
              </el-icon>
              <span class="menu-title">{{ route.meta ? route.meta.title : route.name }}</span>
            </template>
            
            <!-- 二级菜单 -->
            <template v-for="child in route.children" :key="child.path">
              <!-- 处理复合路径的特殊情况 -->
              <el-menu-item 
                v-if="(!child.children || child.children.length === 0) && !(route.meta && route.meta.isComplexPath && child.path.includes('/'))" 
                :index="getMenuItemPath(route, child)"
                :data-menu-name="child.meta ? child.meta.title : child.name"
                :data-menu-icon="child.meta ? child.meta.icon : ''"
                :data-path="child.path"
              >
                <el-icon v-if="child.meta && child.meta.icon">
                  <component v-if="child.meta && child.meta.icon" :is="child.meta.icon" />
                </el-icon>
                <template #title>
                  <span class="menu-title">{{ child.meta ? child.meta.title : child.name }}</span>
                </template>
              </el-menu-item>
              
              <!-- 复合路径的子系统处理 -->
              <el-sub-menu 
                v-else-if="route.meta && route.meta.isComplexPath && child.path.includes('/')" 
                :index="currentBasePath + '/' + route.path + '/' + child.path"
                :data-menu-name="child.meta ? child.meta.title : child.name"
                :data-menu-icon="child.meta ? child.meta.icon : ''"
                :data-path="child.path"
              >
                <template #title>
                  <el-icon v-if="child.meta && child.meta.icon">
                    <component v-if="child.meta && child.meta.icon" :is="child.meta.icon" />
                  </el-icon>
                  <span class="menu-title">{{ child.meta ? child.meta.title : child.name }}</span>
                </template>
                
                <!-- 复合路径的子系统的子菜单 -->
                <template v-if="child.children && child.children.length > 0">
                  <el-menu-item 
                    v-for="subChild in child.children" 
                    :key="subChild.path" 
                    :index="getMenuItemPath(child, subChild)"
                    :data-menu-name="subChild.meta ? subChild.meta.title : subChild.name"
                    :data-menu-icon="subChild.meta ? subChild.meta.icon : ''"
                    :data-path="subChild.path"
                  >
                    <el-icon v-if="subChild.meta && subChild.meta.icon">
                      <component v-if="subChild.meta && subChild.meta.icon" :is="subChild.meta.icon" />
                    </el-icon>
                    <template #title>
                      <span class="menu-title">{{ subChild.meta ? subChild.meta.title : subChild.name }}</span>
                    </template>
                  </el-menu-item>
                </template>
              </el-sub-menu>
              
              <!-- 二级菜单 - 有子菜单（三级菜单） -->
              <el-sub-menu 
                v-else
                :index="currentBasePath + '/' + route.path + '/' + child.path"
                :data-menu-name="child.meta ? child.meta.title : child.name"
                :data-menu-icon="child.meta ? child.meta.icon : ''"
                :data-path="child.path"
              >
                <template #title>
                  <el-icon v-if="child.meta && child.meta.icon">
                    <component v-if="child.meta && child.meta.icon" :is="child.meta.icon" />
                  </el-icon>
                  <span class="menu-title">{{ child.meta ? child.meta.title : child.name }}</span>
                </template>
                
                <!-- 三级菜单 -->
                <el-menu-item 
                  v-for="grandChild in child.children" 
                  :key="grandChild.path" 
                  :index="currentBasePath + '/' + route.path + '/' + child.path + '/' + grandChild.path"
                  :data-menu-name="grandChild.meta ? grandChild.meta.title : grandChild.name"
                  :data-menu-icon="grandChild.meta ? grandChild.meta.icon : ''"
                  :data-path="grandChild.path"
                >
                  <el-icon v-if="grandChild.meta && grandChild.meta.icon">
                    <component v-if="grandChild.meta && grandChild.meta.icon" :is="grandChild.meta.icon" />
                  </el-icon>
                  <template #title>
                    <span class="menu-title">{{ grandChild.meta ? grandChild.meta.title : grandChild.name }}</span>
                  </template>
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
    
    <!-- 主区域 -->
    <div class="main-container">
      <!-- 顶部导航 -->
      <div class="navbar">
        <div class="left-menu">
          <div class="hamburger-container" @click="toggleSidebar">
            <el-icon :size="20">
              <component :is="isCollapse ? 'Expand' : 'Fold'" />
            </el-icon>
          </div>
          
          <!-- 删除面包屑导航 -->
        </div>
        <div class="right-menu">
          <a class="home-link" @click="handleHomeClick">首页</a>
          <el-dropdown trigger="click">
            <div class="avatar-wrapper">
              <el-avatar :size="36" :src="userAvatar" />
              <span class="user-name">管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 标签页导航 -->
      <div class="tags-view-container">
        <div class="tags-view-wrapper">
          <div class="tags-view-item" 
                v-for="tag in visitedViews" 
                :key="tag.path"
                :class="{ active: isActive(tag) }"
                @click="goToPage(tag)"
                @contextmenu.prevent="openTagMenu($event, tag)">
            <el-icon v-if="getTagIcon(tag)" size="14" class="tag-icon">
              <component v-if="getTagIcon(tag)" :is="getTagIcon(tag)" />
            </el-icon>
            <span>{{ tag.title }}</span>
            <el-icon class="close-icon" @click.stop="closeTag(tag)"><Close /></el-icon>
          </div>
        </div>
        
        <!-- 标签右键菜单 -->
        <ul v-show="visible" :style="{left: left+'px', top: top+'px'}" class="contextmenu" @click.stop>
          <li @click.stop="refreshSelectedTag">刷新页面</li>
          <li @click.stop="closeTag(selectedTag)">关闭当前</li>
          <li @click.stop="closeOtherTags" class="divided">关闭其他</li>
          <li @click.stop="closeAllTags">关闭所有</li>
          <li @click.stop="closeLeftTags" :class="{ disabled: isFirstVisibleTag }">关闭左侧</li>
          <li @click.stop="closeRightTags" :class="{ disabled: isLastVisibleTag }">关闭右侧</li>
        </ul>
      </div>
      
      <!-- 内容区 -->
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <div class="router-view-container">
                <component :is="Component" />
              </div>
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeMount, nextTick, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SidebarItem from './components/SidebarItem.vue'
import { ArrowDown, Close, Fold, Expand, Search, Bell, Loading } from '@element-plus/icons-vue'
import { IS_DEV, BASE_API_URL } from '@/config/api/login/api'
import { transformMenuToRoutes, getSystemMenu } from '@/utils/menuHelper'
import { ElMessage } from 'element-plus'
import { useMenuStore, useUserStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)
const visitedViews = ref([])

// 使用pinia store
const menuStore = useMenuStore()
const userStore = useUserStore()

// 菜单数据 - 增加处理原始菜单数据的计算属性
const menuData = computed(() => {
  const menuList = menuStore.menuList
  if (!menuList || menuList.length === 0) return {}
  
  // 初始化菜单数据对象，保存原始菜单数据
  const menuDataObj = {
    _rawMenuData: menuList
  }
  
  // 处理菜单数据的逻辑保持不变
  // ... 如果需要原有的处理逻辑，可以在这里添加 ...
  
  return menuDataObj
})

const menuLoading = computed(() => menuStore.isMenuLoading)

// 新增：用户头像
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 新增：搜索功能
const searchKeyword = ref('')

// 新增：通知功能
const notificationCount = ref(5)
const showNotifications = () => {
  // 实现显示通知逻辑
}

// 新增：当前页面对应的自定义标题
const customPageTitle = ref('')

// 新增：面包屑导航中显示的当前页面标题
const currentPageTitle = computed(() => {
  // 如果有自定义设置的标题，优先使用
  if (customPageTitle.value) {
    return customPageTitle.value
  }
  
  // 否则使用getCurrentPageName函数获取当前页面名称
  return getCurrentPageName()
})

// 提取公共的路径处理函数
const processMenuPath = (menu, isMenuCode = false) => {
  let menuPath = ''
  
  if (isMenuCode) {
    return menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
  }
  
  if (menu.path && menu.path.trim() !== '') {
    menuPath = menu.path.toLowerCase()
    // 如果path以/开头，去掉第一个/
    if (menuPath.startsWith('/')) {
      menuPath = menuPath.substring(1)
    }
    // 如果path包含文件名(如index.vue)，则去掉.vue后缀
    if (menuPath.endsWith('.vue')) {
      menuPath = menuPath.substring(0, menuPath.length - 4)
    }
    // 如果path包含目录和文件名，只保留目录部分
    if (menuPath.includes('/')) {
      const pathParts = menuPath.split('/')
      if (pathParts[pathParts.length - 1] === 'index') {
        menuPath = pathParts.slice(0, -1).join('/')
      }
    }
  } else {
    menuPath = menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
  }
  
  return menuPath
}

// 查找一级菜单函数
const findMainMenu = (systemName) => {
  if (!menuData.value._rawMenuData) return null
  
  const rawMenus = menuData.value._rawMenuData
  return rawMenus.find(menu => {
    const menuPath = processMenuPath(menu)
    
    return menuPath === systemName
  })
}

// 查找二级菜单函数
const findSubMenu = (mainMenu, subMenuPath, pathParts) => {
  if (!mainMenu || !mainMenu.menuChildList) return null
  
  // 直接匹配二级菜单
  const subMenu = mainMenu.menuChildList.find(menu => {
    const menuPath = processMenuPath(menu)
    
    // 处理当前路径
    let currentPath = subMenuPath
    if (currentPath.endsWith('.vue')) {
      currentPath = currentPath.substring(0, currentPath.length - 4)
    }
    
    return menuPath === currentPath || 
           menuPath === `${currentPath}/${pathParts[4] || ''}` ||
           menu._processedPath === currentPath
  })
  
  if (subMenu) return subMenu
  
  // 如果没有直接找到，尝试更复杂的匹配
  const fullSubPath = pathParts.slice(3).join('/')
  
  for (const menu of mainMenu.menuChildList) {
    if (!menu.path) continue
    
    let menuPath = processMenuPath(menu)
    
    // 处理当前路径
    let currentPath = fullSubPath
    if (currentPath.endsWith('.vue')) {
      currentPath = currentPath.substring(0, currentPath.length - 4)
    }
    
    // 检查路径是否匹配
    if (menuPath === currentPath || 
        menuPath === `${subMenuPath}/${pathParts[4] || ''}` || 
        menuPath.startsWith(`${subMenuPath}/`)) {
      return menu
    }
  }
  
  return null
}

// 面包屑文本
const breadcrumbText = ref('')

// 强制更新面包屑文本
const forceUpdateBreadcrumb = (text, immediate = false) => {
  breadcrumbText.value = text
  if (immediate) {
    nextTick()
  }
}

// 获取当前页面的菜单名称
const getMenuNameFromPath = (path) => {
  if (!path) return ''
  
  const pathParts = path.split('/')
  if (pathParts.length < 4) return ''
  
  const systemName = pathParts[2]
  const subMenuPath = pathParts[3]
  const isSubPage = pathParts.length > 4
  const subPageName = isSubPage ? pathParts[pathParts.length - 1] : ''
  
  // 使用原始菜单数据查找菜单信息
  if (menuData.value._rawMenuData) {
    const rawMenus = menuData.value._rawMenuData || []
    
    // 查找系统菜单
    const systemMenu = rawMenus.find(menu => {
      if (!menu.path) return false
      const menuPath = menu.path.toLowerCase()
      // 处理复合路径格式的菜单
      if (menuPath.includes('/')) {
        const parts = menuPath.split('/')
        return parts[0] === systemName
      }
      return menuPath === systemName
    })
    
    if (systemMenu) {
      // 根据路径类型不同处理
      if (isSubPage) {
        // 如果是具体页面，尝试查找对应的子菜单
        const subMenu = findSubMenuByPath(systemMenu, `${subMenuPath}/${subPageName}`)
        if (subMenu) {
          return subMenu.menuName
        }
      } else {
        // 如果只点击了二级菜单（如system-admin/system-mgmt）
        // 尝试查找匹配的二级菜单
        const subMenu = findSubMenuByPath(systemMenu, subMenuPath)
        if (subMenu) {
          return subMenu.menuName
        } else {
          // 如果没找到匹配的子菜单，使用上级菜单的名称
          return systemMenu.menuName
        }
      }
    }
  }
  
  // 如果没有找到标题，使用路径部分作为标题
  return isSubPage ? 
    subPageName.charAt(0).toUpperCase() + subPageName.slice(1).replace(/-/g, ' ') :
    subMenuPath.charAt(0).toUpperCase() + subMenuPath.slice(1).replace(/-/g, ' ')
}

// 修改getMenuItemPath函数确保路径正确
const getMenuItemPath = (route, child) => {
  // 获取基础路径
  const basePath = currentBasePath.value
  
  // 检查父级路由是否是复合路径
  const isParentComplexPath = route.meta && route.meta.isComplexPath
  
  // 获取子菜单路径
  let childPath = child.path
  
  // 如果有子菜单自己的复合路径设置，则直接使用它
  if (child.meta && child.meta.fullPath) {
    return `${basePath}/${child.meta.fullPath}`
  }
  
  // 检查父级是否有复合路径信息，并且子菜单不是完整路径
  if (isParentComplexPath && route.meta && route.meta.subSystemPath) {
    // 移除子路径中的.vue后缀
    if (childPath.endsWith('.vue')) {
      childPath = childPath.replace('.vue', '')
    }
    
    // 移除路径开头的斜杠（如果有）
    if (childPath.startsWith('/')) {
      childPath = childPath.substring(1)
    }
    
    // 检查子菜单路径是否已包含子系统路径
    const subSystemPath = route.meta.subSystemPath
    if (childPath.startsWith(subSystemPath + '/')) {
      // 子菜单路径已包含子系统路径，直接使用
      return `${basePath}/${childPath}`
    }
    
    // 构建使用父级子系统路径的完整路径: /dashboard/system-admin/system-mgmt/domain
    return `${basePath}/${route.meta.subSystemPath}/${childPath}`
  }
  
  // 处理常规路径
  // 检查子菜单路径是否包含文件路径
  if (childPath.includes('/')) {
    // 如果包含斜杠，可能是文件路径，取第一部分作为路由路径
    const pathParts = childPath.split('/')
    
    // 如果最后一部分是index或index.vue，则使用前面的部分
    if (pathParts[pathParts.length - 1] === 'index' || 
        pathParts[pathParts.length - 1] === 'index.vue') {
      childPath = pathParts.slice(0, -1).join('/')
    }
  }
  
  // 如果路径以/开头，去掉第一个/
  if (childPath.startsWith('/')) {
    childPath = childPath.substring(1)
  }
  
  // 移除子路径中的.vue后缀
  if (childPath.endsWith('.vue')) {
    childPath = childPath.replace('.vue', '')
  }
  
  // 构建完整路径 - 直接使用基础路径 + 子菜单路径
  const fullPath = `${basePath}/${childPath}`
  
  return fullPath
}

// 添加一个辅助函数，确保标签数据使用菜单名称
const createTagFromMenuData = (path, defaultTitle = '') => {
  // 检查路径是否有效
  if (!path) return null
  
  console.log('尝试从路径创建标签:', path, '默认标题:', defaultTitle)
  
  const tag = {
    path: path,
    title: defaultTitle,
    icon: 'Document'
  }
  
  const pathParts = path.split('/')
  if (pathParts.length < 4) return tag
  
  // 尝试从菜单数据中获取真实信息
  // 系统和子系统路径
  const systemName = pathParts[2]
  const subMenuPath = pathParts[3]
  const isSubPage = pathParts.length > 4
  const subPageName = isSubPage ? pathParts[pathParts.length - 1] : ''
  
  console.log('解析路径:', { systemName, subMenuPath, isSubPage, subPageName })
  
  if (menuData.value && menuData.value._rawMenuData) {
    const rawMenus = menuData.value._rawMenuData
    
    // 查找一级菜单
    for (const menu of rawMenus) {
      if (!menu.path) continue
      
      const menuPath = menu.path.toLowerCase()
      if (menuPath.startsWith(systemName) || menuPath.includes('/' + systemName) || menuPath === systemName) {
        console.log('找到匹配的一级菜单:', menu.menuName)
        
        // 查找二级菜单
        if (menu.menuChildList && menu.menuChildList.length > 0) {
          let matched = false
          
          for (const childMenu of menu.menuChildList) {
            if (!childMenu.path) continue
            
            // 处理路径
            let childPath = childMenu.path.toLowerCase()
            if (childPath.startsWith('/')) {
              childPath = childPath.substring(1)
            }
            if (childPath.endsWith('.vue')) {
              childPath = childPath.substring(0, childPath.length - 4)
            }
            
            // 检查路径最后部分
            const childPathParts = childPath.split('/')
            const lastPart = childPathParts[childPathParts.length - 1]
            
            // 匹配逻辑
            const isMatchSubMenu = childPath === subMenuPath || childPath.endsWith('/' + subMenuPath) || lastPart === subMenuPath;
            const isMatchSubPage = isSubPage && (childPath.endsWith('/' + subPageName) || lastPart === subPageName);
            
            if (isMatchSubMenu || isMatchSubPage) {
              // 匹配成功，使用真实菜单名称
              console.log('找到匹配的二级菜单:', childMenu.menuName, '匹配方式:', 
                          isMatchSubMenu ? '二级菜单匹配' : '子页面匹配')
              tag.title = childMenu.menuName
              tag.icon = childMenu.menuIcon || 'Document'
              matched = true
              break
            }
          }
          
          // 如果找到匹配，退出循环
          if (matched) break
          else {
            console.log('在菜单:', menu.menuName, '中未找到匹配的二级菜单')
          }
        }
      }
    }
  }
  
  console.log('最终创建的标签:', tag)
  
  // 如果没有找到标题，返回null表示未找到匹配
  if (!tag.title || tag.title === '') {
    console.log('未能找到有效的菜单标题，返回null')
    return null
  }
  
  return tag
  
  // 如果未找到菜单名称，尝试从DOM元素获取
  if (!tag.title) {
    const menuItem = document.querySelector(`.el-menu-item[index="${path}"]`)
    if (menuItem) {
      // 优先使用data属性中的名称
      const menuName = menuItem.getAttribute('data-menu-name')
      if (menuName) {
        tag.title = menuName
      }
      
      // 获取图标
      const iconAttr = menuItem.getAttribute('data-menu-icon')
      if (iconAttr) {
        tag.icon = iconAttr
      }
    }
  }
  
  // 如果仍然没有标题，使用默认值或路径部分
  if (!tag.title) {
    if (defaultTitle) {
      tag.title = defaultTitle
    } else {
      tag.title = isSubPage ? 
        subPageName.charAt(0).toUpperCase() + subPageName.slice(1).replace(/-/g, ' ') :
        subMenuPath.charAt(0).toUpperCase() + subMenuPath.slice(1).replace(/-/g, ' ')
    }
  }
  
  return tag
}

// 添加访问标签 - 修改此函数
const addVisitedView = (view) => {
  // 确保视图对象格式正确
  if (!view) return
  
  // 跳过404页面
  if (view.path && (view.path.includes('/404') || view.path.includes('/not-found'))) {
    console.log('跳过添加404页面到标签:', view.path)
    return
  }
  
  // 如果只提供了路径，尝试从菜单数据中获取完整信息
  if (view.path && !view.title) {
    const tagData = createTagFromMenuData(view.path, '')
    if (tagData) {
      view = { ...view, ...tagData }
    }
  }
  
  // 检查是否已存在相同路径的标签
  const existingTagIndex = visitedViews.value.findIndex(v => v.path === view.path)
  if (existingTagIndex === -1) {
    // 如果不存在，添加新标签
    visitedViews.value.push(view)
  } else {
    // 如果已存在，更新其标题和图标
    visitedViews.value[existingTagIndex] = {
      ...visitedViews.value[existingTagIndex],
      title: view.title || visitedViews.value[existingTagIndex].title,
      icon: view.icon || visitedViews.value[existingTagIndex].icon
    }
  }
  saveVisitedViews()
}

// 更新面包屑导航 - 优化逻辑
const updateBreadcrumb = () => {
  // 如果面包屑已锁定，则不更新
  if (breadcrumbLocked.value) return
  
  const pathParts = route.path.split('/')
  if (pathParts.length < 4) return
  
  const systemName = pathParts[2]
  const subMenuPath = pathParts[3]
  
  // 查找一级菜单
  const mainMenu = findMainMenu(systemName)
  if (!mainMenu) return
  
  // 查找二级菜单
  const subMenu = findSubMenu(mainMenu, subMenuPath, pathParts)
  
  // 更新面包屑
  if (subMenu) {
    forceUpdateBreadcrumb(subMenu.menuName, false)
  } else {
    // 如果没有找到匹配的菜单，使用getCurrentPageName作为备用
    const pageTitle = getCurrentPageName()
    if (pageTitle) {
      forceUpdateBreadcrumb(pageTitle, false)
    }
  }
}

// 获取当前页面名称函数 - 优化逻辑
const getCurrentPageName = () => {
  // 从路径中获取信息
  const pathParts = route.path.split('/')
  if (pathParts.length < 4) return route.meta?.title || ''
  
  const systemName = pathParts[2]
  const subMenuPath = pathParts[3]
  
  // 查找一级菜单
  const mainMenu = findMainMenu(systemName)
  if (!mainMenu) return route.meta?.title || ''
  
  // 查找二级菜单
  const subMenu = findSubMenu(mainMenu, subMenuPath, pathParts)
  
  if (subMenu) {
    return subMenu.menuName
  }
  
  // 如果找不到匹配的菜单，尝试从路由中获取
  const currentPath = route.path
  const matchedRoute = router.getRoutes().find(r => r.path === currentPath)
  if (matchedRoute?.meta?.title) {
    return matchedRoute.meta.title
  }
  
  return route.meta?.title || ''
}

// 获取当前系统名称
const currentSystem = computed(() => {
  // 优先从localStorage中获取保存的系统名称
  const savedSystemName = localStorage.getItem('currentSystemName')
  if (savedSystemName) {
    return savedSystemName
  }
  
  // 如果localStorage中没有，再尝试从路径获取
  const path = route.path.split('/')[2]
  
  // 如果有菜单数据，尝试从原始菜单数据中获取系统名称
  if (Object.keys(menuData.value).length > 0 && menuData.value._rawMenuData) {
    const rawMenus = menuData.value._rawMenuData || []
    
    // 查找匹配的一级菜单
    const matchedMenu = rawMenus.find(menu => {
      const menuPath = menu.path && menu.path.trim() !== '' 
        ? menu.path.toLowerCase() 
        : menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
      
      return menuPath === path
    })
    
    if (matchedMenu) {
      return matchedMenu.menuName
    }
  }
})

// 获取当前基础路径
const currentBasePath = computed(() => {
  const pathParts = route.path.split('/')
  return '/' + pathParts[1] + '/' + pathParts[2]
})

// 获取当前系统的菜单数据
const routes = computed(() => {
  const pathParts = route.path.split('/')
  const systemName = pathParts[2] || ''
  
  // 返回对应系统的菜单数据，如果没有则返回空数组
  const menuRoutes = menuData.value[systemName] || []
  
  // 如果已经处理过的菜单数据，直接返回
  if (menuRoutes.length > 0) {
    return menuRoutes
  }
  
  // 如果没有找到菜单数据，尝试使用原始菜单数据处理
  if (menuData.value._rawMenuData) {
    const rawMenus = menuData.value._rawMenuData || []
    
    // 查找所有对应系统的菜单（支持system-admin/system-mgmt格式）
    const systemMenus = rawMenus.filter(menu => {
      // 处理菜单路径
      let menuPath = ''
      
      if (menu.path && menu.path.trim() !== '') {
        menuPath = menu.path.toLowerCase()
        
        // 去掉开头的斜杠
        if (menuPath.startsWith('/')) {
          menuPath = menuPath.substring(1)
        }
        
        // 检查是否是复合路径（如system-admin/system-mgmt）
        if (menuPath.includes('/')) {
          // 取复合路径的第一部分作为系统名称
          const parts = menuPath.split('/')
          menuPath = parts[0]
        }
      } else {
        menuPath = menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
      }
      
      return menuPath === systemName
    })
    
    // 如果找到了匹配的菜单
    if (systemMenus.length > 0) {
      const allComplexMenus = []
      
      // 处理每个复合路径菜单
      systemMenus.forEach(menu => {
        // 检查是否是复合路径菜单
        const isComplexPath = menu.path && menu.path.includes('/')
        
        if (isComplexPath) {
          // 提取原始路径中的子系统部分
          const pathParts = menu.path.split('/')
          if (pathParts.length >= 2) {
            // 创建子系统菜单
            const subSystemPath = pathParts[1]
            const subSystemMenu = {
              path: `${systemName}/${subSystemPath}`,
              name: `${menu.menuCode}_${subSystemPath}`,
              meta: {
                title: menu.menuName || (subSystemPath.charAt(0).toUpperCase() + subSystemPath.slice(1).replace(/-/g, ' ')),
                icon: menu.menuIcon || 'Document',
                isComplexPath: true,
                subSystemPath: subSystemPath
              },
              children: []
            }
            
            // 处理该子系统下的所有子菜单
            if (menu.menuChildList && menu.menuChildList.length > 0) {
              // 查找属于这个子系统的子菜单
              const subMenus = menu.menuChildList.filter(childMenu => {
                return childMenu.path && childMenu.path.endsWith('.vue')
              })
              
              // 处理子菜单
              if (subMenus.length > 0) {
                // 标记父级信息
                subMenus.forEach(subMenu => {
                  subMenu._parentMenu = {
                    _isComplexPath: true,
                    _systemPath: systemName,
                    _subSystemPath: subSystemPath,
                    _fullPath: menu.path
                  }
                })
                
                // 转换为路由格式
                subSystemMenu.children = transformMenuToRoutes(subMenus, '')
              }
            }
            
            // 添加到结果中
            allComplexMenus.push(subSystemMenu)
          }
        } else {
          // 处理常规菜单
          const mainRoute = {
            path: systemName,
            name: menu.menuCode,
            meta: {
              title: menu.menuName,
              icon: menu.menuIcon || 'Document'
            },
            children: transformMenuToRoutes(menu.menuChildList || [], systemName)
          }
          allComplexMenus.push(mainRoute)
        }
      })
      
      // 返回所有处理后的菜单
      if (allComplexMenus.length > 0) {
        return allComplexMenus
      }
    }
  }
  
  return menuRoutes
})

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 切换侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
  // 每次折叠状态改变时，重新应用样式
  setTimeout(() => {
    handleCollapsedMenuStyle()
  }, 10)
}

// 返回模块选择页面
const backToModuleSelect = () => {
  router.push('/module-select')
}

// 退出登录
const logout = () => {
  userStore.logout() // 使用store的登出方法
}

// 修改菜单获取方法
const fetchMenuData = async () => {
  try {
    console.log('开始获取菜单数据')
    
    // 始终从API获取最新的菜单数据
    console.log('通过API获取菜单数据')
    const menuData = await menuStore.fetchMenuData()
    
    // 确保获取到了菜单数据
    if (menuData && menuData.length > 0) {
      // 将路由实例传递给store，生成路由
      console.log('获取到菜单数据，生成路由...')
      menuStore.generateRoutes(menuData, router)
    } else {
      console.warn('未获取到菜单数据或菜单数据为空')
    }
    
    return menuData
  } catch (error) {
    console.error('获取菜单数据异常', error)
    ElMessage.error('获取菜单数据异常')
    throw error
  }
}

// 组件挂载时获取菜单数据
onMounted(() => {
  // 先触发获取菜单数据，确保路由已生成
  fetchMenuData().then(() => {
    // 恢复标签页状态
    restoreVisitedViews()
    
    // 如果有已访问标签，直接跳转到第一个标签页面
    if (visitedViews.value && visitedViews.value.length > 0) {
      const firstTag = visitedViews.value[0]
      console.log('尝试跳转到第一个标签页面:', firstTag.path)
      if (firstTag.path && firstTag.path !== route.path) {
        router.push(firstTag.path)
      }
    }
    
    // 如果当前路由不是首页，且不在已访问标签中，则添加当前页面到标签
    const currentPath = route.path
    if (currentPath !== '/dashboard' && currentPath.split('/').length >= 4) {
      const pathParts = currentPath.split('/')
      const systemName = pathParts[2]
      const subMenuPath = pathParts[3]
      
      // 查找一级菜单
      const mainMenu = findMainMenu(systemName)
      if (mainMenu) {
        // 查找二级菜单
        const subMenu = findSubMenu(mainMenu, subMenuPath, pathParts)
        
        if (subMenu) {
          // 立即设置面包屑文本，不等待菜单数据加载完成
          forceUpdateBreadcrumb(subMenu.menuName, true)
          
          const newView = {
            path: currentPath,
            title: subMenu.menuName,
            name: route.name,
            icon: subMenu.menuIcon || 'Document'
          }
          
          // 检查是否已存在相同路径的标签
          const existingTagIndex = visitedViews.value.findIndex(v => v.path === currentPath)
          if (existingTagIndex === -1) {
            // 如果不存在，添加新标签
            visitedViews.value.push(newView)
            saveVisitedViews()
          }
        }
      }
    }
    
    // 应用折叠菜单样式
    handleCollapsedMenuStyle()
    
    // 添加 MutationObserver 监听弹出菜单
    setupMenuObserver()
    
    // 初始化菜单展开状态
    setTimeout(() => {
      // 如果路径中有子菜单部分，自动展开该菜单
      const pathParts = route.path.split('/')
      if (pathParts.length >= 4) {
        const basePath = `/${pathParts[1]}/${pathParts[2]}`
        if (!openedMenus.value.includes(basePath)) {
          openedMenus.value.push(basePath)
        }
        restoreMenuOpenState()
      }
      
      // 直接获取所有菜单项元素
      const menuItems = document.querySelectorAll('.el-menu-item')
      const subMenuTitles = document.querySelectorAll('.el-sub-menu__title')
      
      // 为每个菜单项添加点击事件监听
      menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
          // 获取菜单项的index属性值，也就是路由路径
          const path = item.getAttribute('index')
          if (path) {
            // 预先设置标题
            setDocumentTitleByPath(path)
          }
        }, true) // 使用捕获阶段，确保我们的代码先于Element UI的代码执行
      })
      
      // 同样为子菜单标题添加点击事件监听，虽然子菜单标题本身没有跳转，但保险起见
      subMenuTitles.forEach(title => {
        title.addEventListener('click', (e) => {
          const subMenu = title.parentElement
          if (subMenu) {
            const path = subMenu.getAttribute('index')
            if (path) {
              setDocumentTitleByPath(path)
            }
          }
        }, true)
      })
    }, 300) // 延迟一点执行，确保DOM已经渲染完成
  }).catch(error => {
    console.error('菜单初始化失败:', error)
  })

  // 添加点击事件监听器，用于关闭右键菜单
  document.addEventListener('click', handleDocumentClick)
  
  // 调试标签右键菜单功能
  console.log('初始化标签右键菜单', { visible: visible.value })
})

onBeforeUnmount(() => {
  // 移除点击事件监听器
  document.removeEventListener('click', handleDocumentClick)
  console.log('移除标签右键菜单事件监听')
})

// 设置 MutationObserver 监听弹出菜单
const setupMenuObserver = () => {
  // 创建一个观察器实例
  const observer = new MutationObserver((mutations) => {
    // 遍历所有 DOM 变化
    mutations.forEach((mutation) => {
      // 检查是否有新增节点
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          // 检查是否是弹出菜单
          if (node.nodeType === 1) { // 元素节点
            const element = node
            
            // 检查是否是弹出菜单容器
            if (element.classList && (
                element.classList.contains('el-menu--popup-container') || 
                element.classList.contains('el-popper')
            )) {
              // 延迟一下，确保内部元素已渲染
              setTimeout(() => {
                // 查找菜单元素
                const menuEl = element.querySelector('.el-menu--popup')
                if (menuEl) {
                  // 应用样式
                  menuEl.style.borderRadius = '8px'
                  menuEl.style.padding = '5px 0'
                  menuEl.style.maxHeight = 'calc(100vh - 120px)'
                  menuEl.style.overflow = 'auto'
                  
                  // 设置菜单项样式
                  const menuItems = menuEl.querySelectorAll('.el-menu-item')
                  menuItems.forEach(item => {
                    item.style.height = '36px'
                    item.style.lineHeight = '36px'
                    item.style.margin = '2px 5px'
                    item.style.padding = '0 12px'
                    item.style.fontSize = '13px'
                    item.style.borderRadius = '4px'
                  })
                  
                  // 设置子菜单标题样式
                  const subMenuTitles = menuEl.querySelectorAll('.el-sub-menu__title')
                  subMenuTitles.forEach(title => {
                    title.style.height = '36px'
                    title.style.lineHeight = '36px'
                    title.style.margin = '2px 5px'
                    title.style.padding = '0 12px'
                  })
                }
                
                // 设置弹出容器样式
                element.style.borderRadius = '8px'
                element.style.boxShadow = '0 2px 12px 0 rgba(0, 0, 0, 0.1)'
                element.style.animation = 'popperFadeIn 0.2s ease-out'
              }, 10)
            }
          }
        })
      }
    })
  })
  
  // 开始观察 body 元素及其子元素的变化
  observer.observe(document.body, {
    childList: true, // 观察直接子节点的变化
    subtree: true // 观察所有后代节点的变化
  })
  
  // 在组件销毁时停止观察
  onBeforeUnmount(() => {
    observer.disconnect()
  })
}

// 保存标签页到本地存储
const saveVisitedViews = () => {
  try {
    localStorage.setItem('visitedViews', JSON.stringify(visitedViews.value))
  } catch (error) {
  }
}

// 从本地存储恢复标签页
const restoreVisitedViews = () => {
  try {
    const storedViews = localStorage.getItem('visitedViews')
    if (storedViews) {
      visitedViews.value = JSON.parse(storedViews)
      console.log('恢复标签页成功，共', visitedViews.value.length, '个标签')
    } else {
      console.log('没有找到保存的标签页数据')
    }
  } catch (error) {
    console.error('恢复标签页出错:', error)
  }
}

// 获取标签的图标
const getTagIcon = (tag) => {
  try {
    // 如果标签已经有图标属性，直接返回
    if (tag.icon) return tag.icon
    
    // 如果没有路径，返回默认图标
    if (!tag || !tag.path) return 'Document'
    
    const pathParts = tag.path.split('/')
    // 确保路径至少有3部分 [空字符串, dashboard, 系统名称, ...]
    if (pathParts.length < 4) return 'Document'
    
    // 系统名称和页面路径
    const systemName = pathParts[2]
    const subMenuPath = pathParts[3]
    
    // 如果有菜单数据，优先使用原始菜单数据中的图标
    if (Object.keys(menuData.value).length > 0 && menuData.value._rawMenuData) {
      const rawMenus = menuData.value._rawMenuData || []
      
      // 查找一级菜单
      const mainMenu = rawMenus.find(menu => {
        const menuPath = menu.path && menu.path.trim() !== '' 
          ? menu.path.toLowerCase() 
          : menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
        
        return menuPath === systemName
      })
      
      if (mainMenu && mainMenu.menuChildList) {
        // 查找二级菜单
        const subMenu = mainMenu.menuChildList.find(menu => {
          // 处理菜单路径
          let menuPath = ''
          if (menu.path && menu.path.trim() !== '') {
            menuPath = menu.path.toLowerCase()
            if (menuPath.startsWith('/')) {
              menuPath = menuPath.substring(1)
            }
            if (menuPath.endsWith('.vue')) {
              menuPath = menuPath.substring(0, menuPath.length - 4)
            }
            if (menuPath.includes('/')) {
              const parts = menuPath.split('/')
              if (parts[parts.length - 1] === 'index') {
                menuPath = parts.slice(0, -1).join('/')
              }
            }
          } else {
            menuPath = menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
          }
          
          const isMatch = menuPath === subMenuPath || menu._processedPath === subMenuPath
          return isMatch
        })
        
        if (subMenu) {
          return subMenu.menuIcon || 'Document'
        } else {
          // 如果没有直接找到匹配的二级菜单，尝试更复杂的匹配
          const fullSubPath = pathParts.slice(3).join('/')
          
          for (const menu of mainMenu.menuChildList) {
            if (!menu.path) continue
            
            let menuPath = menu.path.toLowerCase()
            if (menuPath.startsWith('/')) {
              menuPath = menuPath.substring(1)
            }
            
            // 去掉.vue后缀
            if (menuPath.endsWith('.vue')) {
              menuPath = menuPath.substring(0, menuPath.length - 4)
            }
            
            // 检查路径是否匹配
            if (menuPath === fullSubPath || 
                menuPath === `${subMenuPath}/${pathParts[4] || ''}` || 
                menuPath.startsWith(`${subMenuPath}/`)) {
              return menu.menuIcon || 'Document'
            }
          }
          
          // 如果还找不到，尝试从DOM中直接获取
          const menuItem = document.querySelector(`.el-menu-item[index="${tag.path}"]`)
          if (menuItem) {
            const icon = menuItem.querySelector('.el-icon')
            if (icon) {
              const component = icon.querySelector('component')
              if (component && component.getAttribute('is')) {
                return component.getAttribute('is')
              }
            }
          }
        }
      }
    }
    
    // 如果找不到匹配的菜单，尝试从路由中获取
    const matchedRoute = router.getRoutes().find(route => route.path === tag.path)
    if (matchedRoute && matchedRoute.meta && matchedRoute.meta.icon) {
      return matchedRoute.meta.icon
    }
    
    return 'Document'
  } catch (error) {
    return 'Document'
  }
}

// 添加一个新变量来锁定面包屑，防止被其他逻辑修改
const breadcrumbLocked = ref(false)

// 修改监听菜单数据变化的watch
watch(() => menuData.value, (newMenuData) => {
  if (Object.keys(newMenuData).length > 0 && newMenuData._rawMenuData) {
    // 如果面包屑已锁定，不更新
    if (breadcrumbLocked.value) return
    
    // 强制更新面包屑导航
    nextTick(() => {
      updateBreadcrumb()
    })
  }
}, { deep: true, immediate: true })

// 修改路由监听函数，避免覆盖手动设置的面包屑
watch(() => route.path, (newPath, oldPath) => {
  const pathParts = newPath.split('/')
  const oldPathParts = oldPath?.split('/') || []
  
  // 只有当路由完全改变时（不是同一个路径的参数变化），才需要考虑更新面包屑
  if (pathParts.length >= 4 && 
      (pathParts[2] !== oldPathParts[2] || pathParts[3] !== oldPathParts[3])) {
    
    // 检查面包屑是否已锁定
    if (!breadcrumbLocked.value) {
      // 立即更新面包屑，避免延迟
      updateBreadcrumb()
    }
  }
}, { immediate: false })

// 监听路由变化，添加标签页
watch(() => route.path, (newPath, oldPath) => {
  // 如果路径没有改变或是简单路径，则不处理
  if (newPath === oldPath || newPath === '/dashboard' || newPath.split('/').length < 4) {
    return
  }
  
  // 解析路径
  const pathParts = newPath.split('/')
  const systemName = pathParts[2]
  const subMenuPath = pathParts[3]
  
  // 创建一个标签对象
  let tag = null
  
  // 首先尝试从菜单数据中获取标签信息
  if (menuData.value._rawMenuData) {
    const matchingTag = createTagFromMenuData(newPath, '')
    if (matchingTag) {
      tag = matchingTag
    }
  }
  
  // 如果未能从菜单数据中创建标签，则从路由信息中创建
  if (!tag) {
    // 找到匹配的路由
    const matchedRoute = router.resolve(newPath)
    if (matchedRoute) {
      // 从路由元数据中获取标题
      const title = matchedRoute.meta?.title || pathParts[pathParts.length - 1]
      
      tag = {
        path: newPath,
        title: title,
        icon: 'Document'
      }
    }
  }
  
  // 如果成功创建了标签，添加到访问历史
  if (tag) {
    addVisitedView(tag)
    
    // 更新面包屑
    if (tag.title) {
      forceUpdateBreadcrumb(tag.title)
    }
  }
}, { immediate: true })

// 判断标签是否激活
const isActive = (tag) => {
  return tag.path === route.path
}

// 修改通过路径设置文档标题的函数
const setDocumentTitleByPath = (path) => {
  // 始终设置固定标题
  document.title = 'SystemsAdmin管理系统'
  return true
}

// 修改全局路由前置守卫
onBeforeMount(() => {
  // 拦截路由导航
  router.beforeEach((to, from, next) => {
    // 始终设置固定标题
    document.title = 'SystemsAdmin管理系统'
    
    // 继续导航
    next()
  })
  
  // 保存原始 router.push 方法
  const originalPush = router.push
  
  // 重写 router.push 方法
  router.push = function(to) {
    // 始终设置固定标题
    document.title = 'SystemsAdmin管理系统'
    
    // 调用原始导航方法
    return originalPush.apply(this, arguments)
  }
})

// 新增：清空访问过的标签页
const clearVisitedViews = () => {
  visitedViews.value = []
  localStorage.removeItem('visitedViews')
}

// 修改 goToPage 函数
const goToPage = (view) => {
  // 如果是首页，清空标签页数据
  if (view.path === '/dashboard') {
    clearVisitedViews()
  }
  
  // 保持固定标题
  document.title = 'SystemsAdmin管理系统'
  
  // 保存当前选中的标签
  const currentActiveMenuIndex = document.querySelector('.el-menu-item.is-active')?.getAttribute('index') || ''
  
  // 检查是否是在同一个系统内导航（如果是，直接更改当前路由状态而不是使用router.push）
  if (route.path.startsWith('/dashboard/') && view.path.startsWith('/dashboard/')) {
    const routeParts = route.path.split('/');
    const viewParts = view.path.split('/');
    
    // 如果都是同一个系统的页面，使用路由替换模式而不是导航
    if (routeParts.length >= 3 && viewParts.length >= 3 && routeParts[2] === viewParts[2]) {
      console.log('同系统内标签导航，使用替换模式:', view.path);
      
      // 使用router.replace代替router.push以减少历史堆栈
      router.replace(view.path).then(() => {
        // 更新活动菜单项
        const menuItem = document.querySelector(`.el-menu-item[index="${view.path}"]`);
        if (menuItem) {
          // 找到所有菜单项并移除活动类
          document.querySelectorAll('.el-menu-item').forEach(item => {
            item.classList.remove('is-active');
          });
          
          // 为当前菜单项添加活动类
          menuItem.classList.add('is-active');
        }
        
        // 恢复菜单展开状态
        nextTick(() => restoreMenuOpenState());
      });
      return;
    }
  }
  
  // 如果是不同系统的导航，使用正常的router.push
  router.push(view.path).then(() => {
    // 恢复菜单展开状态，确保不会折叠已展开的菜单
    nextTick(() => {
      // 如果路由跳转改变了选中的菜单项，恢复原来的展开状态
      const newActiveMenuIndex = document.querySelector('.el-menu-item.is-active')?.getAttribute('index') || ''
      
      // 恢复菜单展开状态
      restoreMenuOpenState()
      
      // 如果切换到了不同的标签页但菜单选中项变化了，需要保持菜单展开状态
      if (currentActiveMenuIndex !== newActiveMenuIndex) {
        console.log('菜单项发生变化，从', currentActiveMenuIndex, '变为', newActiveMenuIndex)
      }
    })
  })
}

// 修改处理菜单点击函数 - 优化逻辑
const handleMenuSelect = async (index, indexPath) => {
  // 如果点击的是首页，清空标签页数据
  if (index === '/dashboard') {
    clearVisitedViews()
    router.push('/dashboard')
    return
  }

  // 获取路径信息
  const pathParts = index.split('/')
  // 确保路径至少包含：/dashboard/system-admin/system-mgmt
  if (pathParts.length < 4) {
    return
  }
  
  console.log('菜单点击路径:', index)
  
  // 尝试直接从DOM元素获取菜单名称
  let menuTitle = ''
  let menuItem = document.querySelector(`.el-menu-item[index="${index}"]`)
  
  if (menuItem) {
    menuTitle = menuItem.getAttribute('data-menu-name')
    console.log('从DOM获取菜单名称:', menuTitle)
  }
  
  // 使用辅助函数创建带有菜单名称的标签
  const tagData = createTagFromMenuData(index, menuTitle)
  console.log('创建的标签数据:', tagData)
  
  if (tagData) {
    // 检查是否能正确找到菜单标题，如果没找到则不添加标签
    if (!tagData.title || tagData.title === '') {
      console.log('未找到菜单标题，不添加到标签列表:', index)
      router.push(index).then(() => {
        nextTick(() => restoreMenuOpenState())
      })
      return
    }
    
    // 添加标签
    addVisitedView(tagData)
    
    // 更新面包屑文本
    forceUpdateBreadcrumb(tagData.title)
  }
  
  // 查找现有标签
  const existingTag = visitedViews.value.find(t => t.path === index)
  if (existingTag) {
    // 使用goToPage方法导航到标签，这样避免重新加载
    goToPage(existingTag)
  } else {
    // 如果标签不存在，才使用路由跳转
    router.push(index).then(() => {
      // 确保菜单保持展开状态
      nextTick(() => {
        restoreMenuOpenState()
      })
    })
  }
}

// 辅助函数：在菜单中查找子菜单
const findSubMenuByPath = (menu, targetPath) => {
  if (!menu || !menu.menuChildList) return null
  
  // 记录查找过程信息
  console.log('查找子菜单:', targetPath, '在父级菜单:', menu.menuName || menu.menuCode)
  
  // 尝试查找匹配的子菜单
  const foundMenu = menu.menuChildList.find(child => {
    if (!child.path) return false
    
    // 处理子菜单路径
    let childPath = child.path.toLowerCase()
    
    // 如果path以/开头，去掉开头的/
    if (childPath.startsWith('/')) {
      childPath = childPath.substring(1)
    }
    
    // 如果包含完整路径 (如system-admin/system-mgmt/domain.vue)
    if (childPath.includes('/')) {
      const parts = childPath.split('/')
      // 如果长度大于2，可能是system-admin/system-mgmt/domain.vue格式
      if (parts.length > 2) {
        // 使用子系统+页面部分进行匹配
        const subSystemPlusPage = parts.slice(1).join('/')
        // 去掉.vue后缀
        return subSystemPlusPage.replace('.vue', '') === targetPath
      }
      
      // 如果是二级路径如system-mgmt/domain.vue
      const lastPart = parts[parts.length - 1]
      if (lastPart.endsWith('.vue')) {
        return lastPart.replace('.vue', '') === targetPath
      }
    }
    
    // 处理简单的文件名如domain.vue
    if (childPath.endsWith('.vue')) {
      return childPath.replace('.vue', '') === targetPath
    }
    
    const isMatch = childPath === targetPath
    if (isMatch) {
      console.log('找到匹配的子菜单:', child.menuName || child.menuCode)
    }
    return isMatch
  })
  
  if (!foundMenu) {
    console.log('未找到匹配的子菜单:', targetPath)
  }
  
  return foundMenu
}

// 关闭标签
const closeTag = (view) => {
  const index = visitedViews.value.findIndex(v => v.path === view.path)
  if (index !== -1) {
    visitedViews.value.splice(index, 1)
    // 保存更新后的标签页
    saveVisitedViews()
  } else {
  }
  
  // 如果关闭的是当前激活的标签
  if (isActive(view)) {
    // 如果还有其他标签，则跳转到最后一个标签
    if (visitedViews.value.length) {
      const latestView = visitedViews.value[visitedViews.value.length - 1]
      router.push(latestView.path)
    } else {
      // 如果没有其他标签了，则返回首页
      router.push(currentBasePath.value)
    }
  }
}

// 修改监听当前系统名称的watch
watch(() => currentSystem.value, (system) => {
  // 不再更新标题，因为已经在main.js中统一设置
}, { immediate: true })

// 新增：处理菜单收起时的样式
const handleCollapsedMenuStyle = () => {
  // 创建样式元素如果不存在
  let styleElement = document.getElementById('collapse-menu-style')
  if (!styleElement) {
    styleElement = document.createElement('style')
    styleElement.id = 'collapse-menu-style'
    document.head.appendChild(styleElement)
  }
  
  // 设置样式内容 - 使用更精确的选择器
  styleElement.textContent = {}
}

// 新增：处理面包屑首页点击
const handleHomeClick = () => {
  clearVisitedViews()
  router.push('/dashboard')
}

// 标签右键菜单相关变量
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref(null)
const isFirstVisibleTag = computed(() => {
  if (!selectedTag.value || visitedViews.value.length === 0) return true
  return visitedViews.value[0].path === selectedTag.value.path
})
const isLastVisibleTag = computed(() => {
  if (!selectedTag.value || visitedViews.value.length === 0) return true
  return visitedViews.value[visitedViews.value.length - 1].path === selectedTag.value.path
})

// 打开标签右键菜单
const openTagMenu = (e, tag) => {
  // 阻止事件冒泡，防止立即被document的点击事件关闭菜单
  e.stopPropagation()
  
  // 计算菜单显示位置
  const menuMinWidth = 105
  const offsetLeft = e.clientX
  const offsetWidth = document.documentElement.clientWidth
  const maxLeft = offsetWidth - menuMinWidth
  left.value = offsetLeft > maxLeft ? maxLeft : offsetLeft

  // 设置菜单顶部位置，加上一点偏移量
  top.value = e.clientY + 2
  
  // 更新选中的标签
  selectedTag.value = tag
  
  // 显示菜单
  visible.value = true
  
  // 调试日志
  console.log('打开标签右键菜单', {
    tag,
    position: { left: left.value, top: top.value },
    visible: visible.value
  })
  
  // 添加点击事件监听，以便在点击其他位置时自动关闭菜单
  document.addEventListener('click', handleDocumentClick)
}

// 全局点击事件处理函数 - 关闭右键菜单
const handleDocumentClick = () => {
  if (visible.value) {
    console.log('关闭标签右键菜单')
    visible.value = false
  }
}

// 关闭所有标签
const closeAllTags = () => {
  console.log('关闭所有标签')
  
  // 获取当前模块的路径
  const currentPath = route.path
  const pathParts = currentPath.split('/')
  
  // 如果路径至少包含到系统级别（如/dashboard/system-admin）
  let targetPath = '/dashboard'
  if (pathParts.length >= 3) {
    // 构建模块首页路径（系统级别路径）
    targetPath = `/${pathParts[1]}/${pathParts[2]}`
    console.log('返回到模块首页:', targetPath)
  }
  
  // 清空标签并保存
  visitedViews.value = []
  saveVisitedViews()
  
  // 跳转到模块首页
  router.push(targetPath)
  visible.value = false
}

// 关闭其他标签
const closeOtherTags = () => {
  if (!selectedTag.value) return
  console.log('关闭其他标签', selectedTag.value)
  visitedViews.value = visitedViews.value.filter(tag => tag.path === selectedTag.value.path)
  saveVisitedViews()
  router.push(selectedTag.value.path)
  visible.value = false
}

// 关闭左侧标签
const closeLeftTags = () => {
  if (!selectedTag.value) return
  if (isFirstVisibleTag.value) return
  
  console.log('关闭左侧标签', selectedTag.value)
  const selectedIndex = visitedViews.value.findIndex(tag => tag.path === selectedTag.value.path)
  if (selectedIndex > 0) {
    visitedViews.value = visitedViews.value.slice(selectedIndex)
    saveVisitedViews()
  }
  visible.value = false
}

// 关闭右侧标签
const closeRightTags = () => {
  if (!selectedTag.value) return
  if (isLastVisibleTag.value) return
  
  console.log('关闭右侧标签', selectedTag.value)
  const selectedIndex = visitedViews.value.findIndex(tag => tag.path === selectedTag.value.path)
  if (selectedIndex < visitedViews.value.length - 1) {
    visitedViews.value = visitedViews.value.slice(0, selectedIndex + 1)
    saveVisitedViews()
  }
  visible.value = false
}

// 刷新页面
const refreshSelectedTag = () => {
  if (!selectedTag.value) return
  
  console.log('刷新页面:', selectedTag.value)
  
  // 关闭菜单
  visible.value = false
  
  // 刷新当前路由页面的方法
  const { fullPath } = router.resolve(selectedTag.value.path)
  
  // 方法1：使用router.replace强制刷新
  router.replace({
    path: '/redirect' + fullPath
  }).catch(err => {
    // 如果路由不存在，尝试方法2
    console.log('重定向方法失败，尝试替代方法:', err)
    
    // 方法2：先跳转到一个临时页面，然后再返回
    const currentPath = selectedTag.value.path
    router.replace('/dashboard').then(() => {
      nextTick(() => {
        router.replace(currentPath)
      })
    })
  })
}

// 添加一个变量追踪菜单展开状态
const openedMenus = ref([])

// 菜单展开状态变化事件处理
const handleSubMenuOpen = (index) => {
  if (!openedMenus.value.includes(index)) {
    openedMenus.value.push(index)
  }
  console.log('打开的子菜单:', openedMenus.value)
}

// 菜单关闭状态变化事件处理
const handleSubMenuClose = (index) => {
  const i = openedMenus.value.indexOf(index)
  if (i !== -1) {
    openedMenus.value.splice(i, 1)
  }
  console.log('关闭后的子菜单:', openedMenus.value)
}

// 恢复菜单展开状态
const restoreMenuOpenState = () => {
  nextTick(() => {
    // 对于每个需要保持展开的菜单，找到对应的DOM元素并模拟点击
    openedMenus.value.forEach(index => {
      const subMenu = document.querySelector(`.el-sub-menu[index="${index}"]`)
      if (subMenu && !subMenu.classList.contains('is-opened')) {
        // 查找菜单标题元素并模拟点击
        const titleEl = subMenu.querySelector('.el-sub-menu__title')
        if (titleEl) {
          titleEl.click()
        }
      }
    })
  })
}

// 监听菜单折叠状态变化
watch(() => isCollapse.value, (isCollapsed) => {
  // 延迟执行，确保DOM已更新
  setTimeout(() => {
    handleCollapsedMenuStyle()
  }, 50)
}, { immediate: true })
</script>

<style scoped>
/* 全局字体设置 */
:deep(*) {
  font-family: "Microsoft YaHei", "微软雅黑", "PingFang SC", "Hiragino Sans GB", "SimHei", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
}

/* 菜单文字不可选中 */
:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* 标签栏文字不可选中 */
.tags-view-item {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.app-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.sidebar-container {
  width: 220px;
  height: 100%;
  background-color: #ffffff;
  transition: width 0.28s;
  overflow: hidden;
  box-shadow: 1px 0 6px rgba(0, 0, 0, 0.05);
  border-right: none;
  position: relative;
  z-index: 10;
}

.sidebar-container.is-collapse {
  width: 64px;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 17px;
  background-color: #ffffff;
}

.logo-image {
  height: 32px;
  width: 32px;
  margin-right: 10px;
  object-fit: contain;
}

.logo-title {
  color: #303133;
  font-size: 16px;
  margin: 0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-menu {
  border-right: none;
  height: calc(100% - 60px);
  width: 100%;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: none;
}

.navbar {
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  border-bottom: none;
  margin-bottom: 0;
  background-color: #fff;
  position: relative;
}

.left-menu {
  display: flex;
  align-items: center;
}

.hamburger-container {
  cursor: pointer;
  margin-right: 15px;
}

.right-menu {
  display: flex;
  align-items: center;
}

.home-link {
  margin-right: 20px;
  color: #303133;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.home-link:hover {
  background-color: #f5f7fa;
  color: #409EFF;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-name {
  margin: 0 5px;
  font-size: 14px;
  font-weight: 500;
}

/* 标签样式 */
.tags-view-item {
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  height: 30px;
  line-height: 24px;
  border: 1.5px solid #dcdfe6;
  color: #606266;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  margin-top: 0;
  border-radius: 3px;
  transition: color .3s, background-color .3s, border-color .3s;
  box-sizing: border-box;
}

.tags-view-item:first-of-type {
  margin-left: 0;
}

.tags-view-item .tag-icon {
  margin-right: 4px;
  color: #606266;
  transition: color .3s;
}

.tags-view-item.active {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #409eff;
  border-width: 1.5px;
}

.tags-view-item.active .tag-icon {
  color: #409eff;
}

.tags-view-item:hover {
  color: #409eff;
  border-color: #409eff;
  background-color: #ecf5ff;
}

.tags-view-item:hover .tag-icon {
  color: #409eff;
}

.tags-view-item .close-icon {
  width: 14px;
  height: 14px;
  line-height: 14px;
  border-radius: 50%;
  text-align: center;
  transition: all .3s;
  transform-origin: 100% 50%;
  margin-left: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #606266;
}

.tags-view-item .close-icon:hover {
  background-color: #409eff;
  color: #fff;
}

.tags-view-item.active .close-icon {
  color: #409eff;
}

.tags-view-item.active .close-icon:hover {
  background-color: #409eff;
  color: #fff;
}

.tags-view-container {
  height: 30px;
  width: 100%;
  background: transparent;
  border-radius: 0;
  border: none;
  border-top: none;
  box-shadow: none;
  overflow-x: hidden;
  white-space: nowrap;
  margin: 0 18px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  will-change: contents;
}

.tags-view-wrapper {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0;
  margin-left: 0;
  flex-wrap: nowrap;
  overflow: hidden;
  will-change: contents;
}

.app-main {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden; /* 防止水平滚动条 */
  background-color: #f8f9fb; /* 原来是#f0f2f5，调整为更白的颜色 */
  margin-top: 0;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 100px); /* 减小高度，原来是110px */
  position: relative; /* 确保定位上下文 */
}

/* 增强菜单层次感的样式 */
:deep(.el-sub-menu) {
  background-color: #ffffff;
}

:deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  padding: 0 10px !important;  /* 原来是 20px, 减小左右内边距 */
  margin: 4px 8px;  /* 原来是 margin: 4px 10px, 减小左右外边距 */
  border-radius: 4px;
  transition: all 0.15s ease;
}

:deep(.el-menu-item:hover) {
  background-color: #f5f7fa !important;  /* 灰色背景 */
  color: #303133 !important;  /* 保持默认文字颜色 */
}

:deep(.el-menu-item:hover .menu-title),
:deep(.el-menu-item:hover .el-icon) {
  color: #303133 !important;  /* 保持默认文字和图标颜色 */
}

:deep(.el-menu-item.is-active) {
  background-color: #edf5ff !important;  /* 浅蓝色背景 */
  color: #639af8 !important;  /* 蓝色文字 */
}

:deep(.el-menu-item.is-active .menu-title),
:deep(.el-menu-item.is-active .el-icon) {
  color: #639af8 !important;  /* 蓝色图标和文字 */
}

:deep(.el-sub-menu__title) {
  height: 40px;
  line-height: 40px;
  padding: 0 16px !important;  /* 原来是 20px, 减小左右内边距 */
  margin: 4px 5px;  /* 原来是 margin: 4px 8px, 减小左右外边距 */
  border-radius: 4px;
  transition: all 0.15s ease;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fa !important;  /* 灰色背景 */
  color: #303133 !important;  /* 保持默认文字颜色 */
}

:deep(.el-sub-menu__title:hover .menu-title),
:deep(.el-sub-menu__title:hover .el-icon) {
  color: #303133 !important;  /* 保持默认文字和图标颜色 */
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: #303133 !important;  /* 使用默认文字颜色，与未激活状态一致 */
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title .el-icon),
:deep(.el-sub-menu.is-active > .el-sub-menu__title .menu-title) {
  color: #303133 !important;  /* 使用默认文字颜色，与未激活状态一致 */
}

:deep(.el-menu--inline) {
  background-color: #ffffff;
  padding: 4px 0;  /* 修改：添加上下内边距，与子菜单项边距一致 */
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;  /* 移除，使用上面的padding设置 */
  padding-bottom: 0;  /* 移除，使用上面的padding设置 */
}

:deep(.el-menu--inline .el-menu-item) {
  padding-left: 26px !important;  /* 原来是 30px, 减小左边距 */
  background-color: #ffffff;
  height: 40px;
  line-height: 40px;
  margin: 4px 8px;  /* 原来是 margin: 4px 10px, 与一级菜单保持一致 */
  border-radius: 4px;
  transition: all 0.15s ease;
}

:deep(.el-menu--inline .el-menu-item:first-child) {
  margin-top: 0;  /* 修改：移除第一个子菜单的上边距，因为容器已有内边距 */
}

:deep(.el-menu--inline .el-menu-item:last-child) {
  margin-bottom: 0;  /* 修改：移除最后一个子菜单的下边距，因为容器已有内边距 */
}

:deep(.el-menu--inline .el-menu-item:hover) {
  background-color: #f5f7fa !important;  /* 改为灰色背景 */
  color: #303133 !important;  /* 使用默认文字颜色 */
}

:deep(.el-menu--inline .el-menu-item:hover .menu-title),
:deep(.el-menu--inline .el-menu-item:hover .el-icon) {
  color: #303133 !important;  /* 使用默认图标和文字颜色 */
}

:deep(.el-menu--inline .el-menu-item.is-active) {
  background-color: #edf5ff !important;  /* 改为浅蓝色背景 */
  color: #639af8 !important;  /* 改为蓝色文字 */
}

:deep(.el-menu-item.is-active:hover) {
  background-color: #edf5ff !important;  /* 保持激活状态的背景色不变 */
  color: #639af8 !important;  /* 保持激活状态的文字颜色不变 */
}

:deep(.el-menu-item.is-active:hover .menu-title),
:deep(.el-menu-item.is-active:hover .el-icon) {
  color: #639af8 !important;  /* 保持激活状态的图标和文字颜色不变 */
}

:deep(.el-menu--inline .el-menu-item.is-active:hover) {
  background-color: #edf5ff !important;  /* 保持激活状态的背景色不变 */
  color: #639af8 !important;  /* 保持激活状态的文字颜色不变 */
}

:deep(.el-menu--inline .el-menu-item.is-active:hover .menu-title),
:deep(.el-menu--inline .el-menu-item.is-active:hover .el-icon) {
  color: #639af8 !important;  /* 保持激活状态的图标和文字颜色不变 */
}

/* 调整子菜单文字位置 */
:deep(.el-menu--inline .el-menu-item span) {
  margin-left: 10px;
}

/* 三级菜单样式 */
:deep(.el-menu--inline .el-menu--inline .el-menu-item) {
  padding-left: 40px !important;  /* 原来是 45px, 减少左内边距 */
  height: 40px;
  line-height: 40px;
  margin: 4px 8px;  /* 原来是 margin: 4px 10px, 与一级和二级菜单保持一致 */
}

/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  will-change: transform;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 折叠状态下弹出的菜单样式 */
:deep(.el-menu--popup) {
  padding: 5px 0 !important;
  border-radius: 8px !important;
  min-width: 160px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}

:deep(.el-menu--popup .el-menu-item) {
  height: 36px !important;
  line-height: 36px !important;
  margin: 2px 5px !important;
  padding: 0 12px !important;
  font-size: 13px !important;
  border-radius: 4px !important;
}

:deep(.el-menu--popup .el-menu-item:hover) {
  background-color: #f5f7fa !important;
  color: #303133 !important;
}

:deep(.el-menu--popup .el-menu-item.is-active) {
  background-color: #edf5ff !important;
  color: #639af8 !important;
}

:deep(.el-menu--popup .el-sub-menu__title) {
  height: 36px !important;
  line-height: 36px !important;
  margin: 2px 5px !important;
  padding: 0 12px !important;
}

:deep(.el-menu--popup .el-sub-menu__title:hover) {
  background-color: #f5f7fa !important;
}

/* 修复弹出菜单中的图标与文字对齐问题 */
:deep(.el-menu--popup .el-menu-item .el-icon),
:deep(.el-menu--popup .el-sub-menu__title .el-icon) {
  margin-right: 5px;
  width: 16px;
  text-align: center;
}

.menu-title {
  margin-left: 5px;
}

/* 防止滚动条闪烁 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* 优化路由切换时的过渡效果 */
.router-view-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.menu-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

.loading-icon {
  margin-right: 10px;
}

/* 优化二级或更深层级的弹出菜单定位 */
:deep(.el-menu--popup-container) {
  padding: 0 !important;
}

:deep(.el-menu--popup.el-menu--popup-right-start) {
  margin-left: 5px !important;
}

/* 设置最大高度，避免菜单过长 */
:deep(.el-menu--popup) {
  max-height: calc(100vh - 120px) !important;
  overflow-y: auto !important;
  scrollbar-width: thin !important;
}

/* 隐藏弹出菜单的滚动条但保留功能 */
:deep(.el-menu--popup::-webkit-scrollbar) {
  width: 6px !important;
}

:deep(.el-menu--popup::-webkit-scrollbar-thumb) {
  background: rgba(144, 147, 153, 0.3) !important;
  border-radius: 3px !important;
}

:deep(.el-menu--popup::-webkit-scrollbar-track) {
  background: transparent !important;
}

/* 优化弹出菜单最大高度和滚动条样式 */
body .el-popper.is-pure .el-menu .el-menu,
body .el-popper.is-pure .el-menu--popup {
  max-height: calc(100vh - 120px) !important;
  overflow-y: auto !important;
}

body .el-popper.is-pure .el-menu::-webkit-scrollbar,
body .el-popper.is-pure .el-menu--popup::-webkit-scrollbar {
  width: 6px !important;
}

body .el-popper.is-pure .el-menu::-webkit-scrollbar-thumb,
body .el-popper.is-pure .el-menu--popup::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3) !important;
  border-radius: 3px !important;
}

body .el-popper.is-pure .el-menu::-webkit-scrollbar-track,
body .el-popper.is-pure .el-menu--popup::-webkit-scrollbar-track {
  background: transparent !important;
}

/* 使用更具体的选择器来覆盖Element Plus的样式 */
.el-menu--collapse + .el-menu--popup,
.el-menu--collapse ~ .el-popper .el-menu--popup,
.is-collapse ~ .el-menu--popup,
.is-collapse ~ .el-popper .el-menu--popup {
  padding: 5px 0 !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
}

.el-menu--collapse + .el-menu--popup .el-menu-item,
.el-menu--collapse ~ .el-popper .el-menu--popup .el-menu-item,
.is-collapse ~ .el-menu--popup .el-menu-item,
.is-collapse ~ .el-popper .el-menu--popup .el-menu-item {
  height: 36px !important;
  line-height: 36px !important;
  margin: 2px 5px !important;
  padding: 0 12px !important;
  font-size: 13px !important;
  border-radius: 4px !important;
  transition: all 0.15s ease !important;
}

/* 优化弹出菜单过渡动画 */
.el-menu--popup {
  transition: transform 0.2s, opacity 0.2s !important;
}

/* 针对折叠侧边栏时的弹出菜单容器样式 */
div:has(.is-collapse) + div .el-popper.is-pure,
.is-collapse ~ .el-popper.is-pure {
  border-radius: 8px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
  transform-origin: center left !important;
  animation: popperFadeIn 0.2s ease-out !important;
}

@keyframes popperFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

<style>
/* 全局样式 - 确保覆盖Element Plus的默认样式 */
body .el-menu--collapse {
  width: 64px;
}

body .el-menu--horizontal>.el-sub-menu .el-sub-menu__icon-arrow,
body .el-menu--horizontal>.el-menu-item .el-submenu__icon-arrow {
  display: none;
}

/* 折叠状态下的弹出菜单样式 */
body .el-popper.is-pure.el-menu--vertical,
body .el-popper.is-pure.el-menu--horizontal {
  border-radius: 8px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
  padding: 5px 0 !important;
}

body .el-popper.is-pure .el-menu--popup {
  padding: 5px 0 !important;
  border-radius: 8px !important;
  min-width: 160px !important;
  max-height: calc(100vh - 120px) !important;
  overflow-y: auto !important;
}

body .el-popper.is-pure .el-menu--popup .el-menu-item {
  height: 36px !important;
  line-height: 36px !important;
  margin: 2px 5px !important;
  padding: 0 12px !important;
  font-size: 13px !important;
  border-radius: 4px !important;
}

body .el-popper.is-pure .el-menu--popup .el-menu-item:hover {
  background-color: #f5f7fa !important;
  color: #303133 !important;
}

body .el-popper.is-pure .el-menu--popup .el-menu-item.is-active {
  background-color: #edf5ff !important;
  color: #639af8 !important;
}

body .el-popper.is-pure .el-menu--popup .el-sub-menu__title {
  height: 36px !important;
  line-height: 36px !important;
  margin: 2px 5px !important;
  padding: 0 12px !important;
}

body .el-popper.is-pure .el-menu--popup .el-sub-menu__title:hover {
  background-color: #f5f7fa !important;
}

/* 优化弹出菜单最大高度和滚动条样式 */
body .el-popper.is-pure .el-menu .el-menu,
body .el-popper.is-pure .el-menu--popup {
  max-height: calc(100vh - 120px) !important;
  overflow-y: auto !important;
}

body .el-popper.is-pure .el-menu::-webkit-scrollbar,
body .el-popper.is-pure .el-menu--popup::-webkit-scrollbar {
  width: 6px !important;
}

body .el-popper.is-pure .el-menu::-webkit-scrollbar-thumb,
body .el-popper.is-pure .el-menu--popup::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3) !important;
  border-radius: 3px !important;
}

body .el-popper.is-pure .el-menu::-webkit-scrollbar-track,
body .el-popper.is-pure .el-menu--popup::-webkit-scrollbar-track {
  background: transparent !important;
}

/* 修复标签点击时的晃动问题 */
.tags-view-item {
  box-sizing: border-box !important;
  border-width: 1.5px !important;
  transition: color .3s, background-color .3s, border-color .3s !important;
}

.tags-view-item.active {
  border-width: 1.5px !important;
}
</style>

<style>
/* 标签右键菜单样式 */
.contextmenu {
  margin: 0;
  padding: 5px 0;
  background: #fff;
  position: fixed; /* 使用fixed而不是absolute，避免滚动时位置变化 */
  z-index: 3000; /* 提高z-index，确保在其他元素之上 */
  list-style-type: none;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 12px;
  font-weight: 400;
  color: #333;
  min-width: 120px; /* 设置最小宽度 */
  border: 1px solid #ebeef5;
}

.contextmenu li {
  margin: 0;
  padding: 8px 16px;
  cursor: pointer;
  line-height: 1.5;
  transition: all 0.2s;
}

.contextmenu li:hover {
  background: #ecf5ff;
  color: #409eff;
}

.contextmenu li.disabled {
  color: #bbb;
  cursor: not-allowed;
}

.contextmenu li.disabled:hover {
  background: transparent;
  color: #bbb;
}

/* 菜单项分割线 */
.contextmenu li.divided {
  border-top: 1px solid #ebeef5;
  margin-top: 5px;
  padding-top: 5px;
}
</style> 