1、表单组别新增接口INSERT_FORMGROUP_ENTITY_API，请求参数：{
  "formGroupId": "",
  "formGroupNameCn": "",
  "formGroupNameEn": "",
  "sortOrder": 1,
  "isEnabled": 1,
  "description": ""
}，formGroupNameCn、formGroupNameEn、sortOrder、isEnabled必填，返回参数{
  "code": 200,
  "data": 1,
  "message": "新增表单组别成功"
}
2、删除表单组别接口DELETE_FORMGROUP_ENTITY_API，请求参数：{
  "formGroupId": "",
  "formGroupNameCn": "",
  "formGroupNameEn": "",
  "sortOrder": 1,
  "isEnabled": 1,
  "description": ""
}，返回参数{
  "code": 200,
  "data": 1,
  "message": "删除表单组别成功"
}
3、点击编辑调用GET_FORMGROUP_ENTITY_API，请求参数：{
  "formGroupId": "1968922852585508864",
  "formGroupNameCn": "",
  "formGroupNameEn": "",
  "sortOrder": 1,
  "isEnabled": 1,
  "description": ""
}返回参数：{
  "code": 200,
  "data": {
    "formGroupId": "1968922852585508864",
    "formGroupNameCn": "工程管理类",
    "formGroupNameEn": "Engineering Management",
    "sortOrder": 1,
    "description": ""
  },
  "message": ""
}
4、点击保存调用UPDATE_FORMGROUP_API，请求参数：{
  "formGroupId": "",
  "formGroupNameCn": "",
  "formGroupNameEn": "",
  "sortOrder": 1,
  "isEnabled": 1,
  "description": ""
}，返回参数{
  "code": 200,
  "data": 1,
  "message": "更新表单组别成功"
}
5、查询表单组别列表接口GET_FORMGROUP_LIST_API，请求参数：{
  "formGroupName": "",
  "pageIndex": 1,
  "pageSize": 1,
  "totalCount": 1
}，返回参数：{
  "code": 200,
  "message": "",
  "data": [
    {
      "formGroupId": "1968922852585508864",
      "formGroupNameCn": "工程管理类",
      "formGroupNameEn": "Engineering Management",
      "sortOrder": 1,
      "description": ""
    }
  ],
  "totalCount": 3
}，以上为表单组别相关接口，增删改提示message，配置i18n