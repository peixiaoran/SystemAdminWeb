export default {
  // 通用
  common: {
    systemTitle: 'SystemsAdmin管理系统',
    confirm: '确定',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    reset: '重置',
    success: '成功',
    failed: '失败',
    loading: '加载中...',
    noData: '暂无数据',
    logout: '退出登录',
    confirmLogout: '确定要退出登录吗?',
    tip: '提示',
    warning: '警告',
    enter: '进入',
    language: '语言',
  },
  
  // 布局
  layout: {
    home: '首页',
    returnHome: '返回首页',
    personalInfo: '个人信息',
    changePassword: '修改密码',
    logout: '退出登录',
    refreshPage: '刷新页面',
    closeCurrentTab: '关闭当前标签',
    closeOtherTabs: '关闭其他标签',
    closeAllTabs: '关闭所有标签',
  },
  
  // 登录页
  login: {
    title: 'Vue Admin管理系统',
    username: '用户名',
    password: '密码',
    factory: '厂区',
    language: '语言',
    loginButton: '登录',
    usernamePlaceholder: '请输入用户名',
    passwordPlaceholder: '请输入密码',
    factoryPlaceholder: '请选择厂区',
    languagePlaceholder: '请选择语言',
    usernameRequired: '请输入用户名',
    passwordRequired: '请输入密码',
    factoryRequired: '请选择厂区',
    loginFailed: '登录失败',
    loginFailedTip: '登录请求失败，请稍后重试',
    factories: {
      ESK: '昆山乙盛',
      ETW: '乙盛台灣',
      ESW: '無錫欣冠',
      ESD: '東莞乙宏',
      ESC: '煙台正乙',
      EMY: '馬來西亞',
      EMJ: '馬來西亞',
      ESV: '越南厂',
      EST: '墨西哥MUSG',
      ESH: '新加坡ESONSG',
      ESM: '蒙特雷',
      MTY: '新加坡ESONSG'
    },
    languages: {
      'zh-CN': '中文简体',
      'zh-TW': '中文繁体',
      'en-US': 'English',
      'vi-VN': 'Việt Nam'
    }
  },
  
  // 模块选择页面
  moduleSelect: {
    userInfo: '个人信息',
    accountSettings: '账号设置',
    moduleLoading: '正在加载数据...',
    moduleError: '获取模块数据失败',
    moduleErrorRetry: '获取模块数据失败，请稍后重试',
    moduleIncomplete: '模块信息不完整'
  },
  
  // 系统基础管理
  systemBasicmgmt: {
    // 系统状态卡片
    systemStatus: {
      cpuUsage: 'CPU使用率',
      memoryUsage: '内存使用率',
      diskUsage: '磁盘使用率',
      systemLoad: '系统负载',
      normal: '正常',
      warning: '注意',
      danger: '危险',
      cores: '核心',
      threads: '线程',
      lastMinutes: '最近15分钟'
    },
    // 资源使用趋势
    resourceTrend: {
      title: '资源使用趋势',
      hour: '1小时',
      day: '24小时',
      week: '7天',
      month: '30天',
      placeholder: '资源使用趋势图表（这里放实际的图表组件）'
    },
    // 系统信息
    systemInfo: {
      title: '系统信息',
      refresh: '刷新',
      os: '操作系统',
      serverIp: '服务器IP',
      systemTime: '系统时间',
      uptime: '运行时间',
      cpuModel: 'CPU型号',
      memoryCapacity: '内存容量',
      diskSpace: '磁盘空间',
      systemVersion: '系统版本'
    },
    // 服务状态
    serviceStatus: {
      title: '服务状态',
      refresh: '刷新',
      restartAll: '全部重启',
      running: '运行中',
      stopped: '已停止',
      warning: '警告',
      stop: '停止',
      start: '启动',
      restart: '重启'
    },
    // 系统日志
    systemLog: {
      title: '系统日志',
      time: '时间',
      level: '级别',
      module: '模块',
      content: '内容',
      operation: '操作',
      details: '详情',
      viewMore: '查看更多',
      logType: '日志类型',
      all: '全部',
      error: '错误',
      warning: '警告',
      info: '信息'
    },
    // 备份记录
    backupRecord: {
      title: '备份记录',
      backupNow: '立即备份',
      restore: '恢复',
      delete: '删除'
    },
    // 系统通知
    systemNotice: {
      title: '系统通知',
      publish: '发布通知',
      noticeTitle: '标题',
      type: '类型',
      publisher: '发布人',
      publishTime: '发布时间',
      operation: '操作',
      view: '查看',
      delete: '删除',
      maintenance: '维护',
      update: '更新',
      security: '安全',
      announcement: '公告'
    },
    // 快捷操作
    quickAction: {
      title: '快捷操作'
    },
    // 公司信息
    companyInfo: {
      title: '公司信息',
      companyNameCh: '中文名称',
      companyNameEn: '英文名称',
      companyPhone: '公司电话',
      companyFax: '公司传真',
      createdTime: '创建时间',
      remark: '备注',
      operation: '操作',
      addCompany: '新增公司',
      editCompany: '编辑公司信息',
      deleteConfirm: '确定要删除该条记录吗？',
      pleaseInputNameCh: '请输入中文名称',
      pleaseInputNameEn: '请输入英文名称',
      index: '序号',
      saveSuccess: '保存成功',
      updateSuccess: '更新成功',
      deleteSuccess: '删除成功',
      operationFailed: '操作失败',
      getFailed: '获取数据失败'
    },
    // 用户信息
    userInfo: {
      title: '用户信息',
      companyNameCh: '中文名称',
      companyNameEn: '英文名称',
      companyPhone: '公司电话',
      companyFax: '公司传真',
      createdTime: '创建时间',
      remark: '备注',
      operation: '操作',
      addUser: '新增用户',
      editUser: '编辑用户信息',
      deleteConfirm: '确定要删除该条记录吗？',
      pleaseInputNameCh: '请输入中文名称',
      pleaseInputNameEn: '请输入英文名称',
      index: '序号',
      saveSuccess: '保存成功',
      updateSuccess: '更新成功',
      deleteSuccess: '删除成功',
      operationFailed: '操作失败',
      getFailed: '获取数据失败'
    },
    // 系统管理
    systemMgmt: {
      // 通用项
      index: '序号',
      operation: '操作',
      remark: '备注',
      remarks: '备注',
      isEnabled: '是否启用',
      isVisible: '是否显示',
      enabled: '启用',
      disabled: '禁用',
      visible: '显示',
      hidden: '隐藏',
      createdBy: '创建人',
      createdTime: '创建时间',
      updateBindings: '更新绑定',
      selectPlaceholder: '请选择',
      inputPlaceholder: '请输入',
      fillRequiredInfo: '请填写必要信息',
      invalidId: '无效的ID',
      
      // 网域管理
      domain: {
        title: '网域管理',
        domainCode: '网域编码',
        domainName: '网域名称',
        domainIcon: '网域图标',
        sortOrder: '网域排序',
        roleCode: '权限标识',
        pagePath: '页面Path',
        component: '组件',
        target: '目标',
        addDomain: '新增网域',
        editDomain: '编辑网域信息',
        deleteConfirm: '确定要删除该条记录吗？',
        pleaseInputDomainCode: '请输入网域编码',
        pleaseInputDomainName: '请输入网域名称'
      },
      
      // 模块管理
      module: {
        title: '模块管理',
        domain: '所属网域',
        menuCode: '模块编码',
        menuName: '模块名称',
        menuIcon: '模块图标',
        sortOrder: '模块排序',
        menuUrl: '模块URL',
        level: '模块等级',
        roleCode: '权限标识',
        pagePath: '页面Path',
        component: '组件',
        target: '目标',
        addModule: '新增模块',
        editModule: '编辑模块信息',
        deleteConfirm: '确定要删除该条记录吗？',
        pleaseSelectDomain: '请选择所属网域',
        pleaseInputMenuCode: '请输入模块编码',
        pleaseInputMenuName: '请输入模块名称'
      },
      
      // 程序管理
      program: {
        title: '程序管理',
        programCode: '程序编码',
        programName: '程序名称',
        domain: '所属网域',
        module: '所属模块',
        programIcon: '程序图标',
        sortOrder: '程序排序',
        pagePath: '页面Path',
        programType: '程序类型',
        roleCode: '权限标识',
        apiRoute: 'AIP路由',
        component: '组件',
        target: '目标',
        addProgram: '新增程序',
        editProgram: '编辑程序信息',
        deleteConfirm: '确定要删除该条记录吗？',
        pleaseInputProgramCode: '请输入程序编码',
        pleaseInputProgramName: '请输入程序名称',
        pleaseSelectDomain: '请选择所属网域',
        pleaseSelectModule: '请选择所属模块'
      },
      
      // 角色管理
      role: {
        title: '角色管理',
        roleCode: '角色编码',
        roleName: '角色名称',
        description: '描述',
        addRole: '新增角色',
        editRole: '编辑角色信息',
        deleteConfirm: '确定要删除该条记录吗？',
        pleaseInputRoleCode: '请输入角色代码',
        pleaseInputRoleName: '请输入角色名称'
      },
      
      // 角色网域
      roleDomain: {
        title: '角色网域管理',
        role: '角色',
        domain: '网域',
        isBinding: '是否绑定',
        pleaseSelectRole: '请先选择角色',
        pleaseSelectDomain: '请先选择网域',
        updateBindingsSuccess: '更新绑定成功'
      },
      
      // 角色模块
      roleModule: {
        title: '角色模块管理',
        role: '角色',
        domain: '网域',
        module: '模块',
        isBinding: '是否绑定',
        pleaseSelectRole: '请先选择角色',
        pleaseSelectDomain: '请先选择网域',
        updateBindingsSuccess: '更新绑定成功'
      },
      
      // 角色程序
      roleProgram: {
        title: '角色程序管理',
        role: '角色',
        domain: '网域',
        module: '模块',
        program: '程序',
        isBinding: '是否绑定',
        pleaseSelectRole: '请先选择角色',
        pleaseSelectDomain: '请先选择网域',
        pleaseSelectModule: '请先选择模块',
        updateBindingsSuccess: '更新绑定成功'
      }
    }
  }
} 