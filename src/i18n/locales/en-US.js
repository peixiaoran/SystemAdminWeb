export default {
  // Common
  common: {
    systemTitle: 'SystemsAdmin Management System',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    success: 'Success',
    failed: 'Failed',
    loading: 'Loading...',
    noData: 'No Data',
    logout: 'Logout',
    confirmLogout: 'Are you sure you want to logout?',
    tip: 'Tip',
    warning: 'Warning',
    enter: 'Enter',
  },
  
  // Login page
  login: {
    title: 'Vue Admin Management System',
    username: 'Username',
    password: 'Password',
    factory: 'Factory',
    language: 'Language',
    loginButton: 'Login',
    usernamePlaceholder: 'Please input username',
    passwordPlaceholder: 'Please input password',
    factoryPlaceholder: 'Please select factory',
    languagePlaceholder: 'Please select language',
    usernameRequired: 'Please input username',
    passwordRequired: 'Please input password',
    factoryRequired: 'Please select factory',
    loginFailed: 'Login failed',
    loginFailedTip: 'Login request failed, please try again later',
    factories: {
      ESK: 'Kunshan Yisheng',
      ETW: 'Yisheng Taiwan',
      ESW: 'Wuxi Xinguan',
      ESD: 'Dongguan Yihong',
      ESC: 'Yantai Zhengyi',
      EMY: 'Malaysia',
      EMJ: 'Malaysia',
      ESV: 'Vietnam',
      EST: 'Mexico MUSG',
      ESH: 'Singapore ESONSG',
      ESM: 'Monterrey',
      MTY: 'Singapore ESONSG'
    },
    languages: {
      'zh-CN': 'Simplified Chinese',
      'zh-TW': 'Traditional Chinese',
      'en-US': 'English',
      'vi-VN': 'Vietnamese'
    }
  },
  
  // Module selection page
  moduleSelect: {
    userInfo: 'Personal Info',
    accountSettings: 'Account Settings',
    moduleLoading: 'Loading data...',
    moduleError: 'Failed to get module data',
    moduleErrorRetry: 'Failed to get module data, please try again later',
    moduleIncomplete: 'Module information is incomplete'
  },
  
  // System Basic Management
  systemBasicmgmt: {
    // System Status Cards
    systemStatus: {
      cpuUsage: 'CPU Usage',
      memoryUsage: 'Memory Usage',
      diskUsage: 'Disk Usage',
      systemLoad: 'System Load',
      normal: 'Normal',
      warning: 'Warning',
      danger: 'Danger',
      cores: 'cores',
      threads: 'threads',
      lastMinutes: 'last 15 minutes'
    },
    // Resource Usage Trend
    resourceTrend: {
      title: 'Resource Usage Trend',
      hour: '1 Hour',
      day: '24 Hours',
      week: '7 Days',
      month: '30 Days',
      placeholder: 'Resource usage trend chart (actual chart component here)'
    },
    // System Information
    systemInfo: {
      title: 'System Information',
      refresh: 'Refresh',
      os: 'Operating System',
      serverIp: 'Server IP',
      systemTime: 'System Time',
      uptime: 'Uptime',
      cpuModel: 'CPU Model',
      memoryCapacity: 'Memory Capacity',
      diskSpace: 'Disk Space',
      systemVersion: 'System Version'
    },
    // Service Status
    serviceStatus: {
      title: 'Service Status',
      refresh: 'Refresh',
      restartAll: 'Restart All',
      running: 'Running',
      stopped: 'Stopped',
      warning: 'Warning',
      stop: 'Stop',
      start: 'Start',
      restart: 'Restart'
    },
    // System Logs
    systemLog: {
      title: 'System Logs',
      time: 'Time',
      level: 'Level',
      module: 'Module',
      content: 'Content',
      operation: 'Operation',
      details: 'Details',
      viewMore: 'View More',
      logType: 'Log Type',
      all: 'All',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    },
    // Backup Records
    backupRecord: {
      title: 'Backup Records',
      backupNow: 'Backup Now',
      restore: 'Restore',
      delete: 'Delete'
    },
    // System Notifications
    systemNotice: {
      title: 'System Notifications',
      publish: 'Publish Notice',
      noticeTitle: 'Title',
      type: 'Type',
      publisher: 'Publisher',
      publishTime: 'Publish Time',
      operation: 'Operation',
      view: 'View',
      delete: 'Delete',
      maintenance: 'Maintenance',
      update: 'Update',
      security: 'Security',
      announcement: 'Announcement'
    },
    // Quick Actions
    quickAction: {
      title: 'Quick Actions'
    },
    // Company Information
    companyInfo: {
      title: 'Company Information',
      companyNameCh: 'ChineseName',
      companyNameEn: 'EnglishName',
      companyPhone: 'Phone',
      companyFax: 'Fax',
      createdTime: 'CreatedTime',
      remark: 'Remark',
      operation: 'Operation',
      addCompany: 'Add Company',
      editCompany: 'Edit Company Info',
      deleteConfirm: 'Are you sure to delete this record?',
      pleaseInputNameCh: 'Please input Chinese name',
      pleaseInputNameEn: 'Please input English name',
      index: 'No.',
      saveSuccess: 'Save successfully',
      updateSuccess: 'Update successfully',
      deleteSuccess: 'Delete successfully',
      operationFailed: 'Operation failed',
      getFailed: 'Failed to get data'
    },
    // User Information
    userInfo: {
      title: 'User Information',
      companyNameCh: 'Chinese Name',
      companyNameEn: 'English Name',
      companyPhone: 'Phone',
      companyFax: 'Fax',
      createdTime: 'CreatedTime',
      remark: 'Remark',
      operation: 'Operation',
      addUser: 'AddUser',
      editUser: 'EditUser',
      deleteConfirm: 'Are you sure to delete this record?',
      pleaseInputNameCh: 'Please input Chinese name',
      pleaseInputNameEn: 'Please input English name',
      index: 'No.',
      saveSuccess: 'Save successfully',
      updateSuccess: 'Update successfully',
      deleteSuccess: 'Delete successfully',
      operationFailed: 'Operation failed',
      getFailed: 'Failed to get data'
    },
    // System Management
    systemMgmt: {
      // Common items
      index: 'No.',
      operation: 'Operation',
      remark: 'Remark',
      remarks: 'Remarks',
      isEnabled: 'Enabled',
      isVisible: 'Visible',
      enabled: 'Enabled',
      disabled: 'Disabled',
      visible: 'Visible',
      hidden: 'Hidden',
      createdBy: 'Created By',
      createdTime: 'Created Time',
      updateBindings: 'Update Bindings',
      selectPlaceholder: 'Please select',
      inputPlaceholder: 'Please input',
      fillRequiredInfo: 'Please fill in the required information',
      invalidId: 'Invalid ID',
      
      // Domain Management
      domain: {
        title: 'DomainManagement',
        domainCode: 'Domain Code',
        domainName: 'Domain Name',
        domainIcon: 'Icon',
        sortOrder: 'SortOrder',
        roleCode: 'RoleCode',
        pagePath: 'PagePath',
        component: 'Component',
        target: 'Target',
        addDomain: 'AddDomain',
        editDomain: 'EditDomain',
        deleteConfirm: 'Are you sure to delete this record?',
        pleaseInputDomainCode: 'Please input domain code',
        pleaseInputDomainName: 'Please input domain name'
      },
      
      // Module Management
      module: {
        title: 'Module Management',
        domain: 'Domain',
        menuCode: 'Module Code',
        menuName: 'Module Name',
        menuIcon: 'Module Icon',
        sortOrder: 'Sort Order',
        menuUrl: 'Module URL',
        level: 'Level',
        roleCode: 'Role Code',
        pagePath: 'Page Path',
        component: 'Component',
        target: 'Target',
        addModule: 'Add Module',
        editModule: 'Edit Module Info',
        deleteConfirm: 'Are you sure to delete this record?',
        pleaseSelectDomain: 'Please select domain',
        pleaseInputMenuCode: 'Please input module code',
        pleaseInputMenuName: 'Please input module name'
      },
      
      // Program Management
      program: {
        title: 'Program Management',
        programCode: 'Program Code',
        programName: 'Program Name',
        domain: 'Domain',
        module: 'Module',
        programIcon: 'Program Icon',
        sortOrder: 'Sort Order',
        pagePath: 'Page Path',
        programType: 'Program Type',
        roleCode: 'Role Code',
        apiRoute: 'API Route',
        component: 'Component',
        target: 'Target',
        addProgram: 'Add Program',
        editProgram: 'Edit Program Info',
        deleteConfirm: 'Are you sure to delete this record?',
        pleaseInputProgramCode: 'Please input program code',
        pleaseInputProgramName: 'Please input program name',
        pleaseSelectDomain: 'Please select domain',
        pleaseSelectModule: 'Please select module'
      },
      
      // Role Management
      role: {
        title: 'Role Management',
        roleCode: 'Role Code',
        roleName: 'Role Name',
        description: 'Description',
        addRole: 'Add Role',
        editRole: 'Edit Role Info',
        deleteConfirm: 'Are you sure to delete this record?',
        pleaseInputRoleCode: 'Please input role code',
        pleaseInputRoleName: 'Please input role name'
      },
      
      // Role Domain
      roleDomain: {
        title: 'Role Domain Management',
        role: 'Role',
        domain: 'Domain',
        isBinding: 'Binding',
        pleaseSelectRole: 'Please select a role first',
        pleaseSelectDomain: 'Please select a domain first',
        updateBindingsSuccess: 'Update bindings successfully'
      },
      
      // Role Module
      roleModule: {
        title: 'Role Module Management',
        role: 'Role',
        domain: 'Domain',
        module: 'Module',
        isBinding: 'Binding',
        pleaseSelectRole: 'Please select a role first',
        pleaseSelectDomain: 'Please select a domain first',
        updateBindingsSuccess: 'Update bindings successfully'
      },
      
      // Role Program
      roleProgram: {
        title: 'Role Program Management',
        role: 'Role',
        domain: 'Domain',
        module: 'Module',
        program: 'Program',
        isBinding: 'Binding',
        pleaseSelectRole: 'Please select a role first',
        pleaseSelectDomain: 'Please select a domain first',
        pleaseSelectModule: 'Please select a module first',
        updateBindingsSuccess: 'Update bindings successfully'
      }
    }
  }
} 