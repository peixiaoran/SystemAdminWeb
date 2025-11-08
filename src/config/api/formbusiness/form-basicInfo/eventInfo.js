/**
 * API配置文件
 * 集中管理API相关配置，区分开发环境和生产环境
 * 使用.env.[mode]文件中的环境变量
 */

// 环境变量
const env = import.meta.env

// 环境标识
export const ENV_MODE = env.MODE
export const IS_DEV = env.DEV
export const IS_PROD = env.PROD

// API基础配置
export const BASE_API_URL = env.VITE_API_BASE_URL
export const API_TIMEOUT = parseInt(env.VITE_API_TIMEOUT || '15000')
export const ENABLE_LOGS = env.VITE_ENABLE_LOGS === 'true'

// 新增事件实体API
export const INSERT_EVENT_ENTITY_API = 'FormBusiness/FormBasicInfo/EventInfo/InsertEventInfo'

// 获取事件分页API
export const GET_EVENT_PAGE_API = 'FormBusiness/FormBasicInfo/EventInfo/GetEventInfoPage'

// 删除事件API
export const DELETE_EVENT_API = 'FormBusiness/FormBasicInfo/EventInfo/DeleteEventInfo'

// 获取控件下拉列表API
export const GET_CONTROL_DROPDOWN_API = 'FormBusiness/FormBasicInfo/EventInfo/GetControlDropDown'

// 获取事件实体API
export const GET_EVENT_ENTITY_API = 'FormBusiness/FormBasicInfo/EventInfo/GetEventInfo'
