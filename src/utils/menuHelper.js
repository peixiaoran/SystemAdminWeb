/**
 * 菜单数据处理工具函数
 */

/**
 * 将后端返回的菜单数据转换为前端路由格式
 * @param {Array} menuList - 后端返回的菜单列表
 * @param {String} basePath - 基础路径，默认为空
 * @returns {Array} - 转换后的路由格式数据
 */
export function transformMenuToRoutes(menuList, basePath = '') {
  if (!menuList || menuList.length === 0) {
    return []
  }

  return menuList.map(menu => {
    // 处理路径 - 优先使用预处理的路径，其次是path，最后才是menuCode转换
    let path = ''
    
    // 优先使用预处理的路径
    if (menu._processedPath) {
      path = menu._processedPath
    } else if (menu.path && menu.path.trim() !== '') {
      path = menu.path
      
      // 如果path以/开头，去掉第一个/
      if (path.startsWith('/')) {
        path = path.substring(1)
      }
      
      // 如果path包含文件名(如index.vue)，则去掉.vue后缀
      if (path.endsWith('.vue')) {
        path = path.substring(0, path.length - 4)
      }
      
      // 如果path包含目录和文件名，只保留目录部分
      if (path.includes('/')) {
        const pathParts = path.split('/')
        if (pathParts[pathParts.length - 1] === 'index' || 
            pathParts[pathParts.length - 1] === 'index.vue') {
          path = pathParts.slice(0, -1).join('/')
        }
      }
    } else {
      path = menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
    }
    
    // 确保子菜单路径不包含父级路径
    if (basePath && path.startsWith(basePath + '/')) {
      path = path.substring(basePath.length + 1)
    } else if (basePath && path.startsWith('/')) {
      path = path.substring(1)
    }
    
    // 创建路由对象
    const route = {
      path: path,
      name: menu.menuCode,
      meta: {
        title: menu.menuName,
        icon: menu.menuIcon || 'Document'
      }
    }
    
    // 处理子菜单
    if (menu.menuChildList && menu.menuChildList.length > 0) {
      // 不传递basePath，避免路径重复
      route.children = transformMenuToRoutes(menu.menuChildList, '')
    }
    
    return route
  })
}

/**
 * 获取当前系统的菜单数据
 * @param {Array} menuList - 后端返回的菜单列表
 * @param {String} systemCode - 系统编码
 * @returns {Array} - 当前系统的菜单数据
 */
export function getSystemMenu(menuList, systemCode) {
  if (!menuList || menuList.length === 0) {
    return []
  }
  
  // 查找匹配的系统菜单
  const systemMenu = menuList.find(menu => 
    menu.menuCode.toLowerCase() === systemCode.toLowerCase() ||
    menu.path === systemCode
  )
  
  return systemMenu ? (systemMenu.menuChildList || []) : []
} 