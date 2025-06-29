员工代理配置点击后，el-dialog加一个新增代理人功能，接口：GET_USER_AGENT_INSERT_API，请求参数{
  "substituteUserId": "",
  "agentUserId": "",
  "startTime": "",
  "endTime": ""
}，返回参数：{
  "data": 1,
  "code": "200",
  "message": "新增代理成功"
}，还有删除代理人功能，接口GET_USER_AGENT_DELETE_API，请求参数：{
  "substituteUserId": "",
  "agentUserId": "",
  "startTime": "",
  "endTime": ""
}，返回参数：{
  "data": 1,
  "code": "200",
  "message": "删除代理成功"
}，点击新增时弹出框显示员工的分页列表（单选），接口GET_USER_VIEW_API，请求参数{
  "userNo": "",
  "pageIndex": 1,
  "pageSize": 1,
  "totalCount": 1
}，返回参数：{
  "data": [
    {
      "userId": "1903486709602062336",
      "userNo": "E000000",
      "userNameCh": "管理员",
      "userNameEn": "Admin",
      "departmentId": "0",
      "departmentName": "Chairman's Office",
      "departmentLevelId": "0",
      "departmentLevelName": "Board of Directors",
      "positionId": "0",
      "positionName": "Division 14"
    }
  ],
  "code": "200",
  "totalNumber": 2,
  "totalPage": 1,
  "message": ""
}