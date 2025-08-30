页面新增员工兼任功能：点击新增兼任分三行
第一行：兼任部门下拉框（GET_DEPARTMENT_DROPDOWN_API）、兼任职级下拉框（GET_POSITION_DROPDOWN_API）、兼任职业下拉框 （GET_LABOR_DROPDOWN_API） 
第二行：开始时间（年月日时分秒）、结束时间（年月日时分秒）
第一、二行和第三行el-divider分割线
第三行：展示用户信息（单选），调用GET_USER_PAGES_API接口，请求参数：{
  "departmentId": "",
  "userNo": "",
  "userName": "",
  "pageIndex": 1,
  "pageSize": 1,
  "totalCount": 1
}，返回参数：{
  "code": 200,
  "message": "",
  "data": [
    {
      "userId": "1961651950017712128",
      "userNo": "E327852",
      "userNameCn": "黃仁華",
      "userNameEn": "Paul.Huang",
      "departmentName": "系统开发部门",
      "departmentLevelName": "部门级",
      "positionName": "师十四",
      "genderName": "男",
      "nationalityName": "陆籍",
      "laborName": "系统架构师",
      "isApproval": 1,
      "isApprovalName": "需要签核",
    }
  ],
  "totalCount": 6
}
最后新增时调用INSERT_USER_PARTTIME_API接口，请求参数：{
  "userId": "", 选中的员工userId
  "partTimeDeptId": "",第一行的部门下拉框
  "partTimePositionId": "",第一行的职级下拉框
  "partTimeLaborId": "",第一行的职业下拉框
  "startTime": "",开始时间
  "endTime": ""结束时间
}，返回参数：{
  "code": 200,
  "data": 0,
  "message": ""
}，统一提示message，i18n配置一下。