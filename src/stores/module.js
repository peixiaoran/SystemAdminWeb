import { defineStore } from 'pinia'

// 模块信息存储
export const useModuleStore = defineStore('module', {
  state: () => ({
    currentDomainId: localStorage.getItem('currentDomainId') || '',
    currentSystemName: localStorage.getItem('currentSystemName') || '',
    currentSystemPath: localStorage.getItem('currentSystemPath') || '',
    currentSystemNameCn: localStorage.getItem('currentSystemNameCn') || '',
    currentSystemNameEn: localStorage.getItem('currentSystemNameEn') || ''
  }),
  
  getters: {
    // 是否已选择模块
    hasSelectedModule: (state) => !!state.currentDomainId,
    
    // 获取模块首页路径
    moduleIndexPath: (state) => {
      if (!state.currentSystemPath) return '/module-select'
      
      return state.currentSystemPath.endsWith('/') 
        ? `${state.currentSystemPath}index` 
        : `/${state.currentSystemPath}/index`
    }
  },
  
  actions: {
    // 设置当前模块信息
    setCurrentModule(domainId, systemName, systemPath, systemNameCn = '', systemNameEn = '') {
      this.currentDomainId = domainId
      this.currentSystemName = systemName
      this.currentSystemPath = systemPath
      this.currentSystemNameCn = systemNameCn
      this.currentSystemNameEn = systemNameEn
      
      // 同时更新localStorage (兼容原有代码)
      localStorage.setItem('currentDomainId', domainId)
      localStorage.setItem('currentSystemName', systemName)
      localStorage.setItem('currentSystemPath', systemPath)
      localStorage.setItem('currentSystemNameCn', systemNameCn)
      localStorage.setItem('currentSystemNameEn', systemNameEn)
    },
    
    // 清除模块信息
    clearCurrentModule() {
      this.currentDomainId = ''
      this.currentSystemName = ''
      this.currentSystemPath = ''
      
      // 同时清除localStorage
      localStorage.removeItem('currentDomainId')
      localStorage.removeItem('currentSystemName')
      localStorage.removeItem('currentSystemPath')
    }
  },
  
  // 启用持久化 - 使用3.x版本API
  persist: {
    key: 'module-store',
    storage: localStorage,
    paths: ['currentDomainId', 'currentSystemName', 'currentSystemPath', 'currentSystemNameCn', 'currentSystemNameEn']
  }
})