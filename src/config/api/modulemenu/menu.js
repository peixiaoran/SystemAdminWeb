/**
 * 统一的API配置文件
 * 集中管理所有API相关的基础配置
 */

import { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS } from '@/config/api/base'
export { ENV_MODE, IS_DEV, IS_PROD, BASE_API_URL, API_TIMEOUT, ENABLE_LOGS }

// 查询模块列表
export const MODULE_API = {
    GET_MODULES: 'SystemBasicMgmt/SystemAuth/SysModuleMenu/GetModuleList'
}
  
// 查询菜单树结构
export const MENU_API = {
    GET_MENU: 'SystemBasicMgmt/SystemAuth/SysModuleMenu/GetMenuTreeList'
}