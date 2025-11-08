1、事件分页查询接口：GET_EVENT_PAGE_API，请求参数：{
  "controlCode": "",//GET_CONTROL_DROPDOWN_API接口下拉框的选中值
  "eventCode": "",
  "pageIndex": 1,
  "pageSize": 1,
  "totalCount": 1
}，返回参数：{
  "code": 200,
  "message": "",
  "data": [
    {
      "controlName": "el-button",
      "eventName": "click",
      "description": "点击触发"
    }
  ],
  "totalCount": 1
}
2、新增接口：INSERT_EVENT_ENTITY_API，请求参数：{
  "controlCode": "",
  "controlName": "",
  "description": ""
}，返回参数：{
  "code": 200,
  "message": "",
  "data": 1
}
4、删除接口：DELETE_EVENT_API，请求参数：{
  "eventCode": ""
}，返回参数：{
  "code": 200,
  "message": "",
  "data": 1
}
5、获取事件实体接口：GET_CONTROL_DROPDOWN_API，无请求参数，返回参数：{
  "code": 200,
  "data": [
    {
      "controlCode": "el-button",
      "controlName": "el-button"
    }
  ],
  "message": ""
}