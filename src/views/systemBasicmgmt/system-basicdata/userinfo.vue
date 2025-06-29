<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="用户搜索表单">
             <el-form-item :label="$t('systemBasicmgmt.userInfo.filter.department')">
                <el-tree-select 
                      v-model="filters.departmentId"
                      :data="departmentOptions || []"
                      :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList' }"
                      check-strictly
                      filterable
                      :filter-node-method="filterNodeMethod"
                      style="width: 200px;"
                      :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectDepartment')" />
              </el-form-item>
              <el-form-item :label="$t('systemBasicmgmt.userInfo.filter.position')">
                  <el-select 
                      v-model="filters.positionId" 
                      style="width: 180px;"
                      :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectPosition')">
                      <el-option
                          v-for="item in positionOptions"
                          :key="`position-filter-${item.positionId}`"
                          :label="item.positionName"
                          :value="item.positionId" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('systemBasicmgmt.userInfo.filter.role')">
                  <el-select 
                      v-model="filters.roleId" 
                      style="width: 180px;"
                      :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectRole')">
                      <el-option
                          v-for="item in roleOptions"
                          :key="`role-filter-${item.roleId}`"
                          :label="item.roleName"
                          :value="item.roleId" />
                  </el-select>
              </el-form-item>
              <el-form-item class="form-button-group">
                  <el-button type="primary" @click="handleSearch" plain>
                      {{ $t('common.search') }}
                  </el-button>
              </el-form-item>
              <el-form-item class="form-right-button">
                  <el-button type="primary" @click="handleAdd">
                      {{ $t('systemBasicmgmt.userInfo.addUser') }}
                  </el-button>
              </el-form-item>
          </el-form>

          <!-- 表格区域 -->
          <div class="table-container">
              <el-table :data="userList"
                        border
                        stripe
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('systemBasicmgmt.userInfo.index')" width="60" align="center" fixed />
                  <el-table-column prop="userNo" :label="$t('systemBasicmgmt.userInfo.userNo')" align="center" min-width="150" />
                  <el-table-column prop="userNameCh" :label="$t('systemBasicmgmt.userInfo.userNameCh')" align="left" min-width="180" />
                  <el-table-column prop="userNameEn" :label="$t('systemBasicmgmt.userInfo.userNameEn')" align="left" min-width="180" />
                  <el-table-column prop="departmentName" :label="$t('systemBasicmgmt.userInfo.department')" align="left" min-width="150" />
                  <el-table-column prop="positionName" :label="$t('systemBasicmgmt.userInfo.position')" align="left" min-width="120" />
                  <el-table-column prop="genderName" :label="$t('systemBasicmgmt.userInfo.gender')" align="center" min-width="100" />
                  <el-table-column prop="email" :label="$t('systemBasicmgmt.userInfo.email')" align="left" min-width="200" />
                  <el-table-column prop="phoneNumber" :label="$t('systemBasicmgmt.userInfo.phoneNumber')" align="center" min-width="170" />
                  <el-table-column prop="isEmployedName" :label="$t('systemBasicmgmt.userInfo.isEmployed')" align="center" min-width="130" />
                  <el-table-column prop="isSignName" :label="$t('systemBasicmgmt.userInfo.isSign')" align="center" min-width="120" />
                  <el-table-column prop="isPartTimeName" :label="$t('systemBasicmgmt.userInfo.isPartTime')" align="center" min-width="120" />
                  <el-table-column prop="isFreezeName" :label="$t('systemBasicmgmt.userInfo.isFreeze')" align="center" min-width="130" />
                  <el-table-column prop="employmentTypeName" :label="$t('systemBasicmgmt.userInfo.employmentType')" align="center" min-width="180" />
                  <el-table-column :label="$t('systemBasicmgmt.userInfo.operation')" min-width="170" fixed="right" align="center">
                      <template #default="scope">
                          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
                          <el-button size="small"
                                     type="danger"
                                     @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </div>

          <!-- 分页 -->
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
      <!-- 编辑状态对话框 -->
      <el-dialog v-model="dialogVisible"
                     :title="dialogTitle"
                     width="70%"
                     :close-on-click-modal="false"
                     :append-to-body="true"
                     :modal-append-to-body="true"
                     :lock-scroll="true"
                     @close="handleDialogClose">
              <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="用户编辑表单">
              <!-- 第一行：基本信息 -->
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.userNo')" prop="userNo">
                      <el-input v-model="editForm.userNo" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.userNameCh')" prop="userNameCh">
                      <el-input v-model="editForm.userNameCh" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.userNameEn')" prop="userNameEn">
                      <el-input v-model="editForm.userNameEn" style="width:100%" />
                  </el-form-item>
              </div>
              <!-- 第二行：性别和其他 -->
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.gender')" prop="gender">
                      <el-select v-model="editForm.gender" style="width:100%" clearable :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectGender')">
                          <el-option 
                              v-for="item in genderOptions"
                              :key="`gender-${item.genderCode}`"
                              :label="item.genderName"
                              :value="item.genderCode" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.hireDate')" prop="hireDate">
                      <el-date-picker
                          v-model="editForm.hireDate"
                          type="date"
                          style="width:100%"
                          :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectHireDate')"
                          format="YYYY/MM/DD"
                          value-format="YYYY/MM/DD" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.employmentType')" prop="employmentType">
                      <el-select 
                          v-model="editForm.employmentType" 
                          style="width:100%"
                          clearable
                          :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectEmploymentType')">
                          <el-option
                              v-for="item in employmentTypeOptions"
                              :key="`employment-type-edit-${item.employmentCode}`"
                              :label="item.employmentName"
                              :value="item.employmentCode" />
                      </el-select>
                  </el-form-item>
              </div>
              <!-- 第三行：组织信息 -->
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.department')" prop="departmentId">
                      <el-tree-select
                          v-model="editForm.departmentId"
                          :data="departmentOptions || []"
                          :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList' }"
                          check-strictly
                          filterable
                          clearable
                          :filter-node-method="filterNodeMethod"
                          style="width:100%"
                          :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectDepartment')" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.position')" prop="positionId">
                      <el-select 
                          v-model="editForm.positionId" 
                          style="width:100%"
                          clearable
                          :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectPosition')">
                          <el-option
                              v-for="item in positionOptions"
                              :key="`position-edit-${item.positionId}`"
                              :label="item.positionName"
                              :value="item.positionId" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.role')" prop="roleId">
                      <el-select 
                          v-model="editForm.roleId" 
                          style="width:100%"
                          clearable
                          :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectRole')">
                          <el-option
                              v-for="item in roleOptions"
                              :key="`role-edit-${item.roleId}`"
                              :label="item.roleName"
                              :value="item.roleId" />
                      </el-select>
                  </el-form-item>
              </div>
              <!-- 第四行：登录账号 -->
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.loginNo')" prop="loginNo">
                      <el-input v-model="editForm.loginNo" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.password')" prop="passWord">
                      <el-input v-model="editForm.passWord" type="password" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.email')" prop="email">
                      <el-input v-model="editForm.email" style="width:100%" />
                  </el-form-item>
              </div>
              <!-- 第五行：联系信息 -->
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.phoneNumber')">
                      <el-input v-model="editForm.phoneNumber" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.isEmployed')">
                      <el-switch
                          v-model="editForm.isEmployed"
                          :active-value="1"
                          :inactive-value="0"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.isFreeze')">
                      <el-switch
                          v-model="editForm.isFreeze"
                          :active-value="1"
                          :inactive-value="0"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                  </el-form-item>
              </div>
              <!-- 第六行：状态开关 -->
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.isSign')">
                      <el-switch
                          v-model="editForm.isSign"
                          :active-value="1"
                          :inactive-value="0"
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                  </el-form-item>
                  <el-form-item>
                      
                  </el-form-item>
                  <el-form-item>
                      
                  </el-form-item>
              </div>
              <!-- 备注信息 -->
              <div class="form-row full-width">
                  <el-form-item :label="$t('systemBasicmgmt.userInfo.remark')">
                      <el-input v-model="editForm.remark" style="width:100%" type="textarea" :rows="3" />
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
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { post } from '@/utils/request'
  import { 
      GET_USER_PAGES_API, 
      INSERST_USER_API, 
      DELETE_USER_API, 
      GET_USER_ENTITY_API, 
      UPDATE_USER_API,
      GET_DEPARTMENT_DROPDOWN_API,
      GET_USER_POSITION_DROPDOWN_API,
      GET_ROLE_DROPDOWN_API,
      GET_GENDER_DROPDOWN_API,
      GET_EMPLOYMENT_TYPE_DROPDOWN_API
  } from '@/config/api/systemBasicmgmt/system-basic/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  // 初始化i18n
  const { t } = useI18n()

  // 员工数据
  const userList = ref([])
  const loading = ref(false)

  // 表单引用
  const editFormRef = ref(null)

  // 下拉框选项
  const departmentOptions = ref([])
  const positionOptions = ref([])
  const roleOptions = ref([])
  const genderOptions = ref([])
  const employmentTypeOptions = ref([])

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
      roleId: '',
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
      isSign: 0,
      isEmployed: 1,
      isFreeze: 0,
      employmentCode: '',
      remark: '',
      modifiedBy: '',
      modifiedDate: ''
  })

  // 对话框标题
  const dialogTitle = ref(t('systemBasicmgmt.userInfo.editUser'))

  // 表单验证规则
  const formRules = reactive({
      userNo: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseInputUserNo'), trigger: 'blur' }
      ],
      userNameCh: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseInputUserNameCh'), trigger: 'blur' }
      ],
      userNameEn: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseInputUserNameEn'), trigger: 'blur' }
      ],
      gender: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseSelectGender'), trigger: 'change' }
      ],
      hireDate: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseSelectHireDate'), trigger: 'change' }
      ],
      employmentCode: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseSelectEmploymentType'), trigger: 'change' }
      ],
      departmentId: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseSelectDepartment'), trigger: 'change' }
      ],
      positionId: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseSelectPosition'), trigger: 'change' }
      ],
      roleId: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseSelectRole'), trigger: 'change' }
      ],
      loginNo: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseInputLoginNo'), trigger: 'blur' }
      ],
      email: [
          { required: true, message: () => t('systemBasicmgmt.userInfo.pleaseInputEmail'), trigger: 'blur' }
      ]
  })

  // 部门搜索过滤方法
  const filterNodeMethod = (value, data) => data.departmentName.includes(value)

  // 在组件挂载后获取数据
  onMounted(async () => {
      // 获取下拉框数据并设置筛选条件默认值
      await fetchDepartmentDropdown(true, false)
      await fetchPositionDropdown(true, false)
      await fetchRoleDropdown(true, false)
      await fetchGenderDropdown()
      await fetchEmploymentTypeDropdown()
      // 获取用户列表数据
      fetchUserPages()
  })

  // 获取部门下拉框数据
  const fetchDepartmentDropdown = async (setDefaultFilter = false, setDefaultForm = false) => {
      try {
          const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
          if (res && res.code === '200') {
              departmentOptions.value = Array.isArray(res.data) ? res.data : []
              // 设置筛选条件默认值
              if (setDefaultFilter && departmentOptions.value.length > 0 && !filters.departmentId) {
                  filters.departmentId = departmentOptions.value[0].departmentId
              }
              // 设置编辑表单默认值（仅新增时）
              if (setDefaultForm && departmentOptions.value.length > 0 && !editForm.departmentId) {
                  editForm.departmentId = departmentOptions.value[0].departmentId
              }
          } else {
              departmentOptions.value = []
          }
      } catch (error) {
          departmentOptions.value = []
      }
  }

  // 获取职位下拉框数据
  const fetchPositionDropdown = async (setDefaultFilter = false, setDefaultForm = false) => {
      const res = await post(GET_USER_POSITION_DROPDOWN_API.GET_USER_POSITION_DROPDOWN, {})
      if (res && res.code === '200') {
          positionOptions.value = res.data || []
          // 设置筛选条件默认值
          if (setDefaultFilter && positionOptions.value.length > 0 && !filters.positionId) {
              filters.positionId = positionOptions.value[0].positionId
          }
          // 设置编辑表单默认值（仅新增时）
          if (setDefaultForm && positionOptions.value.length > 0 && !editForm.positionId) {
              editForm.positionId = positionOptions.value[0].positionId
          }
      }
  }

  // 获取角色下拉框数据
  const fetchRoleDropdown = async (setDefaultFilter = false, setDefaultForm = false) => {
      const res = await post(GET_ROLE_DROPDOWN_API.GET_ROLE_DROPDOWN, {})
      if (res && res.code === '200') {
          roleOptions.value = res.data || []
          // 设置筛选条件默认值
          if (setDefaultFilter && roleOptions.value.length > 0 && !filters.roleId) {
              filters.roleId = roleOptions.value[0].roleId
          }
          // 设置编辑表单默认值（仅新增时）
          if (setDefaultForm && roleOptions.value.length > 0 && !editForm.roleId) {
              editForm.roleId = roleOptions.value[0].roleId
          }
      }
  }

  // 获取性别下拉框数据
  const fetchGenderDropdown = async () => {
      try {
          const res = await post(GET_GENDER_DROPDOWN_API.GET_GENDER_DROPDOWN, {})
          if (res && res.code === '200') {
              genderOptions.value = res.data || []
          } else {
              genderOptions.value = []
          }
      } catch (error) {

      }
  }

  // 获取雇佣类型下拉框数据
  const fetchEmploymentTypeDropdown = async (setDefaultForm = false) => {
      try {
          const res = await post(GET_EMPLOYMENT_TYPE_DROPDOWN_API.GET_EMPLOYMENT_TYPE_DROPDOWN, {})
          if (res && res.code === '200') {
              employmentTypeOptions.value = res.data || []
              // 设置编辑表单默认值（仅新增时）
              if (setDefaultForm && employmentTypeOptions.value.length > 0 && !editForm.employmentCode) {
                  editForm.employmentCode = employmentTypeOptions.value[0].employmentCode
              }
          } else {
              employmentTypeOptions.value = []
          }
      } catch (error) {
          console.error('获取雇佣类型数据失败:', error)
          employmentTypeOptions.value = []
      }
  }

  // 获取员工实体数据
  const fetchUserEntity = async (userId) => {
      const params = {
          userId: userId
      }
      const res = await post(GET_USER_ENTITY_API.GET_USER_ENTITY, params)

      if (res && res.code === '200') {
          Object.assign(editForm, res.data)
      }
  }

  // 获取员工列表数据
  const fetchUserPages = async () => {
      loading.value = true
      const params = {
          departmentId: filters.departmentId,
          roleId: filters.roleId,
          positionId: filters.positionId,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize
      }
      const res = await post(GET_USER_PAGES_API.GET_USER_PAGES, params)

      if (res && res.code === '200') {

          userList.value = res.data || []
          pagination.total = res.totalNumber || 0
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.userInfo.getFailed'))
      }
      loading.value = false
  }

  // 处理搜索操作
  const handleSearch = () => {
      pagination.pageIndex = 1
      fetchUserPages()
  }

  // 重置搜索条件
  const handleReset = () => {
      Object.assign(filters, {
          departmentId: '',
          positionId: '',
          roleId: '',
          userNo: '',
          userName: '',
          gender: ''
      })
      pagination.pageIndex = 1
      fetchUserPages()
  }





  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchUserPages()
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchUserPages()
  }

  const resetForm = () => {
      // 重置表单数据
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
          isSign: 0,
          isEmployed: 1,
          isFreeze: 0,
          employmentCode: '',
          remark: '',
          modifiedBy: '',
          modifiedDate: ''
      })
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

  // 新增员工数据
  const insertUser = async () => {
      const params = {
          ...editForm
      }

      const res = await post(INSERST_USER_API.INSERST_USER, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message || t('systemBasicmgmt.userInfo.saveSuccess'))
          dialogVisible.value = false
          fetchUserPages()
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.userInfo.operationFailed'))
      }
  }

  // 更新员工数据
  const updateUser = async () => {
      const params = {
          ...editForm
      }
      const res = await post(UPDATE_USER_API.UPDATE_USER, params)
      
      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message || t('systemBasicmgmt.userInfo.updateSuccess'))
          dialogVisible.value = false
          fetchUserPages()
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.userInfo.operationFailed'))
      }
  }

  // 删除员工数据
  const deleteUser = async (userId) => {
      const params = {
          userId: userId
      }

      const res = await post(DELETE_USER_API.DELETE_USER, params)

      if (res && res.code === '200') {
          ElMessage.success(res.message || t('systemBasicmgmt.userInfo.deleteSuccess'))
          fetchUserPages()
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.userInfo.operationFailed'))
      }
  }

  // 处理新增操作
  const handleAdd = async () => {
      // 重置表单数据
      resetForm()
      // 重新获取下拉框数据并设置编辑表单默认值
      await fetchDepartmentDropdown(false, true)
      await fetchPositionDropdown(false, true)
      await fetchRoleDropdown(false, true)
      await fetchGenderDropdown()
      await fetchEmploymentTypeDropdown(true)
      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.userInfo.addUser')
      // 显示对话框
      dialogVisible.value = true
      // 对话框显示后清除验证状态
      clearFormValidation()
  }

  // 处理编辑操作
  const handleEdit = async (index, row) => {
      // 重置表单数据
      resetForm()
      // 重新获取下拉框数据（编辑时不设置默认值）
      await fetchDepartmentDropdown(false, false)
      await fetchPositionDropdown(false, false)
      await fetchRoleDropdown(false, false)
      await fetchGenderDropdown()
      await fetchEmploymentTypeDropdown(false)
      // 获取员工实体数据
      await fetchUserEntity(row.userId)
      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.userInfo.editUser')
      // 显示对话框
      dialogVisible.value = true
      // 对话框显示后清除验证状态
      clearFormValidation()
  }

  // 处理删除操作
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('systemBasicmgmt.userInfo.deleteConfirm'),
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

  // 保存编辑结果
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

  // 处理对话框关闭
  const handleDialogClose = () => {
      // 重置表单数据
      resetForm()
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

