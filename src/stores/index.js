import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 添加持久化插件 - 使用3.x版本的API
pinia.use(piniaPluginPersistedstate)

export default pinia 