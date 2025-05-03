import { createPinia } from 'pinia'

// 导出 pinia 实例
const pinia = createPinia()

export default pinia

// 导出所有 store
export * from './user'
export * from './menu' 