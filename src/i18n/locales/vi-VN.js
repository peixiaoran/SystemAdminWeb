export default {
  // Phổ biến
  common: {
    systemTitle: 'Hệ thống Quản lý SystemsAdmin',
    confirm: 'Xác nhận',
    cancel: 'Hủy',
    save: 'Lưu',
    delete: 'Xóa',
    edit: 'Chỉnh sửa',
    add: 'Thêm',
    search: 'Tìm kiếm',
    reset: 'Đặt lại',
    success: 'Thành công',
    failed: 'Thất bại',
    loading: 'Đang tải...',
    noData: 'Không có dữ liệu',
    logout: 'Đăng xuất',
    safeLogout: 'Đăng xuất an toàn',
    confirmLogout: 'Bạn có chắc chắn muốn đăng xuất?',
    tip: 'Mẹo',
    warning: 'Cảnh báo',
    enter: 'Vào',
    backToHome: 'Trở về trang chủ',
    home: 'Trang chủ',
    personalInfo: 'Thông tin cá nhân',
    changePassword: 'Đổi mật khẩu',
    refreshPage: 'Làm mới trang',
    closeCurrentTab: 'Đóng tab hiện tại',
    closeOtherTabs: 'Đóng các tab khác',
    closeAllTabs: 'Đóng tất cả tab',
  },
  
  // Trang đăng nhập
  login: {
    title: 'Hệ thống Quản lý Vue Admin',
    username: 'Tên người dùng',
    password: 'Mật khẩu',
    factory: 'Nhà máy',
    language: 'Ngôn ngữ',
    loginButton: 'Đăng nhập',
    usernamePlaceholder: 'Vui lòng nhập tên người dùng',
    passwordPlaceholder: 'Vui lòng nhập mật khẩu',
    factoryPlaceholder: 'Vui lòng chọn nhà máy',
    languagePlaceholder: 'Vui lòng chọn ngôn ngữ',
    usernameRequired: 'Vui lòng nhập tên người dùng',
    passwordRequired: 'Vui lòng nhập mật khẩu',
    factoryRequired: 'Vui lòng chọn nhà máy',
    loginFailed: 'Đăng nhập thất bại',
    loginFailedTip: 'Yêu cầu đăng nhập thất bại, vui lòng thử lại sau',
    factories: {
      ESK: 'Kunshan Yisheng',
      ETW: 'Yisheng Đài Loan',
      ESW: 'Wuxi Xinguan',
      ESD: 'Dongguan Yihong',
      ESC: 'Yantai Zhengyi',
      EMY: 'Malaysia',
      EMJ: 'Malaysia',
      ESV: 'Việt Nam',
      EST: 'Mexico MUSG',
      ESH: 'Singapore ESONSG',
      ESM: 'Monterrey',
      MTY: 'Singapore ESONSG'
    },
    languages: {
      'zh-CN': 'Tiếng Trung Giản thể',
      'zh-TW': 'Tiếng Trung Phồn thể',
      'en-US': 'Tiếng Anh',
      'vi-VN': 'Tiếng Việt'
    }
  },
  
  // Trang chọn mô-đun
  moduleSelect: {
    userInfo: 'Thông tin cá nhân',
    accountSettings: 'Cài đặt tài khoản',
    moduleLoading: 'Đang tải dữ liệu...',
    moduleError: 'Không thể lấy dữ liệu mô-đun',
    moduleErrorRetry: 'Không thể lấy dữ liệu mô-đun, vui lòng thử lại sau',
    moduleIncomplete: 'Thông tin mô-đun không đầy đủ'
  },
  
  // Tiêu đề định tuyến
  route: {
    login: 'Đăng nhập',
    moduleSelect: 'Mô-đun hệ thống',
    notFound: '404',
    forbidden: '403',
    systemBasicmgmt: 'Quản lý cơ bản hệ thống',
    systemMgmt: 'Mô-đun quản lý hệ thống',
    role: 'Quản lý vai trò',
    domain: 'Quản lý miền',
    module: 'Quản lý mô-đun',
    program: 'Quản lý chương trình',
    roleDomain: 'Liên kết vai trò - miền',
    roleModule: 'Liên kết vai trò - mô-đun',
    roleProgram: 'Liên kết vai trò - chương trình',
    systemBasicData: 'Mô-đun dữ liệu cơ bản',
    userInfo: 'Quản lý thông tin nhân viên',
    companyInfo: 'Quản lý thông tin công ty'
  },
  
  // Quản lý cơ bản hệ thống
  systemBasicmgmt: {
    // Thẻ trạng thái hệ thống
    systemStatus: {
      cpuUsage: 'Sử dụng CPU',
      memoryUsage: 'Sử dụng bộ nhớ',
      diskUsage: 'Sử dụng ổ đĩa',
      systemLoad: 'Tải hệ thống',
      normal: 'Bình thường',
      warning: 'Cảnh báo',
      danger: 'Nguy hiểm',
      cores: 'lõi',
      threads: 'luồng',
      lastMinutes: '15 phút gần đây'
    },
    // Xu hướng sử dụng tài nguyên
    resourceTrend: {
      title: 'Xu hướng sử dụng tài nguyên',
      hour: '1 Giờ',
      day: '24 Giờ',
      week: '7 Ngày',
      month: '30 Ngày',
      placeholder: 'Biểu đồ xu hướng sử dụng tài nguyên (thành phần biểu đồ thực tế ở đây)'
    },
    // Thông tin hệ thống
    systemInfo: {
      title: 'Thông tin hệ thống',
      refresh: 'Làm mới',
      os: 'Hệ điều hành',
      serverIp: 'IP máy chủ',
      systemTime: 'Thời gian hệ thống',
      uptime: 'Thời gian hoạt động',
      cpuModel: 'Mẫu CPU',
      memoryCapacity: 'Dung lượng bộ nhớ',
      diskSpace: 'Không gian ổ đĩa',
      systemVersion: 'Phiên bản hệ thống'
    },
    // Trạng thái dịch vụ
    serviceStatus: {
      title: 'Trạng thái dịch vụ',
      refresh: 'Làm mới',
      restartAll: 'Khởi động lại tất cả',
      running: 'Đang chạy',
      stopped: 'Đã dừng',
      warning: 'Cảnh báo',
      stop: 'Dừng',
      start: 'Bắt đầu',
      restart: 'Khởi động lại'
    },
    // Nhật ký hệ thống
    systemLog: {
      title: 'Nhật ký hệ thống',
      time: 'Thời gian',
      level: 'Cấp độ',
      module: 'Mô-đun',
      content: 'Nội dung',
      operation: 'Thao tác',
      details: 'Chi tiết',
      viewMore: 'Xem thêm',
      logType: 'Loại nhật ký',
      all: 'Tất cả',
      error: 'Lỗi',
      warning: 'Cảnh báo',
      info: 'Thông tin'
    },
    // Bản ghi sao lưu
    backupRecord: {
      title: 'Bản ghi sao lưu',
      backupNow: 'Sao lưu ngay',
      restore: 'Khôi phục',
      delete: 'Xóa'
    },
    // Thông báo hệ thống
    systemNotice: {
      title: 'Thông báo hệ thống',
      publish: 'Đăng thông báo',
      noticeTitle: 'Tiêu đề',
      type: 'Loại',
      publisher: 'Người đăng',
      publishTime: 'Thời gian đăng',
      operation: 'Thao tác',
      view: 'Xem',
      delete: 'Xóa',
      maintenance: 'Bảo trì',
      update: 'Cập nhật',
      security: 'Bảo mật',
      announcement: 'Thông báo'
    },
    // Thao tác nhanh
    quickAction: {
      title: 'Thao tác nhanh'
    },
    // Thông tin công ty
    companyInfo: {
      title: 'Thông tin công ty',
      companyNameCn: 'Tên tiếng Trung',
      companyNameEn: 'Tên tiếng Anh',
      companyPhone: 'Điện thoại công ty',
      companyFax: 'Fax công ty',
      createdTime: 'Thời gian tạo',
      remark: 'Ghi chú',
      operation: 'Thao tác',
      addCompany: 'Thêm công ty',
      editCompany: 'Chỉnh sửa thông tin công ty',
      deleteConfirm: 'Bạn có chắc chắn muốn xóa bản ghi này không?',
      pleaseInputNameCn: 'Vui lòng nhập tên tiếng Trung',
      pleaseInputNameEn: 'Vui lòng nhập tên tiếng Anh',
      index: 'STT',
      saveSuccess: 'Lưu thành công',
      updateSuccess: 'Cập nhật thành công',
      deleteSuccess: 'Xóa thành công',
      operationFailed: 'Thao tác thất bại',
      getFailed: 'Không thể lấy dữ liệu'
    },
    // Thông tin người dùng
    userInfo: {
      title: 'Thông tin người dùng',
      companyNameCn: 'Tên tiếng Trung',
      companyNameEn: 'Tên tiếng Anh',
      companyPhone: 'Điện thoại công ty',
      companyFax: 'Fax công ty',
      createdTime: 'Thời gian tạo',
      remark: 'Ghi chú',
      operation: 'Thao tác',
      addUser: 'Thêm người dùng',
      editUser: 'Chỉnh sửa thông tin người dùng',
      deleteConfirm: 'Bạn có chắc chắn muốn xóa bản ghi này không?',
      pleaseInputNameCn: 'Vui lòng nhập tên tiếng Trung',
      pleaseInputNameEn: 'Vui lòng nhập tên tiếng Anh',
      index: 'STT',
      saveSuccess: 'Lưu thành công',
      updateSuccess: 'Cập nhật thành công',
      deleteSuccess: 'Xóa thành công',
      operationFailed: 'Thao tác thất bại',
      getFailed: 'Không thể lấy dữ liệu'
    },
    // Quản lý hệ thống
    systemMgmt: {
      // Mục chung
      index: 'STT',
      operation: 'Thao tác',
      remark: 'Ghi chú',
      remarks: 'Ghi chú',
      isEnabled: 'Đã kích hoạt',
      isVisible: 'Hiển thị',
      enabled: 'Kích hoạt',
      disabled: 'Vô hiệu hóa',
      visible: 'Hiển thị',
      hidden: 'Ẩn',
      createdBy: 'Người tạo',
      createdTime: 'Thời gian tạo',
      updateBindings: 'Cập nhật liên kết',
      selectPlaceholder: 'Vui lòng chọn',
      inputPlaceholder: 'Vui lòng nhập',
      fillRequiredInfo: 'Vui lòng điền thông tin bắt buộc',
      invalidId: 'ID không hợp lệ',
      
      // Quản lý miền
      domain: {
        title: 'Quản lý miền',
        domainCode: 'Mã miền',
        domainName: 'Tên miền',
        domainIcon: 'Biểu tượng miền',
        sortOrder: 'Thứ tự sắp xếp',
        roleCode: 'Mã vai trò',
        pagePath: 'Đường dẫn trang',
        component: 'Thành phần',
        target: 'Mục tiêu',
        addDomain: 'Thêm miền',
        editDomain: 'Sửa thông tin miền',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa bản ghi này không?',
        pleaseInputDomainCode: 'Vui lòng nhập mã miền',
        pleaseInputDomainName: 'Vui lòng nhập tên miền'
      },
      
      // Quản lý mô-đun
      module: {
        title: 'Quản lý mô-đun',
        domain: 'Miền',
        menuCode: 'Mã mô-đun',
        menuName: 'Tên mô-đun',
        menuIcon: 'Biểu tượng mô-đun',
        sortOrder: 'Thứ tự sắp xếp',
        menuUrl: 'URL mô-đun',
        level: 'Cấp độ',
        roleCode: 'Mã vai trò',
        pagePath: 'Đường dẫn trang',
        component: 'Thành phần',
        target: 'Mục tiêu',
        addModule: 'Thêm mô-đun',
        editModule: 'Sửa thông tin mô-đun',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa bản ghi này không?',
        pleaseSelectDomain: 'Vui lòng chọn miền',
        pleaseInputMenuCode: 'Vui lòng nhập mã mô-đun',
        pleaseInputMenuName: 'Vui lòng nhập tên mô-đun'
      },
      
      // Quản lý chương trình
      program: {
        title: 'Quản lý chương trình',
        programCode: 'Mã chương trình',
        programName: 'Tên chương trình',
        domain: 'Miền',
        module: 'Mô-đun',
        programIcon: 'Biểu tượng chương trình',
        sortOrder: 'Thứ tự sắp xếp',
        pagePath: 'Đường dẫn trang',
        programType: 'Loại chương trình',
        roleCode: 'Mã vai trò',
        apiRoute: 'Đường dẫn API',
        component: 'Thành phần',
        target: 'Mục tiêu',
        addProgram: 'Thêm chương trình',
        editProgram: 'Sửa thông tin chương trình',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa bản ghi này không?',
        pleaseInputProgramCode: 'Vui lòng nhập mã chương trình',
        pleaseInputProgramName: 'Vui lòng nhập tên chương trình',
        pleaseSelectDomain: 'Vui lòng chọn miền',
        pleaseSelectModule: 'Vui lòng chọn mô-đun'
      },
      
      // Quản lý vai trò
      role: {
        title: 'Quản lý vai trò',
        roleCode: 'Mã vai trò',
        roleName: 'Tên vai trò',
        description: 'Mô tả',
        addRole: 'Thêm vai trò',
        editRole: 'Sửa thông tin vai trò',
        deleteConfirm: 'Bạn có chắc chắn muốn xóa bản ghi này không?',
        pleaseInputRoleCode: 'Vui lòng nhập mã vai trò',
        pleaseInputRoleName: 'Vui lòng nhập tên vai trò'
      },
      
      // Quản lý vai trò - miền
      roleDomain: {
        title: 'Quản lý vai trò - miền',
        role: 'Vai trò',
        domain: 'Miền',
        isBinding: 'Liên kết',
        pleaseSelectRole: 'Vui lòng chọn vai trò trước',
        pleaseSelectDomain: 'Vui lòng chọn miền trước',
        updateBindingsSuccess: 'Cập nhật liên kết thành công'
      },
      
      // Quản lý vai trò - mô-đun
      roleModule: {
        title: 'Quản lý vai trò - mô-đun',
        role: 'Vai trò',
        domain: 'Miền',
        module: 'Mô-đun',
        isBinding: 'Liên kết',
        pleaseSelectRole: 'Vui lòng chọn vai trò trước',
        pleaseSelectDomain: 'Vui lòng chọn miền trước',
        updateBindingsSuccess: 'Cập nhật liên kết thành công'
      },
      
      // Quản lý vai trò - chương trình
      roleProgram: {
        title: 'Quản lý vai trò - chương trình',
        role: 'Vai trò',
        domain: 'Miền',
        module: 'Mô-đun',
        program: 'Chương trình',
        isBinding: 'Liên kết',
        pleaseSelectRole: 'Vui lòng chọn vai trò trước',
        pleaseSelectDomain: 'Vui lòng chọn miền trước',
        pleaseSelectModule: 'Vui lòng chọn mô-đun trước',
        updateBindingsSuccess: 'Cập nhật liên kết thành công'
      }
    }
  }
} 