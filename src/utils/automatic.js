/** 后端 Automatic 字段（是否自动审批）可能为 1/0、true/false、'1'/'true'，统一转为布尔值 */
export const isAutomatic = (v) => v === true || v === 1 || String(v).toLowerCase() === 'true' || String(v) === '1'
