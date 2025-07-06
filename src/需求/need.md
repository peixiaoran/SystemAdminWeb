1、个人信息进入页面是一个表单样式然后调用接口：GET_PERSONAL_INFO_ENTITY_API没有请求参数，返回数据结构是{
  "data": {
    "userId": "1903486709602062336",
    "departmentId": "1929535196076576768",
    "positionId": "1351581732096180224",
    "roleId": "1905670034215276544",
    "userNo": "E000000",
    "userNameCh": "管理員",
    "userNameEn": "Admin",
    "gender": 1,
    "hireDate": "2024-07-22",
    "email": "Administrator@eson.tw",
    "phoneNumber": "18815384916",
    "loginNo": "E000000",
    "isEmployed": 1,
    "isAgent": 0,
    "isSign": 0,
    "isPartTime": 0,
    "isFreeze": 0,
    "employmentType": "1",
    "remark": ""
  },
  "code": "200",
  "message": ""
}
2、DROPDOWN_API这些接口对应上述表单的内容
3、除了userNameCh、userNameEn、Email、phoneNumber其余都不允许修改。

## 功能实现说明

### 已完成的功能：
1. ✅ 创建个人信息管理页面 (`src/views/systemBasicmgmt/system-mgmt/personalInfo.vue`)
2. ✅ 实现表单显示，包含所有字段
3. ✅ 设置字段编辑权限（只允许修改userNameCh、userNameEn、email、phoneNumber）
4. ✅ 集成API调用：
   - GET_PERSONAL_INFO_ENTITY_API：获取个人信息
   - UPDATE_PERSONAL_INFO_API：更新个人信息
   - 各种下拉框API：部门、职位、角色、性别、雇佣类型
5. ✅ 添加表单验证（必填项验证、邮箱格式验证、手机号格式验证）
6. ✅ 实现保存和重置功能
7. ✅ 添加国际化支持（中文繁体、英文）
8. ✅ 添加路由配置

### 页面特性：
- 响应式设计，支持移动端
- 加载状态显示
- 错误处理和用户友好提示
- 禁用不可编辑字段的视觉反馈
- 表单验证和提交状态管理

### 访问路径：
- 路由路径：`/systemBasicmgmt/system-mgmt/personalinfo`
- 菜单位置：系统基础管理 > 系统管理模組 > 個人信息管理

### 技术实现：
- Vue 3 Composition API
- Element Plus UI组件
- Vue I18n国际化
- Axios HTTP请求
- 表单验证和状态管理