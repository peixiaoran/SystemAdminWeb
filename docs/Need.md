1、表单组别下拉框接口GET_FORMTYPE_DROPDOWN_API，无请求参数，返回Json:{
  "code": 200,
  "data": [
    {
      "formGroupId": "1969051016183812096",
      "formGroupName": "人事类",
      "disabled": false
    }
  ],
  "message": ""
}
2、表单类型分页请求接口GET_FORMTYPE_PAGE_API，formGroupId是表单组别下拉框的formGroupId：{
  "formGroupId": "",
  "formTypeName": "",
  "pageIndex": 1,
  "pageSize": 1,
  "totalCount": 1
}，返回Json：{
  "code": 200,
  "message": "",
  "data": [
    {
      "formTypeId": "1971095904945573888",
      "formGroupName": "人事类",
      "formTypeNameCn": "员工入职申请单",
      "formTypeNameEn": "Employee Onboarding Form",
      "prefix": "EOB",
      "sortOrder": 0,
      "description": "新员工入职信息登记、账号与设备申请"
    }
  ],
  "totalCount": 10
}
3、新增表单类型接口INSERT_FORMTYPE_ENTITY_API，请求参数：{
  "formTypeId": "",
  "formGroupId": "",
  "formTypeNameCn": "",
  "formTypeNameEn": "",
  "prefix": "",
  "sortOrder": 1,
  "isEnabled": 1,
  "descriptionCn": "",
  "descriptionEn": ""
}，返回Json：{
  "code": 200,
  "message": "",
  "data": null
}
4、删除表单类型接口DELETE_FORMTYPE_ENTITY_API，请求参数：{
  "formTypeId": ""
}，返回Json：{
  "code": 200,
  "message": "",
  "data": null
}
5、编辑获取表单类型接口GET_FORMTYPE_ENTITY_API，请求参数：{
  "formTypeId": ""
}，返回Json：{
  "code": 200,
  "message": "",
  "data": {
    "formTypeId": "1971095904945573888",
    "formGroupId": "1969051016183812096",
    "formTypeNameCn": "员工入职申请单",
    "formTypeNameEn": "Employee Onboarding Form",
    "prefix": "EOB",
    "sortOrder": 0,
    "isEnabled": 1,
    "descriptionCn": "新员工入职信息登记、账号与设备申请",
    "descriptionEn": "Employee onboarding information registration, account and device application"
  }
}
6、更新表单类型接口UPDATE_FORMTYPE_API，请求参数：{
  "formTypeId": "",
  "formGroupId": "",
  "formTypeNameCn": "",
  "formTypeNameEn": "",
  "prefix": "",
  "sortOrder": 1,
  "isEnabled": 1,
  "descriptionCn": "",
  "descriptionEn": ""
}，返回Json：{
  "code": 200,
  "message": "",
  "data": null
}