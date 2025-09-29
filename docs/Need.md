1、字典页面筛选部分新增模块下拉框：没有请求参数，返回参数：{
  "code": 200,
  "data": [
    {
      "moduleId": "1350161679034934501",
      "moduleName": "系统基本管理",
      "disabled": false
    },
    {
      "moduleId": "1968271760889614336",
      "moduleName": "表单签核业务",
      "disabled": false
    }
  ],
  "message": ""
}
2、字典页面筛选部分新增字典类型下拉框：请求参数moduleId(联动筛选部分模块下拉框的选中值)，返回参数：{
  "code": 200,
  "data": [
    {
      "dicTypeCode": "ApprovalState",
      "dicTypeName": "ApprovalState"
    }
  ],
  "message": ""
}
3、查询分页请求参数：{
  "moduleId": "",
  "dicName": "",
  "dicType": "",
  "pageIndex": 1,
  "pageSize": 1,
  "totalCount": 1
}增加了moduleId、dicType参数，筛选部分按照模块、字典类型、字典名称排版。