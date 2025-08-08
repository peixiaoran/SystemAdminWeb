<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">
          
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="用户筛选">
             <el-form-item :label="$t('SystemBasicMgmt.userInfo.filter.department')">
                <el-tree-select 
                      v-model="filters.departmentId"
                      :data="departmentOptions || []"
                      :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList' }"
                      check-strictly
                      filterable
                      :filter-node-method="filterNodeMethod"
                      style="width: 200px;"
                      :placeholder="$t('SystemBasicMgmt.userInfo.pleaseSelectDepartment')" />
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.userInfo.filter.position')">
                  <el-select 
                      v-model="filters.positionId" 
                      style="width: 180px;"
                      :placeholder="$t('SystemBasicMgmt.userInfo.pleaseSelectPosition')">
                      <el-option
                          v-for="item in positionOptions"
                          :key="`position-filter-${item.positionId}`"
                          :label="item.positionName"
                          :value="item.positionId" />
                  </el-select>
              </el-form-item>

              <el-form-item class="form-button-group">
                  <el-button type="primary" @click="handleSearch" plain>
                      {{ $t('common.search') }}
                  </el-button>
              </el-form-item>
              <el-form-item class="form-right-button">
                  <el-button type="primary" @click="handleAdd">
                      {{ $t('SystemBasicMgmt.userInfo.addUser') }}
                  </el-button>
              </el-form-item>
          </el-form>
          
          <div class="table-container">
              <el-table :data="userList"
                        border
                        stripe
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('SystemBasicMgmt.userInfo.index')" width="70" align="center" fixed />
                  <el-table-column prop="userNo" :label="$t('SystemBasicMgmt.userInfo.userNo')" align="center" min-width="150" />
                  <el-table-column prop="userNameCh" :label="$t('SystemBasicMgmt.userInfo.userNameCh')" align="left" min-width="150" />
                  <el-table-column prop="userNameEn" :label="$t('SystemBasicMgmt.userInfo.userNameEn')" align="left" min-width="230" />
                  <el-table-column prop="departmentName" :label="$t('SystemBasicMgmt.userInfo.department')" align="left" min-width="180" />
                  <el-table-column prop="positionName" :label="$t('SystemBasicMgmt.userInfo.position')" align="left" min-width="120" />
                  <el-table-column prop="genderName" :label="$t('SystemBasicMgmt.userInfo.gender')" align="center" min-width="100" />
                  <el-table-column prop="email" :label="$t('SystemBasicMgmt.userInfo.email')" align="left" min-width="200" />
                  <el-table-column :label="$t('SystemBasicMgmt.userInfo.isEmployed')" align="center" min-width="130">
                      <template #default="scope">
                          <el-tag :type="scope.row.isEmployed === 1 ? 'success' : 'info'">
                              {{ scope.row.isEmployedName }}
                          </el-tag>
                      </template>
                  </el-table-column>
                  <el-table-column :label="$t('SystemBasicMgmt.userInfo.isApproval')" align="center" min-width="130">
                      <template #default="scope">
                          <el-tag :type="scope.row.isApproval === 1 ? 'success' : 'info'">
                              {{ scope.row.isApprovalName }}
                          </el-tag>
                      </template>
                  </el-table-column>
                  <el-table-column :label="$t('SystemBasicMgmt.userInfo.isParttimed')" align="center" min-width="130">
                      <template #default="scope">
                          <el-tag :type="scope.row.isParttimed === 1 ? 'success' : 'info'">
                              {{ scope.row.isParttimedName }}
                          </el-tag>
                      </template>
                  </el-table-column>
                  <el-table-column prop="laborName" :label="$t('SystemBasicMgmt.userInfo.laborName')" align="center" min-width="180">
                      <template #default="scope">
                          <span :style="{
                               color: scope.row.laborType === '1' ? '#faad14' : 
                                      scope.row.laborType === '2' ? '#13c2c2' : 
                                      scope.row.laborType === '3' ? '#1890ff' : 
                                      scope.row.laborType === '4' ? '#722ed1' : '#000'
                                      }">
                              {{ scope.row.laborName }}
                          </span>
                      </template>
                  </el-table-column>
                  <el-table-column :label="$t('SystemBasicMgmt.userInfo.operation')" min-width="170" fixed="right" align="center">
                      <template #default="scope">
                          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
                          <el-button size="small"
                                     type="danger"
                                     @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </div>
          
          <div class="pagination-wrapper">
              <el-pagination v-model:current-page="pagination.pageIndex"
                             v-model:page-size="pagination.pageSize"
                             :page-sizes="[10, 20, 50, 100]"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="pagination.total"
                             @size-change="handleSizeChange"
                             @current-change="handlePageChange" />
          </div>
      </el-card>
      
      <el-dialog v-model="dialogVisible"
                     :title="dialogTitle"
                     width="70%"
                     :close-on-click-modal="false"
                     :append-to-body="true"
                     :modal-append-to-body="true"
                     :lock-scroll="true"
                     @close="handleDialogClose">
              <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="用户编辑">
              
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.userNo')" prop="userNo">
                      <el-input v-model="editForm.userNo" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.userNameCh')" prop="userNameCh">
                      <el-input v-model="editForm.userNameCh" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.userNameEn')" prop="userNameEn">
                      <el-input v-model="editForm.userNameEn" style="width:100%" />
                  </el-form-item>
              </div>
              
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.gender')" prop="gender">
                      <el-select v-model="editForm.gender" style="width:100%" clearable :placeholder="$t('SystemBasicMgmt.userInfo.pleaseSelectGender')">
                          <el-option 
                              v-for="item in genderOptions"
                              :key="`gender-${item.genderCode}`"
                              :label="item.genderName"
                              :value="item.genderCode" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.hireDate')" prop="hireDate">
                      <el-date-picker
                          v-model="editForm.hireDate"
                          type="date"
                          style="width:100%"
                          :placeholder="$t('SystemBasicMgmt.userInfo.pleaseSelectHireDate')"
                          format="YYYY/MM/DD"
                          value-format="YYYY/MM/DD" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.laborType')" prop="laborId">
                      <el-select 
                          v-model="editForm.laborId" 
                          style="width:100%"
                          clearable
                          :placeholder="$t('SystemBasicMgmt.userInfo.pleaseSelectLaborType')">
                          <el-option
                              v-for="item in laborTypeOptions"
                              :key="`labor-type-edit-${item.laborId}`"
                              :label="item.laborName"
                              :value="item.laborId" />
                      </el-select>
                  </el-form-item>
              </div>
              
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.department')" prop="departmentId">
                      <el-tree-select
                          v-model="editForm.departmentId"
                          :data="departmentOptions || []"
                          :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList' }"
                          check-strictly
                          filterable
                          clearable
                          :filter-node-method="filterNodeMethod"
                          style="width:100%"
                          :placeholder="$t('SystemBasicMgmt.userInfo.pleaseSelectDepartment')" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.position')" prop="positionId">
                      <el-select 
                          v-model="editForm.positionId" 
                          style="width:100%"
                          clearable
                          :placeholder="$t('SystemBasicMgmt.userInfo.pleaseSelectPosition')">
                          <el-option
                              v-for="item in positionOptions"
                              :key="`position-edit-${item.positionId}`"
                              :label="item.positionName"
                              :value="item.positionId" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.role')" prop="roleId">
                      <el-select 
                          v-model="editForm.roleId" 
                          style="width:100%"
                          clearable
                          :placeholder="$t('SystemBasicMgmt.userInfo.pleaseSelectRole')">
                          <el-option
                              v-for="item in roleOptions"
                              :key="`role-edit-${item.roleId}`"
                              :label="item.roleName"
                              :value="item.roleId" />
                      </el-select>
                  </el-form-item>
              </div>
              
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.loginNo')" prop="loginNo">
                      <el-input v-model="editForm.loginNo" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.password')" prop="passWord">
                      <el-input v-model="editForm.passWord" type="password" style="width:100%" show-password />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.email')" prop="email">
                      <el-input v-model="editForm.email" style="width:100%" />
                  </el-form-item>
              </div>
              
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.phoneNumber')">
                      <el-input v-model="editForm.phoneNumber" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.expirationDays')" prop="expirationDays">
                      <el-select v-model="editForm.expirationDays" style="width:100%" clearable :placeholder="$t('SystemBasicMgmt.userInfo.pleaseInputExpirationDays')">
                          <el-option :label="$t('SystemBasicMgmt.userInfo.expirationDaysOptions.30')" :value="30" />
                          <el-option :label="$t('SystemBasicMgmt.userInfo.expirationDaysOptions.60')" :value="60" />
                          <el-option :label="$t('SystemBasicMgmt.userInfo.expirationDaysOptions.90')" :value="90" />
                          <el-option :label="$t('SystemBasicMgmt.userInfo.expirationDaysOptions.180')" :value="180" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.isEmployed')">
                      <el-switch
                          v-model="editForm.isEmployed"
                          :active-value="1"
                          :inactive-value="0"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                  </el-form-item>
              </div>
              
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.isApproval')">
                      <el-switch
                          v-model="editForm.isApproval"
                          :active-value="1"
                          :inactive-value="0"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.isRealtimeNotification')">
                      <el-switch
                          v-model="editForm.isRealtimeNotification"
                          :active-value="1"
                          :inactive-value="0"
                          :disabled="editForm.isApproval === 0"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.isScheduledNotification')">
                      <el-switch
                          v-model="editForm.isScheduledNotification"
                          :active-value="1"
                          :inactive-value="0"
                          :disabled="editForm.isApproval === 0"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                  </el-form-item>
              </div>
              
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.isAgent')">
                      <el-switch
                          v-model="editForm.isAgent"
                          :active-value="1"
                          :inactive-value="0"
                          :disabled="true"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.isParttimed')">
                      <el-switch
                          v-model="editForm.isParttimed"
                          :active-value="1"
                          :inactive-value="0"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.isFreeze')">
                      <el-switch
                          v-model="editForm.isFreeze"
                          :active-value="1"
                          :inactive-value="0"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                  </el-form-item>
              </div>
              
              <div class="form-row full-width">
                  <el-form-item :label="$t('SystemBasicMgmt.userInfo.avatar')" prop="avatarAddress">
                    <el-upload
                        class="avatar-uploader"
                        :action="UPLOAD_CONFIG.url"
                        :headers="UPLOAD_CONFIG.headers"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        accept=".jpg,.jpeg,.png"
                        >
                        <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                      <div class="avatar-tip">{{ $t('SystemBasicMgmt.userInfo.avatarTip') }}</div>
                  </el-form-item>
              </div>

          </el-form>
          <template #footer>
              <span class="dialog-footer">
                  <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
                  <el-button type="primary" @click="handleSave">{{ $t('common.confirm') }}</el-button>
              </span>
          </template>
      </el-dialog>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, nextTick, watch } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import { post } from '@/utils/request'
  import { 
      GET_USER_PAGES_API, 
      INSERT_USER_API, 
      DELETE_USER_API, 
      GET_USER_ENTITY_API, 
      UPDATE_USER_API,
      GET_DEPARTMENT_DROPDOWN_API,
      GET_USER_POSITION_DROPDOWN_API,
      GET_ROLE_DROPDOWN_API,
      GET_GENDER_DROPDOWN_API,
      GET_LABOR_TYPE_DROPDOWN_API,
      UPLOAD_AVATAR_API
  } from '@/config/api/SystemBasicMgmt/System-BasicData/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { useUserStore } from '@/stores/user'

  // 初始化i18n
  const { t } = useI18n()
  
  // 初始化用户存储
  const userStore = useUserStore()
  
  // 统一的文件上传配置
  const UPLOAD_CONFIG = reactive({
    url: 'https://localhost:7272/api/SystemBasicMgmt/SystemBasicCoreApi/SysFile/UploadFile',
    headers: {
      'Accept-Language': '',
      'Authorization': `Bearer ${userStore.token}`
    }
  })
  
  // 监听 token 变化，更新上传配置
  watch(() => userStore.token, (newToken) => {
    UPLOAD_CONFIG.headers.Authorization = `Bearer ${newToken}`
  })

  // 员工数据
  const userList = ref([])
  const loading = ref(false)

  // 表单引用
  const editFormRef = ref(null)

  // 下拉选项
  const departmentOptions = ref([])
  const positionOptions = ref([])
  const roleOptions = ref([])
  const genderOptions = ref([])
  const laborTypeOptions = ref([])

  // 分页信息
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
      total: 0
  })

  // 过滤条件
  const filters = reactive({
      departmentId: '',
      positionId: '',
  })

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      userId: '',
      departmentId: '',
      positionId: '',
      userNo: '',
      userNameCh: '',
      userNameEn: '',
      roleId: '',
      gender: '',
      hireDate: '',
      email: '',
      phoneNumber: '',
      loginNo: '',
      passWord: '',
      pwdSalt: '',
      isApproval: 0,
      isParttimed: 0,
      isRealtimeNotification: 0,
      isScheduledNotification: 0,
      isAgent: 0,
      isEmployed: 1,
      isFreeze: 0,
      laborId: '',
      expirationDays: null,
      modifiedBy: '',
      modifiedDate: '',
      avatarAddress: ''
  })

  // 头像上传相关
  const avatarUrl = ref('')
  const avatarFile = ref(null)

  // 存储isApproval关闭前的通知状态
  const previousNotificationState = reactive({
    isRealtimeNotification: 0,
    isScheduledNotification: 0
  })

  // 对话框标题
  const dialogTitle = ref(t('SystemBasicMgmt.userInfo.editUser'))

  // 表单验证规则
  const formRules = reactive({
      userNo: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseInputUserNo'), trigger: 'blur' }
      ],
      userNameCh: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseInputUserNameCh'), trigger: 'blur' }
      ],
      userNameEn: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseInputUserNameEn'), trigger: 'blur' }
      ],
      gender: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseSelectGender'), trigger: 'change' }
      ],
      hireDate: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseSelectHireDate'), trigger: 'change' }
      ],
      laborId: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseSelectLaborType'), trigger: 'change' }
      ],
      departmentId: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseSelectDepartment'), trigger: 'change' }
      ],
      positionId: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseSelectPosition'), trigger: 'change' }
      ],
      roleId: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseSelectRole'), trigger: 'change' }
      ],
      loginNo: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseInputLoginNo'), trigger: 'blur' }
      ],
      email: [
          { required: true, message: () => t('SystemBasicMgmt.userInfo.pleaseInputEmail'), trigger: 'blur' }
      ],
      passWord: [
        { 
          validator: (rule, value, callback) => {
            if (!value) {
              callback()
              return
            }
            // 密码长度 8-16 个字符
            if (value.length < 8 || value.length > 16) {
              callback(new Error(t('SystemBasicMgmt.userInfo.passwordLengthError')))
              return
            }
            // 必须包含小写字母
            if (!/[a-z]/.test(value)) {
              callback(new Error(t('SystemBasicMgmt.userInfo.passwordLowercaseError')))
              return
            }
            // 必须包含大写字母
            if (!/[A-Z]/.test(value)) {
              callback(new Error(t('SystemBasicMgmt.userInfo.passwordUppercaseError')))
              return
            }
            // 必须包含数字
            if (!/[0-9]/.test(value)) {
              callback(new Error(t('SystemBasicMgmt.userInfo.passwordNumberError')))
              return
            }
            // 必须包含特殊字符
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
              callback(new Error(t('SystemBasicMgmt.userInfo.passwordSpecialCharError')))
              return
            }
            callback()
          }, 
          trigger: 'blur' 
        }
      ]
  })

  // 树形选择器过滤方法
  const filterNodeMethod = (value, data) => data.departmentName.includes(value)

  // 监听isApproval变化
  watch(() => editForm.isApproval, (newValue, oldValue) => {
    // 只有当值真正变化且不是初始化时才执行逻辑
    if (oldValue !== undefined) {
      if (newValue === 0) { // 关闭审批权限
        // 保存当前通知状态
        previousNotificationState.isRealtimeNotification = editForm.isRealtimeNotification
        previousNotificationState.isScheduledNotification = editForm.isScheduledNotification
        // 关闭所有通知
        editForm.isRealtimeNotification = 0
        editForm.isScheduledNotification = 0
      } else if (oldValue === 0) { // 开启审批权限
        // 恢复之前的通知状态
        editForm.isRealtimeNotification = previousNotificationState.isRealtimeNotification
        editForm.isScheduledNotification = previousNotificationState.isScheduledNotification
      }
    }
  }, { immediate: false }) // 设置immediate为false，避免初始化时触发

  // 组件挂载后获取数据
  onMounted(async () => {
      // 获取下拉数据并设置筛选条件默认值
      await fetchDepartmentDropdown(true, false)
      await fetchPositionDropdown(true, false)
      await fetchGenderDropdown()
      await fetchLaborTypeDropdown()
      // 获取用户列表数据
      fetchUserPages()
  })

  // 获取下拉数据
  const fetchDepartmentDropdown = async (setDefaultFilter = false, setDefaultForm = false) => {
      try {
          const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
          if (res && res.code === '200') {
              departmentOptions.value = Array.isArray(res.data) ? res.data : []
              console.log('departmentOptions:', departmentOptions.value)
              // 验证数据结构并过滤无效数据（递归验证部门树结构）
              const validateDepartment = (dept) => {
                  if (!dept || dept.departmentId === undefined || dept.departmentId === null || 
                      dept.departmentName === undefined || dept.departmentName === null) {
                      return false
                  }
                  if (dept.departmentChildList && Array.isArray(dept.departmentChildList)) {
                      dept.departmentChildList = dept.departmentChildList.filter(validateDepartment)
                  }
                  return true
              }
              departmentOptions.value = departmentOptions.value.filter(validateDepartment)
              // 设置筛选条件默认值
              if (setDefaultFilter && departmentOptions.value.length > 0 && !filters.departmentId) {
                  filters.departmentId = departmentOptions.value[0].departmentId
              }
              // 设置编辑表单默认值
              if (setDefaultForm && departmentOptions.value.length > 0 && !editForm.departmentId) {
                  editForm.departmentId = departmentOptions.value[0].departmentId
              }
          } else {
              departmentOptions.value = []
          }
      } catch (error) {
          console.error('获取部门选项失败:', error)
          departmentOptions.value = []
      }
  }

  // 获取职位下拉数据
  const fetchPositionDropdown = async (setDefaultFilter = false, setDefaultForm = false) => {
      try {
          const res = await post(GET_USER_POSITION_DROPDOWN_API.GET_USER_POSITION_DROPDOWN, {})
          if (res && res.code === '200') {
              positionOptions.value = res.data || []
              console.log('positionOptions:', positionOptions.value)
              // 验证数据结构并过滤无效数据
              positionOptions.value = positionOptions.value.filter(item => 
                  item && item.positionId !== undefined && item.positionId !== null && 
                  item.positionName !== undefined && item.positionName !== null
              )
              // 设置筛选条件默认值
              if (setDefaultFilter && positionOptions.value.length > 0 && !filters.positionId) {
                  filters.positionId = positionOptions.value[0].positionId
              }
              // 设置编辑表单默认值
              if (setDefaultForm && positionOptions.value.length > 0 && !editForm.positionId) {
                  editForm.positionId = positionOptions.value[0].positionId
              }
          } else {
              positionOptions.value = []
          }
      } catch (error) {
          console.error('获取职位选项失败:', error)
          positionOptions.value = []
      }
  }

  // 获取角色下拉数据
  const fetchRoleDropdown = async (setDefaultFilter = false, setDefaultForm = false) => {
      try {
          const res = await post(GET_ROLE_DROPDOWN_API.GET_ROLE_DROPDOWN, {})
          if (res && res.code === '200') {
              roleOptions.value = res.data || []
              console.log('roleOptions:', roleOptions.value)
              // 验证数据结构并过滤无效数据
              roleOptions.value = roleOptions.value.filter(item => 
                  item && item.roleId !== undefined && item.roleId !== null && 
                  item.roleName !== undefined && item.roleName !== null
              )
              // 设置筛选条件默认值
              if (setDefaultFilter && roleOptions.value.length > 0 && !filters.roleId) {
                  filters.roleId = roleOptions.value[0].roleId
              }
              // 设置编辑表单默认值
              if (setDefaultForm && roleOptions.value.length > 0 && !editForm.roleId) {
                  editForm.roleId = roleOptions.value[0].roleId
              }
          } else {
              roleOptions.value = []
          }
      } catch (error) {
          console.error('获取角色选项失败:', error)
          roleOptions.value = []
      }
  }

  // 获取性别下拉数据
  const fetchGenderDropdown = async () => {
      try {
          const res = await post(GET_GENDER_DROPDOWN_API.GET_GENDER_DROPDOWN, {})
          if (res && res.code === '200') {
              genderOptions.value = res.data || []
              console.log('genderOptions:', genderOptions.value)
              // 验证数据结构并过滤无效数据
              genderOptions.value = genderOptions.value.filter(item => 
                  item && item.genderCode !== undefined && item.genderCode !== null && 
                  item.genderName !== undefined && item.genderName !== null
              )
          } else {
              genderOptions.value = []
          }
      } catch (error) {
          console.error('获取性别选项失败:', error)
          genderOptions.value = []
      }
  }

  // 获取就业类型下拉数据
  const fetchLaborTypeDropdown = async (setDefaultForm = false) => {
      try {
          const res = await post(GET_LABOR_TYPE_DROPDOWN_API.GET_LABOR_TYPE_DROPDOWN, {})
          if (res && res.code === '200') {
              laborTypeOptions.value = res.data || []
              console.log('laborTypeOptions:', laborTypeOptions.value)
              // 验证数据结构并过滤无效数据
              laborTypeOptions.value = laborTypeOptions.value.filter(item => 
                  item && item.laborId !== undefined && item.laborId !== null && 
                  item.laborName !== undefined && item.laborName !== null
              )
              // 设置编辑表单默认值
              if (setDefaultForm && laborTypeOptions.value.length > 0 && !editForm.laborId) {
                  editForm.laborId = laborTypeOptions.value[0].laborId
              }
          } else {
              laborTypeOptions.value = []
          }
      } catch (error) {
          console.error('获取就业类型失败:', error)
          laborTypeOptions.value = []
      }
  }

  // 获取员工实体
  const fetchUserEntity = async (userId) => {
      const params = {
          userId: userId
      }
      const res = await post(GET_USER_ENTITY_API.GET_USER_ENTITY, params)

      if (res && res.code === '200') {
          // 先保存通知状态，以便在 watch 触发前记录原始值
          if (res.data.isRealtimeNotification !== undefined && res.data.isScheduledNotification !== undefined) {
              previousNotificationState.isRealtimeNotification = res.data.isRealtimeNotification
              previousNotificationState.isScheduledNotification = res.data.isScheduledNotification
          }
          
          Object.assign(editForm, res.data)
          
          // 设置头像显示
          if (res.data.avatarAddress) {
              // 如果头像地址是相对路径，需要拼接完整的URL
              const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
              avatarUrl.value = res.data.avatarAddress.startsWith('http') 
                  ? res.data.avatarAddress 
                  : `${baseUrl}/${res.data.avatarAddress}`
          }
      }
  }

  // 获取员工列表
  const fetchUserPages = async () => {
      loading.value = true
      const params = {
          departmentId: filters.departmentId,
          positionId: filters.positionId,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize
      }
      const res = await post(GET_USER_PAGES_API.GET_USER_PAGES, params)

      if (res && res.code === '200') {

          userList.value = res.data || []
          pagination.total = res.totalNumber || 0
      } else {
          ElMessage({
              message: res.message || t('SystemBasicMgmt.userInfo.getFailed'),
              type: 'error',
              plain: true,
              showClose: true
          })
      }
      loading.value = false
  }

  // 搜索
  const handleSearch = () => {
      pagination.pageIndex = 1
      fetchUserPages()
  }

  // 重置
  const handleReset = () => {
      Object.assign(filters, {
          departmentId: '',
          positionId: '',
          userNo: '',
          userName: '',
          gender: ''
      })
      pagination.pageIndex = 1
  }

  // 分页变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchUserPages()
  }

  // 每页条数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchUserPages()
  }

  const resetForm = () => {
      // 重置表单
      Object.assign(editForm, {
          userId: '',
          userNo: '',
          userNameCh: '',
          userNameEn: '',
          hireDate: '',
          email: '',
          phoneNumber: '',
          loginNo: '',
          passWord: '',
          pwdSalt: '',
          isApproval: 0,
          isParttimed: 0,
          isRealtimeNotification: 0,
          isScheduledNotification: 0,
          isAgent: 0,
          isEmployed: 1,
          isFreeze: 0,
          laborId: '',
          expirationDays: null,
          modifiedBy: '',
          modifiedDate: '',
          avatarAddress: ''
      })
      // 重置通知状态记录
      previousNotificationState.isRealtimeNotification = 0
      previousNotificationState.isScheduledNotification = 0
      // 重置头像
      avatarUrl.value = ''
      avatarFile.value = null
  }

  // 清除表单验证状态
  const clearFormValidation = () => {
      nextTick(() => {
          if (editFormRef.value) {
              try {
                  editFormRef.value.clearValidate()
              } catch (error) {
                  console.warn('清除表单验证状态失败:', error)
              }
          }
      })
  }

  // 插入员工
  const insertUser = async () => {
      const params = {
          ...editForm
      }
      
      const res = await post(INSERT_USER_API.INSERT_USER, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage({
              message: res.message || t('SystemBasicMgmt.userInfo.saveSuccess'),
              type: 'success',
              plain: true,
              showClose: true
          })
          dialogVisible.value = false
          fetchUserPages()
      } else {
          ElMessage({
              message: res.message || t('SystemBasicMgmt.userInfo.operationFailed'),
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 更新员工
  const updateUser = async () => {
      const params = {
          ...editForm
      }
      const res = await post(UPDATE_USER_API.UPDATE_USER, params)
      
      if (res && res.code === '200') {
          resetForm()
          ElMessage({
              message: res.message || t('SystemBasicMgmt.userInfo.updateSuccess'),
              type: 'success',
              plain: true,
              showClose: true
          })
          dialogVisible.value = false
          fetchUserPages()
      } else {
          ElMessage({
              message: res.message || t('SystemBasicMgmt.userInfo.operationFailed'),
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 删除员工
  const deleteUser = async (userId) => {
      const params = {
          userId: userId
      }

      const res = await post(DELETE_USER_API.DELETE_USER, params)

      if (res && res.code === '200') {
          ElMessage({
              message: res.message || t('SystemBasicMgmt.userInfo.deleteSuccess'),
              type: 'success',
              plain: true,
              showClose: true
          })
          fetchUserPages()
      } else {
          ElMessage({
              message: res.message || t('SystemBasicMgmt.userInfo.operationFailed'),
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 添加用户
  const handleAdd = async () => {
      // 重置表单 (resetForm 内部已经初始化了 previousNotificationState)
      resetForm()
      // 重新获取下拉数据并设置编辑表单默认值
      await fetchDepartmentDropdown(false, true)
      await fetchPositionDropdown(false, true)
      await fetchRoleDropdown(false, true)
      await fetchGenderDropdown()
      await fetchLaborTypeDropdown(true)
      // 打开对话框
      dialogTitle.value = t('SystemBasicMgmt.userInfo.addUser')
      // 显示对话框
      dialogVisible.value = true
      // 显示对话框时清除表单验证状态
      clearFormValidation()
  }

  // 编辑用户
  const handleEdit = async (index, row) => {
      // 重置表单
      resetForm()
      // 重新获取下拉数据，编辑时设置默认值
      await fetchDepartmentDropdown(false, false)
      await fetchPositionDropdown(false, false)
      await fetchRoleDropdown(false, false)
      await fetchGenderDropdown()
      await fetchLaborTypeDropdown(false)
      // 获取员工实体 (fetchUserEntity 内部已经初始化了 previousNotificationState)
      await fetchUserEntity(row.userId)
      // 打开对话框
      dialogTitle.value = t('SystemBasicMgmt.userInfo.editUser')
      // 显示对话框
      dialogVisible.value = true
      // 显示对话框时清除表单验证状态
      clearFormValidation()
  }

  // 删除用户
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('SystemBasicMgmt.userInfo.deleteConfirm'),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning',
          }
      )
          .then(() => {
              deleteUser(row.userId)
          })
          .catch(() => {
              // 取消删除
          })
  }

  // 保存编辑
  const handleSave = () => {
      editFormRef.value?.validate((valid) => {
          if (valid) {
              // 判断是新增还是编辑
              if (!editForm.userId) {
                  insertUser()
              } else {
                  updateUser()
              }
          }
      })
  }

  // 头像上传前验证
  const beforeAvatarUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isJPG) {
        ElMessage({
            message: t('SystemBasicMgmt.userInfo.avatarTypeLimit') || '只支持 JPG/PNG 格式!',
            type: 'error',
            plain: true,
            showClose: true
        })
        return false
    }
    if (!isLt5M) {
        ElMessage({
            message: t('SystemBasicMgmt.userInfo.avatarSizeLimit') || '图片大小不能超过 5MB!',
            type: 'error',
            plain: true,
            showClose: true
        })
        return false
    }

    return true
}


  // 自定义上传
  const customUpload = async (options) => {
      try {
          const formData = new FormData()
          formData.append('file', options.file)
          
          const res = await post(UPLOAD_AVATAR_API.UPLOAD_AVATAR, formData, {
              headers: {
                  ...UPLOAD_CONFIG.headers,
                  'Content-Type': 'multipart/form-data'
              }
          })
          
          if (res && res.code === '200') {
              options.onSuccess(res)
          } else {
              options.onError(new Error(res.message || t('SystemBasicMgmt.userInfo.avatarUploadFailed')))
          }
      } catch (error) {
          options.onError(error)
      }
  }

  // 头像上传成功
  const handleAvatarSuccess = (res) => {
    editForm.avatarAddress = res.data
    avatarUrl.value = res.data

    ElMessage({
        message: t('SystemBasicMgmt.userInfo.avatarUploadSuccess') || '头像上传成功',
        type: 'success',
        plain: true,
        showClose: true
    })
}

  // 头像上传失败
  const handleAvatarError = (error) => {
      ElMessage({
          message: error.message || t('SystemBasicMgmt.userInfo.avatarUploadFailed'),
          type: 'error',
          plain: true,
          showClose: true
      })
  }

  // 关闭对话框
  const handleDialogClose = () => {
      // 重置表单
      resetForm()
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';

  .avatar-uploader {
    text-align: center;
    display: inline-block;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    display: inline-block;
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
    border-radius: 6px;
  }

  .avatar-tip {
    font-size: 12px;
    color: #666;
    margin-top: 8px;
    text-align: right;
    padding-left: 20px;
  }
</style>

