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
        :unique-opened="true"
        router
        @select="(index, indexPath) => handleMenuSelect(index, indexPath)"
      >
        <template v-for="route in routes" :key="route.path">
          <!-- 一级菜单 - 没有子菜单或子菜单为空 -->
          <el-menu-item 
            v-if="!route.children || route.children.length === 0" 
            :index="currentBasePath + (route.path ? '/' + route.path : '')"
          >
            <el-icon v-if="route.meta && route.meta.icon">
              <component v-if="route.meta && route.meta.icon" :is="route.meta.icon" />
            </el-icon>
            <template #title>
              <span class="menu-title">{{ route.meta ? route.meta.title : route.name }}</span>
            </template>
          </el-menu-item>
          
          <!-- 一级菜单 - 有子菜单 -->
          <el-sub-menu v-else :index="currentBasePath + '/' + route.path">
            <template #title>
              <el-icon v-if="route.meta && route.meta.icon">
                <component v-if="route.meta && route.meta.icon" :is="route.meta.icon" />
              </el-icon>
              <span class="menu-title">{{ route.meta ? route.meta.title : route.name }}</span>
            </template>
            
            <!-- 二级菜单 -->
            <template v-for="child in route.children" :key="child.path">
              <!-- 二级菜单 - 没有子菜单 -->
              <el-menu-item 
                v-if="!child.children || child.children.length === 0" 
                :index="getMenuItemPath(route, child)"
              >
                <el-icon v-if="child.meta && child.meta.icon">
                  <component v-if="child.meta && child.meta.icon" :is="child.meta.icon" />
                </el-icon>
                <template #title>
                  <span class="menu-title">{{ child.meta ? child.meta.title : child.name }}</span>
                </template>
              </el-menu-item>
              
              <!-- 二级菜单 - 有子菜单（三级菜单） -->
              <el-sub-menu v-else :index="currentBasePath + '/' + route.path + '/' + child.path">
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
               @click="goToPage(tag)">
            <el-icon v-if="getTagIcon(tag)" size="14" class="tag-icon">
              <component v-if="getTagIcon(tag)" :is="getTagIcon(tag)" />
            </el-icon>
            <span>{{ tag.title }}</span>
            <el-icon class="close-icon" @click.stop="closeTag(tag)"><Close /></el-icon>
          </div>
        </div>
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
import { post } from '@/utils/request'
import SidebarItem from './components/SidebarItem.vue'
import { ArrowDown, Close, Fold, Expand, Search, Bell, Loading } from '@element-plus/icons-vue'
import { MENU_API, IS_DEV, BASE_API_URL } from '@/config/api/login/api'
import { transformMenuToRoutes, getSystemMenu } from '@/utils/menuHelper'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)
const visitedViews = ref([])

// 菜单数据
const menuData = ref({})
const menuLoading = ref(false)

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

// 优化强制更新函数
const forceUpdateBreadcrumb = (title, lock = true) => {
  if (!title) return
  
  // 锁定逻辑
  if (lock) {
    breadcrumbLocked.value = true
    
    // 30秒后自动解锁
    setTimeout(() => {
      breadcrumbLocked.value = false
    }, 30000)
  }
  
  // 立即更新面包屑
  customPageTitle.value = title
  
  // 使用 nextTick 确保 DOM 更新
  nextTick(() => {
    const breadcrumbItems = document.querySelectorAll('.el-breadcrumb__item')
    if (breadcrumbItems.length >= 3) {
      const titleSpan = breadcrumbItems[2].querySelector('.el-breadcrumb__inner')
      if (titleSpan && titleSpan.textContent !== title) {
        titleSpan.textContent = title
      }
    }
  })
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
  
  // 如果没有找到菜单数据，尝试使用menuCode转换后的路径查找
  if (menuRoutes.length === 0 && menuData.value._rawMenuData) {
    const rawMenus = menuData.value._rawMenuData || []
    
    // 查找匹配的菜单
    const matchedMenu = rawMenus.find(menu => {
      const menuPath = menu.path && menu.path.trim() !== '' 
        ? menu.path.toLowerCase() 
        : menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
      
      return menuPath === systemName
    })
    
    if (matchedMenu) {
      
      // 创建一个主路由，包含子菜单
      const mainRoute = {
        path: systemName,
        name: matchedMenu.menuCode,
        meta: {
          title: matchedMenu.menuName,
          icon: matchedMenu.menuIcon || 'Document'
        },
        children: transformMenuToRoutes(matchedMenu.menuChildList || [], systemName)
      }
      
      return [mainRoute]
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
  localStorage.removeItem('token')
  router.push('/login')
}

// 获取菜单数据
const fetchMenuData = async () => {
  try {
    menuLoading.value = true
    
    // 使用字符串形式的数字字面量，避免JavaScript处理大整数时的精度问题
    const currentDomainId = '1350161679034934501'
    
    // 直接使用字符串形式的domainId
    const params = { domainId: currentDomainId }
    
    const res = await post(MENU_API.GET_MENU, params)
    
    
    if (res.code === '200') {
      if (!res.data || !Array.isArray(res.data)) {
        ElMessage.warning('未获取到菜单数据，请联系管理员')
        return
      }
      
      if (res.data.length === 0) {
        return
      }
      
      // 处理菜单数据
      const allMenus = res.data
      
      // 初始化菜单数据对象
      const menuDataObj = {
        // 保存原始菜单数据，以便后续使用
        _rawMenuData: allMenus
      }
      
      // 遍历所有系统模块（一级菜单）
      allMenus.forEach(menu => {
        
        if (!menu.menuCode) {
          return
        }
        
        // 使用path字段作为路由路径，如果没有则使用menuCode转换
        let systemPath = ''
        if (menu.path && menu.path.trim() !== '') {
          systemPath = menu.path.toLowerCase()
          
          // 如果path以/开头，去掉第一个/
          if (systemPath.startsWith('/')) {
            systemPath = systemPath.substring(1)
          }
          
          // 如果path包含文件名(如index.vue)，则去掉.vue后缀
          if (systemPath.endsWith('.vue')) {
            systemPath = systemPath.substring(0, systemPath.length - 4)
          }
          
          // 如果path包含目录和文件名，只保留目录部分
          if (systemPath.includes('/')) {
            const pathParts = systemPath.split('/')
            if (pathParts[pathParts.length - 1] === 'index') {
              systemPath = pathParts.slice(0, -1).join('/')
            }
          }
        } else {
          systemPath = menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
        }
        
        // 检查子菜单
        if (!menu.menuChildList || !Array.isArray(menu.menuChildList)) {
          menu.menuChildList = []
        }
        
        // 不直接转换子菜单为路由，而是将一级菜单作为路由，子菜单作为其children
        const mainRoute = {
          path: systemPath,
          name: menu.menuCode,
          meta: {
            title: menu.menuName,
            icon: menu.menuIcon || 'Document'
          },
          children: []
        }
        
        // 处理二级菜单
        if (menu.menuChildList && menu.menuChildList.length > 0) {
          
          // 预处理子菜单的path字段
          menu.menuChildList.forEach(childMenu => {
            
            // 如果子菜单的path包含文件路径，需要特殊处理
            if (childMenu.path && childMenu.path.includes('/')) {
              const pathParts = childMenu.path.split('/')
              if (pathParts[pathParts.length - 1] === 'index.vue' || 
                  pathParts[pathParts.length - 1] === 'index') {
                // 如果是index.vue，使用目录名作为路径
                childMenu._processedPath = pathParts.slice(0, -1).join('/')
              }
            }
          })
          
          // 转换子菜单为路由格式
          mainRoute.children = transformMenuToRoutes(menu.menuChildList, '')
        }
        
        // 存储到menuData中 - 只存储一个包含children的主路由
        menuDataObj[systemPath] = [mainRoute]
      })
      
      menuData.value = menuDataObj
    } else {
    }
  } catch (error) {
  } finally {
    menuLoading.value = false
  }
}

// 组件挂载时获取菜单数据
onMounted(() => {
  fetchMenuData()
  
  // 从本地存储恢复标签页状态
  restoreVisitedViews()
  
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
  
  // 添加DOM事件监听，在路由跳转前先设置标题
  setTimeout(() => {
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
    
    // 同样为子菜单标题添加点击事件，虽然子菜单标题本身没有跳转，但保险起见
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
  }, 500) // 延迟一点执行，确保DOM已经渲染完成
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
    } else {
    }
  } catch (error) {
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

// 监听路由变化，添加标签页
watch(() => route.path, (newPath) => {
  if (document.referrer === '' && newPath !== '/dashboard' && newPath.split('/').length >= 4) {
    const pathParts = newPath.split('/')
    const systemName = pathParts[2]
    const subMenuPath = pathParts[3]
    
    if (menuData.value._rawMenuData) {
      const rawMenus = menuData.value._rawMenuData
      
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
          
          return menuPath === subMenuPath || menu._processedPath === subMenuPath
        })
        
        if (subMenu) {
          // 这里可以添加刷新页面时的特殊处理逻辑
        }
      }
    }
  }
}, { immediate: false }) // 不立即触发

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

// 添加一个新变量来锁定面包屑，防止被其他逻辑修改
const breadcrumbLocked = ref(false)

// 监听菜单折叠状态变化
watch(() => isCollapse.value, (isCollapsed) => {
  // 延迟执行，确保DOM已更新
  setTimeout(() => {
    handleCollapsedMenuStyle()
  }, 50)
}, { immediate: true })

// 判断标签是否激活
const isActive = (tag) => {
  return tag.path === route.path
}

// 修改通过路径设置文档标题的函数
const setDocumentTitleByPath = (path) => {
  // 不再设置标题，因为已经在main.js中统一设置
  return true
}

// 修改全局路由前置守卫
onBeforeMount(() => {
  // 拦截路由导航
  router.beforeEach((to, from, next) => {
    // 不再在这里设置标题，因为已经在main.js中统一设置
    
    // 继续导航
    next()
  })
  
  // 保存原始 router.push 方法
  const originalPush = router.push
  
  // 重写 router.push 方法
  router.push = function(to) {
    // 不再在这里设置标题，因为已经在main.js中统一设置
    
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
  
  // 然后再跳转页面
  router.push(view.path)
}

// 修改处理菜单点击函数 - 优化逻辑
const handleMenuSelect = async (index, indexPath) => {
  // 如果点击的是首页，清空标签页数据
  if (index === '/dashboard') {
    clearVisitedViews()
    router.push('/dashboard')
    return
  }

  // 获取当前菜单项的标题和图标
  const pathParts = index.split('/')
  if (pathParts.length < 4) {
    return
  }
  
  const systemName = pathParts[2]
  const subMenuPath = pathParts[3]
  
  // 从菜单数据中获取标题
  let menuTitle = ''
  let menuIcon = 'Document'
  
  // 查找一级菜单
  const mainMenu = findMainMenu(systemName)
  if (mainMenu) {
    // 查找二级菜单
    const subMenu = findSubMenu(mainMenu, subMenuPath, pathParts)
    
    if (subMenu) {
      menuTitle = subMenu.menuName
      menuIcon = subMenu.menuIcon || 'Document'
      
      // 立即更新面包屑，并等待更新完成
      await new Promise(resolve => {
        forceUpdateBreadcrumb(menuTitle, true)
        nextTick(() => {
          resolve()
        })
      })
    }
  }
  
  // 如果从菜单数据中未找到标题，尝试从DOM中获取
  if (!menuTitle) {
    const menuItem = document.querySelector(`.el-menu-item[index="${index}"]`)
    if (menuItem) {
      const titleSpan = menuItem.querySelector('.menu-title')
      if (titleSpan) {
        menuTitle = titleSpan.textContent.trim()
        // 立即更新面包屑，并等待更新完成
        await new Promise(resolve => {
          forceUpdateBreadcrumb(menuTitle, true)
          nextTick(() => {
            resolve()
          })
        })
      }
    }
  }
  
  // 如果还是没有标题，使用当前页面名称
  menuTitle = menuTitle || getCurrentPageName()
  
  // 创建新的标签页
  const newView = {
    path: index,
    title: menuTitle,
    name: route.name,
    icon: menuIcon
  }
  
  // 检查是否已存在相同路径的标签
  const existingTagIndex = visitedViews.value.findIndex(v => v.path === index)
  if (existingTagIndex === -1) {
    // 如果不存在，添加新标签
    visitedViews.value.push(newView)
  } else {
    // 如果已存在，更新其标题和图标
    visitedViews.value[existingTagIndex] = {
      ...visitedViews.value[existingTagIndex],
      title: menuTitle,
      icon: menuIcon
    }
  }
  saveVisitedViews()
  
  // 确保面包屑更新完成后再进行路由跳转
  await nextTick()
  router.push(index)
  
  // 使用固定标题
  document.title = 'SystemsAdmin管理系统'
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

// 获取菜单项的路径
const getMenuItemPath = (route, child) => {
  // 获取基础路径
  const basePath = currentBasePath.value
  
  // 获取子菜单路径
  let childPath = child.path
  
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
  
  // 构建完整路径 - 直接使用基础路径 + 子菜单路径，避免重复添加父级路径
  const fullPath = `${basePath}/${childPath}`
  
  return fullPath
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
  height: 46px;  /* 原来是50px，减小高度 */
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

/* 删除navbar底部的线条 */
/* .navbar::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  height: 1px;
  background-color: #eef2f7;
} */

.left-menu {
  display: flex;
  align-items: center;
}

.hamburger-container {
  cursor: pointer;
  margin-right: 15px;
}

/* 新增：面包屑导航样式 */
.breadcrumb-container {
  margin-right: 20px;
}

/* 新增：搜索框样式 */
.search-container {
  margin-right: 20px;
}

.search-input {
  width: 200px;
}

/* 新增：通知图标样式 */
.notification-container {
  margin-right: 20px;
  cursor: pointer;
}

.notification-badge :deep(.el-badge__content) {
  background-color: #f56c6c;
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

.tags-view-container {
  height: 28px;
  width: 100%;
  background: transparent;
  border-radius: 0;
  border: none;
  border-top: none;
  box-shadow: none;
  overflow-x: hidden;
  white-space: nowrap;
  margin: 0 18px;
  margin-top: 10px;  /* 原来是25px，减小上边距 */
  margin-bottom: 10px; /* 原来是10px，减小下边距 */
  padding: 0;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
}

.tags-view-wrapper {
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 0;
  margin-left: 0;
  flex-wrap: nowrap;
  overflow: hidden;
}

.tags-view-item {
  display: inline-flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  height: 26px;  /* 原来是26px，减小高度 */
  line-height: 24px;  /* 原来是26px，与高度保持一致 */
  border: 1px solid #e8eef7; /* 原来是#d8dce5，调整为更浅的颜色 */
  color: #495060;
  background: #fff;
  padding: 0 8px;
  font-size: 12px;
  margin-left: 5px;
  margin-top: 0;
  border-radius: 3px;
}

.tags-view-item:first-of-type {
  margin-left: 0;
}

.tags-view-item .tag-icon {
  margin-right: 4px;
}

.tags-view-item.active {
  background-color: #409EFF;
  color: #fff;
  border-color: #409EFF;
}

.tags-view-item.active::before {
  content: '';
  background: #fff;
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  position: relative;
  margin-right: 4px;
}

.tags-view-item .close-icon {
  width: 14px;
  height: 14px;
  line-height: 14px;
  border-radius: 50%;
  text-align: center;
  transition: all .3s cubic-bezier(.645, .045, .355, 1);
  transform-origin: 100% 50%;
  margin-left: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tags-view-item .close-icon:hover {
  background-color: #b4bccc;
  color: #fff;
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
</style> 