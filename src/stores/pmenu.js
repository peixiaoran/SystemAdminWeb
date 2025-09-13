import { defineStore } from 'pinia'

// 一级菜单信息存储
export const usePMenuStore = defineStore('pmenu', {
  state: () => ({
    currentModuleId: localStorage.getItem('currentModuleId') || '',
    currentModuleName: localStorage.getItem('currentModuleName') || '',
    currentModulePath: localStorage.getItem('currentModulePath') || '',
    currentModuleNameCn: localStorage.getItem('currentModuleNameCn') || '',
    currentModuleNameEn: localStorage.getItem('currentModuleNameEn') || ''
  }),
  
  getters: {
    // 是否已选择模块
    hasSelectedPMenu: (state) => !!state.currentModuleId,
    
    // 获取模块首页路径
    pmenuIndexPath: (state) => {
      if (!state.currentModulePath) return '/module-select'
      
      return state.currentModulePath.endsWith('/') 
        ? `${state.currentModulePath}index` 
        : `/${state.currentModulePath}/index`
    }
  },
  
  actions: {
    // 设置当前模块信息
    setCurrentPMenu(moduleId, moduleName, modulePath, moduleNameCn = '', moduleNameEn = '') {
      this.currentModuleId = moduleId
      this.currentModuleName = moduleName
      this.currentModulePath = modulePath
      this.currentModuleNameCn = moduleNameCn
      this.currentModuleNameEn = moduleNameEn
      
      // 同时更新localStorage (兼容原有代码)
      localStorage.setItem('currentModuleId', moduleId)
      localStorage.setItem('currentModuleName', moduleName)
      localStorage.setItem('currentModulePath', modulePath)
      localStorage.setItem('currentModuleNameCn', moduleNameCn)
      localStorage.setItem('currentModuleNameEn', moduleNameEn)
    },
    
    // 清除模块信息
    clearCurrentPMenu() {
      this.currentModuleId = ''
      this.currentModuleName = ''
      this.currentModulePath = ''
      this.currentModuleNameCn = ''
      this.currentModuleNameEn = ''
      
      // 同时清除localStorage
      localStorage.removeItem('currentModuleId')
      localStorage.removeItem('currentModuleName')
      localStorage.removeItem('currentModulePath')
    }
  },
  
  // 启用持久化 - 使用3.x版本API
  persist: {
    key: 'module-store',
    storage: localStorage,
    paths: ['currentModuleId', 'currentModuleName', 'currentModulePath', 'currentModuleNameCn', 'currentModuleNameEn']
  }
})