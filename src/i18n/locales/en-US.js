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
    safeLogout: 'Safe Logout',
    confirmLogout: 'Are you sure you want to logout?',
    tip: 'Tip',
    warning: 'Warning',
    enter: 'Enter',
    backToHome: 'Back to Home',
    home: 'Home',
    personalInfo: 'Personal Info',
    changePassword: 'Change Password',
    refreshPage: 'Refresh Page',
    closeCurrentTab: 'Close Current Tab',
    closeOtherTabs: 'Close Other Tabs',
    closeAllTabs: 'Close All Tabs',
    operation: 'Operation',
    goBack: 'Go Back'
  },
  
  // Error pages
  error: {
    pageNotFound: 'Sorry, the page you visited does not exist or has been removed',
    accessDenied: 'Sorry, you do not have permission to access this page',
    access: 'ACCESS',
    denied: 'DENIED'
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
    loginFailed: 'Login Failed',
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
  
  // Module select page
  moduleSelect: {
    userInfo: 'Personal Info',
    accountSettings: 'Account Settings',
    moduleLoading: 'Loading data...',
    moduleError: 'Failed to get module data',
    moduleErrorRetry: 'Failed to get module data, please try again later',
    moduleIncomplete: 'Module information is incomplete'
  },
  
  // Route titles
  route: {
    login: 'Login',
    moduleSelect: 'System Modules',
    notFound: 'Page Not Found',
    forbidden: 'Access Forbidden',
    systemBasicmgmt: 'System Basic Management',
    systemMgmt: 'SystemMgmt',
    role: 'RoleData',
    domain: 'DomainData',
    module: 'ModuleData',
    program: 'ProgramData',
    roleDomain: 'RoleDomain',
    roleModule: 'RoleModule',
    roleProgram: 'RoleProgram',
    systemBasicData: 'BasicData',
    userInfo: 'EmployeeInfo',
    userPosition: 'UserPosition',
    companyInfo: 'CompanyInfo',
    departmentInfo: 'DepartmentInfo',
    departmentLevel: 'DepartmentLevel',
    sysSettingsModule: 'System Settings Module',
    dictionaryInfo: 'Dictionary Info'
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
      cores: 'Cores',
      threads: 'Threads',
      lastMinutes: 'Last 15 minutes'
    },
    // Resource Usage Trend
    resourceTrend: {
      title: 'Resource Usage Trend',
      hour: '1 Hour',
      day: '24 Hours',
      week: '7 Days',
      month: '30 Days',
      placeholder: 'Resource usage trend chart (chart component here)'
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
      companyNameCn: 'Chinese Name',
      companyNameEn: 'English Name',
      companyPhone: 'Company Phone',
      companyFax: 'Company Fax',
      createdTime: 'CreatedTime',
      remark: 'Remark',
      operation: 'Operation',
      addCompany: 'Add Company',
      editCompany: 'Edit Company Info',
      deleteConfirm: 'Are you sure to delete this record?',
      pleaseInputName: 'Please input company name',
      pleaseInputNameCn: 'Please input Chinese name',
      pleaseInputNameEn: 'Please input English name',
      pleaseInputPhone: 'Please input company phone',
      pleaseInputFax: 'Please input company fax',
      index: 'No.',
      saveSuccess: 'Save successfully',
      updateSuccess: 'Update successfully',
      deleteSuccess: 'Delete successfully',
      operationFailed: 'Operation failed',
      getFailed: 'Failed to get data',
      filter: {
        companyName: 'Company Name',
      }
    },
    // User Information
    userInfo: {
      title: 'User Information',
      userNo: 'User No.',
      userName: 'User Name',
      userNameCh: 'Chinese Name',
      userNameEn: 'English Name',
      department: 'Department',
      position: 'Position',
      role: 'Role',
      gender: 'Gender',
      hireDate: 'Hire Date',
      email: 'Email',
      phoneNumber: 'Phone Number',
      loginNo: 'Login Account',
      password: 'Password',
      isSign: 'Is Sign',
      isPartTime: 'Is Part Time',
      isEmployed: 'Is Employed',
      Employed: 'Employed',
      Resigned: 'Resigned',
      isFreeze: 'Is Freeze',
      employmentType: 'Employment Type',
      remark: 'Remark',
      operation: 'Operation',
      index: 'No.',
      addUser: 'Add User',
      editUser: 'Edit User',
      deleteConfirm: 'Are you sure to delete this user?',
      pleaseInputUserNo: 'Please input user number',
      pleaseInputUserName: 'Please input user name',
      pleaseInputUserNameCh: 'Please input Chinese name',
      pleaseInputUserNameEn: 'Please input English name',
      pleaseInputLoginNo: 'Please input login account',
      pleaseInputPassword: 'Please input password',
      pleaseInputEmail: 'Please input email',
      pleaseSelectGender: 'Please select gender',
      pleaseSelectEmploymentType: 'Please select employment type',
      pleaseSelectDepartment: 'Please select department',
      pleaseSelectPosition: 'Please select position',
      pleaseSelectRole: 'Please select role',
      pleaseSelectHireDate: 'Please select hire date',
      saveSuccess: 'Save successfully',
      updateSuccess: 'Update successfully',
      deleteSuccess: 'Delete successfully',
      operationFailed: 'Operation failed',
      getFailed: 'Failed to get data',
      filter: {
        department: 'Department',
        position: 'Position',
        role: 'Role',
        userNo: 'User No.',
        userName: 'User Name'
      }
    },
    // User Position
    userPosition: {
      title: 'User Position Management',
      positionNo: 'Position No.',
      positionNameCn: 'Position Chinese Name',
      positionNameEn: 'Position English Name',
      positionDescribe: 'Position Description',
      editPosition: 'View Position Details',
      positionNoPlaceholder: 'Please input position number',
      positionNameCnPlaceholder: 'Please input position Chinese name',
      positionNameEnPlaceholder: 'Please input position English name',
      positionDescribePlaceholder: 'Please input position description',
      index: 'No.',
      operation: 'Operation',
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
        domainNameCn: 'Domain Chinese Name',
        domainNameEn: 'Domain English Name',
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
        pleaseInputDomainName: 'Please input domain name',
        pleaseInputDomainNameCn: 'Please input domain Chinese name',
        pleaseInputDomainNameEn: 'Please input domain English name'
      },
      
      // Module Management
      module: {
        title: 'Module Management',
        domain: 'Domain',
        menuCode: 'Module Code',
        menuName: 'Module Name',
        menuNameCn: 'Module Chinese Name',
        menuNameEn: 'Module English Name',
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
        pleaseInputMenuName: 'Please input module name',
        pleaseInputMenuNameCn: 'Please input module Chinese name',
        pleaseInputMenuNameEn: 'Please input module English name'
      },
      
      // Program Management
      program: {
        title: 'Program Management',
        programCode: 'Program Code',
        programName: 'Program Name',
        programNameCn: 'Chinese Name',
        programNameEn: 'English Name',
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
        pleaseInputProgramNameCn: 'Please input program Chinese name',
        pleaseInputProgramNameEn: 'Please input program English name',
        pleaseSelectDomain: 'Please select domain',
        pleaseSelectModule: 'Please select module'
      },
      
      // Role Management
      role: {
        title: 'Role Management',
        roleCode: 'Role Code',
        roleName: 'Role Name',
        roleNameCn: 'Role Chinese Name',
        roleNameEn: 'Role English Name',
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
    },
    // Department Information
    departmentInfo: {
      title: 'Department Information',
      departmentCode: 'Department Code',
      departmentName: 'Department Name',
      departmentNameCn: 'Department Name (CN)',
      departmentNameEn: 'Department Name (EN)',
      departmentLevelName: 'Department Level',
      description: 'Description',
      landline: 'Landline',
      email: 'Email',
      address: 'Address',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      sortOrder: 'Sort Order',
      departmentLevelId: 'Department Level',
      remark: 'Remark',
      operation: 'Operation',
      addDepartment: 'Add Department',
      addChild: 'Add Child',
      addChildDepartment: 'Add Child Department',
      editDepartment: 'Edit Department',
      deleteConfirm: 'Are you sure to delete this department?',
      hasChildrenCannotDelete: 'This department has child departments and cannot be deleted',
      pleaseInputCode: 'Please enter department code',
      pleaseInputName: 'Please enter department name',
      pleaseInputNameCn: 'Please enter department name (CN)',
      pleaseInputNameEn: 'Please enter department name (EN)',
      pleaseInputSortOrder: 'Please enter sort order',
      pleaseInputLandline: 'Please input landline',
      pleaseInputEmail: 'Please input email',
      pleaseInputAddress: 'Please input address',
      pleaseSelectDepartmentLevel: 'Please select department level',
      pleaseCompleteForm: 'Please complete the form',
      index: 'Index',
      saveSuccess: 'Save successful',
      updateSuccess: 'Update successful',
      deleteSuccess: 'Delete successful',
      operationFailed: 'Operation failed',
      getFailed: 'Failed to get data',
      filter: {
        departmentCode: 'Department Code',
        departmentName: 'Department Name'
      }
    },
    // Dictionary Info Management
    dictionaryInfo: {
      title: 'Dictionary Info Management',
      index: 'No.',
      dicType: 'Dictionary Type',
      dicCode: 'Dictionary Code',
      dicName: 'Dictionary Name',
      createdDate: 'Created Date',
      operation: 'Operation',
      addDictionary: 'Add Dictionary',
      editDictionary: 'Edit Dictionary Info',
      deleteConfirm: 'Are you sure to delete this record?',
      pleaseInputDicCode: 'Please input dictionary code',
      pleaseInputDicName: 'Please input dictionary name',
      pleaseSelectDicType: 'Please select dictionary type',
      saveSuccess: 'Save successfully',
      updateSuccess: 'Update successfully',
      deleteSuccess: 'Delete successfully',
      operationFailed: 'Operation failed',
      getFailed: 'Failed to get data',
      filter: {
        dicType: 'Dictionary Type'
      },
      dicTypes: {
        Bit: 'Byte Type',
        Int: 'Numeric Type'
      }
    },
    // Department Level Management
    departmentLevel: {
      title: 'Department Level Management',
      index: 'No.',
      departmentLevelCode: 'Level No.',
      departmentLevelName: 'Level Name',
      departmentLevelNameCn: 'Level Chinese Name',
      departmentLevelNameEn: 'Level English Name',
      departmentLevelDescribe: 'Level Description',
      operation: 'Operation',
      addDepartmentLevel: 'Add Department Level',
      editDepartmentLevel: 'Edit Department Level',
      deleteConfirm: 'Are you sure to delete this department level?',
      pleaseInputDepartmentLevelCode: 'Please input level number',
      pleaseInputDepartmentLevelName: 'Please input level name',
      pleaseInputDepartmentLevelNameCn: 'Please input level Chinese name',
      pleaseInputDepartmentLevelNameEn: 'Please input level English name',
      pleaseInputDepartmentLevelDescribe: 'Please input level description',
      fillRequiredInfo: 'Please fill in the required information',
      saveSuccess: 'Save successfully',
      updateSuccess: 'Update successfully',
      deleteSuccess: 'Delete successfully',
      operationFailed: 'Operation failed',
      getFailed: 'Failed to get data'
    }
  }
} 