/**
 * 预测周明细API配置文件
 * 集中管理预测周明细相关API接口
 */

// 预测周明细分页查询API
export const GET_FORE_WEEKLY_DETAIL_PAGE_API = {
    GET_FORE_WEEKLY_DETAIL_PAGE: 'CustMat/RollingForecast/FoWeeklyDetail/GetForecastVersionPage'
}

// 预测周明细数据查询API（按版本查询周期列与物料行数据）
export const GET_FO_WEEKLY_DETAIL_API = {
    GET_FO_WEEKLY_DETAIL: 'CustMat/RollingForecast/FoWeeklyDetail/GetFoWeeklyDetail'
}

// 预测周明细归档数据查询API（非最新版本查看时使用，返回结构与GetFoWeeklyDetail一致）
export const GET_FO_WEEKLY_ARCHIVE_DETAIL_API = {
    GET_FO_WEEKLY_ARCHIVE_DETAIL: 'CustMat/RollingForecast/FoWeeklyDetail/GetFoWeeklyArchiveDetail'
}

// 导出预测周明细上摆模板API
export const EXPORT_FO_WEEKLY_DETAIL_TEMPLATE_API = {
    EXPORT_FO_WEEKLY_DETAIL_TEMPLATE: 'CustMat/RollingForecast/FoWeeklyDetail/ExportFoWeeklyDetailTemplate'
}

// 导出预测周明细数据API
export const EXPORT_FO_WEEKLY_DETAIL_API = {
    EXPORT_FO_WEEKLY_DETAIL: 'CustMat/RollingForecast/FoWeeklyDetail/ExportFoWeeklyDetail'
}

// 导入预测周明细上摆数据API
export const IMPORT_FO_WEEKLY_DETAIL_API = {
    IMPORT_FO_WEEKLY_DETAIL: 'CustMat/RollingForecast/FoWeeklyDetail/ImportFoWeeklyDetail'
}
