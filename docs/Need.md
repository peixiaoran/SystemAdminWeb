1、角色菜单配置模块点击保存时调用UPDATE_ROLE_MODULE_CONFIG_API接口，请求参数：{
  "roleId": "",
  "moduleIds": [
    ""
  ]
}moduleIds是模块选中的id，返回参数：{
  "code": 1,
  "data": 1,
  "message": null
}
2、角色菜单配置菜单点击保存时调用UPDATE_ROLE_MENU_CONFIG_API接口，请求参数：{
  "roleId": "",
  "menuIds": [
    ""
  ]
}menuIds是菜单选中的id，返回参数：{
  "code": 1,
  "data": 1,
  "message": null
}