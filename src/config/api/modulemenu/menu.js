/**
 * 域菜单相关API配置
 */
import { API_BASE_PATHS } from '../config'

// 查询模块列表
export const MODULE_API = {
    GET_MODULES: `${API_BASE_PATHS.SYSTEM_CORE}/SysModuleMenu/GetModuleList`
}
  
// 查询菜单树结构
export const MENU_API = {
    GET_MENU: `${API_BASE_PATHS.SYSTEM_CORE}/SysModuleMenu/GetMenuTreeList`
}