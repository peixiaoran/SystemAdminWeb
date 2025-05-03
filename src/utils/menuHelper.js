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
      
      if (path.includes('/')) {
        const pathParts = path.split('/')
        
        if (menu.level === 1 || (!menu.level && !basePath)) {
          // 处理一级菜单逻辑
          if (menu.menuType === 2) { // 一级菜单
            if (pathParts.length >= 2) {
              // 存储完整路径以便后续使用
              menu._fullPath = path;
              
              menu._isComplexPath = true;
              menu._systemPath = pathParts[0];
              menu._subSystemPath = pathParts[1];
              
              // 保留完整路径
              path = menu._fullPath;
            } else {
              path = pathParts[pathParts.length - 1]
            }
          } else {
            // 对于非目录型一级菜单，如果包含.vue，则只保留文件名
            const lastPart = pathParts[pathParts.length - 1]
            if (lastPart.endsWith('.vue')) {
              path = lastPart.replace('.vue', '')
            }
          }
        } else {
          // 对于二级菜单
          // 检查父级菜单是否有复合路径标记
          const hasParentWithComplexPath = menu._parentMenu && menu._parentMenu._isComplexPath;
          
          if (hasParentWithComplexPath) {
            // 获取父级的复合路径信息
            const parentSystemPath = menu._parentMenu._systemPath;
            const parentSubSystemPath = menu._parentMenu._subSystemPath;
            
            // 获取当前菜单的文件部分
            let fileName;
            
            // 如果当前path是完整路径
            if (pathParts.length > 1) {
              fileName = pathParts[pathParts.length - 1];
            } else {
              fileName = path;
            }
            
            // 去掉.vue后缀
            if (fileName.endsWith('.vue')) {
              fileName = fileName.replace('.vue', '');
            }
            
            path = `${parentSubSystemPath}/${fileName}`;
            
            // 存储原始文件名，方便后续使用
            menu._fileName = fileName;
          } else if (pathParts.length >= 2) {
            // 处理常规二级菜单路径
            const lastPart = pathParts[pathParts.length - 1]
            // 如果最后一部分是index或index.vue，保留上一级目录
            if (lastPart === 'index' || lastPart === 'index.vue' || lastPart === '') {
              path = pathParts.slice(0, -1).join('/')
            } else if (lastPart.endsWith('.vue')) {
              // 否则如果以.vue结尾，提取文件名作为路径
              path = lastPart.replace('.vue', '')
            }
          }
        }
      }
    } else {
      path = menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
    }
    
    // 创建路由对象
    const route = {
      path: path,
      name: menu.menuCode,
      meta: {
        title: menu.menuName,
        icon: menu.menuIcon || 'Document',
        isComplexPath: menu._isComplexPath || false,
        systemPath: menu._systemPath,
        subSystemPath: menu._subSystemPath,
        fullPath: menu._fullPath,
        fileName: menu._fileName
      }
    }
    
    // 处理子菜单
    if (menu.menuChildList && menu.menuChildList.length > 0) {
      // 为子菜单添加父菜单引用
      menu.menuChildList.forEach(child => {
        child._parentMenu = menu;
      });
      
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
  const systemMenu = menuList.find(menu => {
    // 处理路径或菜单代码
    let menuPath = ''
    
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
      
      if (menuPath.includes('/')) {
        const pathParts = menuPath.split('/')
        // 对于一级菜单，使用最后一个部分进行匹配
        if (pathParts.length > 1) {
          // 如果最后一部分是index，则使用前面部分
          if (pathParts[pathParts.length - 1] === 'index') {
            menuPath = pathParts.slice(0, -1).join('/')
          } else {
            // 否则使用最后一部分
            menuPath = pathParts[pathParts.length - 1]
          }
        }
      }
    } else {
      menuPath = menu.menuCode.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()
    }
    
    const isMatch = menuPath === systemCode || 
                    menu.menuCode.toLowerCase() === systemCode.toLowerCase() ||
                    menu.path === systemCode ||
                    (menu.path && menu.path.toLowerCase().endsWith('/' + systemCode))
    
    return isMatch
  })
  
  return systemMenu ? (systemMenu.menuChildList || []) : []
} 