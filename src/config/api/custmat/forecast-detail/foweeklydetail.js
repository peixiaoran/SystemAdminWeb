/**
 * 预测明细-每周滚动预测API配置文件
 * 集中管理预测明细-每周滚动预测相关API接口
 */

// 预测周明细分页查询API
export const GET_FORE_WEEKLY_DETAIL_PAGE_API = {
    GET_FORE_WEEKLY_DETAIL_PAGE: 'CustMat/ForecastDetail/FoWeeklyDetail/GetForecastVersionPage'
}

// 预测周明细数据查询API（按版本、业务人员查询周期列与物料行数据）
export const GET_FO_WEEKLY_DETAIL_API = {
    GET_FO_WEEKLY_DETAIL: 'CustMat/ForecastDetail/FoWeeklyDetail/GetFoWeeklyDetail'
}

// 预测周明细归档数据查询API（非最新版本查看时使用，返回结构与GetFoWeeklyDetail一致）
export const GET_FO_WEEKLY_ARCHIVE_DETAIL_API = {
    GET_FO_WEEKLY_ARCHIVE_DETAIL: 'CustMat/ForecastDetail/FoWeeklyDetail/GetFoWeeklyArchiveDetail'
}

// 导出预测周明细数据API
export const EXPORT_FO_WEEKLY_DETAIL_API = {
    EXPORT_FO_WEEKLY_DETAIL: 'CustMat/ForecastDetail/FoWeeklyDetail/ExportFoWeeklyDetail'
}

// 业务人员下拉API
export const GET_SALES_USER_DROP_API = {
    GET_SALES_USER_DROP: 'CustMat/ForecastDetail/FoWeeklyDetail/GetSalesUserDrop'
}
