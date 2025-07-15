export default {
  // Common
  common: {
    systemTitle: 'SystemsAdmin Management System',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
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
    goBack: 'Go Back',
    tokenExpired: 'Login expired, please login again',
    saveSuccess: 'Save Successfully',
    deleteSuccess: 'Delete Successfully',
    operationFailed: 'Operation Failed',
    confirmDelete: 'Confirm Delete',
    active: 'Active',
    inactive: 'Inactive'
  },
  
  // Error Pages
  error: {
    pageNotFound: 'Sorry, the page you visited does not exist or has been removed',
    accessDenied: 'Sorry, you do not have permission to access this page',
    access: 'Access',
    denied: 'Denied'
  },
  
  // Login Page
  login: {
    title: 'Vue Admin Management System',
    username: 'Employee Name',
    password: 'Password',
    factory: 'Factory',
    language: 'Language',
    loginButton: 'Login',
    usernamePlaceholder: 'Please enter employee name',
    passwordPlaceholder: 'Please enter password',
    factoryPlaceholder: 'Please select factory',
    languagePlaceholder: 'Please select language',
    usernameRequired: 'Please enter employee name',
    passwordRequired: 'Please enter password',
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
      ESV: 'Vietnam Factory',
      EST: 'Mexico MUSG',
      ESH: 'Singapore ESONSG',
      ESM: 'Monterrey',
      MTY: 'Singapore ESONSG'
    },
    languages: {
      'zh-TW': '中文繁體',
      'en-US': 'English'
    }
  },
  
  // Module Selection Page
  moduleSelect: {
    userInfo: 'Personal Info',
    accountSettings: 'Account Settings',
    moduleLoading: 'Loading data...',
    moduleError: 'Failed to get module data',
    moduleErrorRetry: 'Failed to get module data, please try again later',
    moduleIncomplete: 'Module information incomplete'
  },
  
  // Route Titles
  route: {
    login: 'Login',
    moduleSelect: 'System Modules',
    notFound: 'Page Not Found',
    forbidden: 'Access Denied',
    SystemBasicMgmt: 'System Basic Management',
    systemMgmt: 'System Management Module',
    role: 'Role Data Maintenance',
    domain: 'Domain Data Maintenance',
    module: 'Module Data Maintenance',
    program: 'Program Data Maintenance',
    roleDomain: 'Role Domain Binding',
    roleModule: 'Role Module Binding',
    roleProgram: 'Role Program Binding',
    systemBasicData: 'Basic Data Module',
    userInfo: 'Employee Information Maintenance',
    userAgent: 'Employee Agent Maintenance',
    userPosition: 'Position Information Maintenance',
    companyInfo: 'Company Data Maintenance',
    departmentInfo: 'Department Data Maintenance',
    departmentLevel: 'Department Level Maintenance',
    SystemSettings: 'System Settings Module',
    dictionaryInfo: 'Dictionary Data Maintenance',
    currencyInfo: 'Currency Data Maintenance',
    personalInfo: 'Personal Information Management',
    exchangerateInfo: 'Exchange Rate Data Maintenance'
  },
  
  // System Basic Management
  SystemBasicMgmt: {
    // Currency Information Management
    currencyInfo: {
      title: 'Currency Information Management',
      index: 'Index',
      currencyCode: 'Currency Code',
      currencyNameCh: 'Currency Chinese Name',
      currencyNameEn: 'Currency English Name',
      currencyState: 'Enable Status',
      remark: 'Remark',
      operation: 'Operation',
      addCurrency: 'Add Currency',
      editCurrency: 'Edit Currency Information',
      deleteConfirm: 'Are you sure you want to delete this record?',
      pleaseInputCurrencyCode: 'Please enter currency code',
      pleaseInputCurrencyNameCh: 'Please enter currency Chinese name',
      pleaseInputCurrencyNameEn: 'Please enter currency English name',
      pleaseInputRemark: 'Please enter remark',
      saveSuccess: 'Save Successfully',
      updateSuccess: 'Update Successfully',
      deleteSuccess: 'Delete Successfully',
      operationFailed: 'Operation Failed',
      getFailed: 'Failed to get data',
      filter: {
        currencyCode: 'Currency Code'
      }
    },
    
    // Exchange Rate Information Management
    exchangeRateInfo: {
      title: 'Exchange Rate Information Management',
      index: 'Index',
      currencyCode: 'Base Currency',
      exchangeCurrencyCode: 'Exchange Currency',
      exchangeRate: 'Exchange Rate',
      remark: 'Remark',
      operation: 'Operation',
      addExchangeRate: 'Add Exchange Rate',
      editExchangeRate: 'Edit Exchange Rate Information',
      deleteConfirm: 'Are you sure you want to delete this record?',
      pleaseSelectCurrencyCode: 'Please select base currency',
      pleaseInputExchangeCurrencyCode: 'Please enter exchange currency',
      pleaseSelectExchangeCurrencyCode: 'Please select exchange currency',
      pleaseInputExchangeRate: 'Please enter exchange rate',
      pleaseInputRemark: 'Please enter remark',
      saveSuccess: 'Save Successfully',
      updateSuccess: 'Update Successfully',
      deleteSuccess: 'Delete Successfully',
      operationFailed: 'Operation Failed',
      getFailed: 'Failed to get data',
      filter: {
        currencyCode: 'Base Currency'
      }
    }
  }
}
