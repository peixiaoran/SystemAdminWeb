<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 搜索表单 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="搜索表单">
              <el-form-item :label="$t('SystemBasicMgmt.program.programName')">
                  <el-input style="width: 200px" 
                            v-model="filters.programName" 
                            :placeholder="$t('SystemBasicMgmt.inputPlaceholder') + $t('SystemBasicMgmt.program.programName')" 
                            />
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.program.domain')">
                      <el-select v-model="filters.domainId" :placeholder="$t('SystemBasicMgmt.selectPlaceholder') + $t('SystemBasicMgmt.program.domain')" style="width:180px" @change="handleFilterDomainChange">
                      <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.program.module')">
                      <el-select v-model="filters.parentMenuId" :placeholder="$t('SystemBasicMgmt.selectPlaceholder') + $t('SystemBasicMgmt.program.module')" style="width:180px">
                      <el-option v-for="item in filterModuleList" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
                  </el-select>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="handleSearch" class="conventional-filter-form-button" plain>
                      {{ $t('common.search') }}
                  </el-button>
                  <el-button @click="handleReset">
                      {{ $t('common.reset') }}
                  </el-button>
              </el-form-item>
              <div class="form-right-button">
                  <el-button type="primary" @click="handleAdd">
                      {{ $t('SystemBasicMgmt.program.addProgram') }}
                  </el-button>
              </div>
          </el-form>

          <!-- 表格 -->
          <div class="table-container">
              <el-table :data="programList"
                        style="width: 100%"
                        border
                        stripe
                        max-height="calc(100vh - 240px)"
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                                      <el-table-column type="index" :label="$t('SystemBasicMgmt.index')" width="70" align="center" fixed />
                  <el-table-column prop="menuCode" :label="$t('SystemBasicMgmt.program.programCode')" align="left" min-width="200" />
                  <el-table-column prop="menuNameCn" :label="$t('SystemBasicMgmt.program.programNameCn')" align="left" min-width="260" />
                  <el-table-column prop="menuNameEn" :label="$t('SystemBasicMgmt.program.programNameEn')" align="left" min-width="230" />
                  <el-table-column prop="roleCode" :label="$t('SystemBasicMgmt.program.roleCode')" align="center" min-width="130" />
                  <el-table-column prop="path" :label="$t('SystemBasicMgmt.program.pagePath')" align="left" min-width="420" />
                  <el-table-column prop="menuIcon" :label="$t('SystemBasicMgmt.program.programIcon')" align="center" min-width="150" />
                  <el-table-column prop="isEnabled" :label="$t('SystemBasicMgmt.isEnabled')" align="center" min-width="90">
                      <template #default="scope">
                          <div class="flex">
                              <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                                  {{ scope.row.isEnabled ? $t('SystemBasicMgmt.enabled') : $t('SystemBasicMgmt.disabled') }}
                              </el-tag>
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="isVisible" :label="$t('SystemBasicMgmt.isVisible')" align="center" min-width="90">
                      <template #default="scope">
                          <div class="flex">
                              <el-tag :type="scope.row.isVisible ? 'success' : 'danger'">
                                  {{ scope.row.isVisible ? $t('SystemBasicMgmt.visible') : $t('SystemBasicMgmt.hidden') }}
                              </el-tag>
                          </div>
                      </template>
                  </el-table-column>
                <el-table-column :label="$t('SystemBasicMgmt.operation')" min-width="170" fixed="right" align="center">
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

      <!-- 编辑弹窗 -->
      <el-dialog v-model="dialogVisible"
                 :title="dialogTitle"
                 width="50%"
                 :close-on-click-modal="false"
                 :append-to-body="true"
                 :modal-append-to-body="true"
                 :lock-scroll="true"
                 @close="handleDialogClose">
          <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="编辑表单">
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.program.programCode')" prop="menuCode">
                      <el-input v-model="editForm.menuCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.program.programNameCn')" prop="menuNameCn">
                      <el-input v-model="editForm.menuNameCn" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.program.programNameEn')" prop="menuNameEn">
                      <el-input v-model="editForm.menuNameEn" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.program.domain')" prop="domainId">
                      <el-select v-model="editForm.domainId" style="width:100%" clearable :placeholder="$t('SystemBasicMgmt.program.pleaseSelectDomain')" @change="handleDomainChange">
                          <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
                      </el-select>
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.program.module')" prop="parentMenuId">
                      <el-select v-model="editForm.parentMenuId" style="width:100%" clearable :placeholder="$t('SystemBasicMgmt.program.pleaseSelectModule')">
                          <el-option v-for="item in moduleDropList" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.program.programIcon')" prop="menuIcon">
                      <el-input v-model="editForm.menuIcon" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.program.sortOrder')" prop="sortOrder">
                      <el-input-number v-model="editForm.sortOrder" style="width:100%" :min="1" :precision="0" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.program.pagePath')" prop="path">
                      <el-input v-model="editForm.path" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.program.programType')" prop="menuType">
                      <el-select v-model="editForm.menuType" style="width:100%" clearable :placeholder="$t('SystemBasicMgmt.program.pleaseSelectProgramType')">
                          <el-option
                              v-for="item in menuTypeOptions"
                              :key="item.menuTypeCode"
                              :label="item.menuTypeName"
                              :value="item.menuTypeCode" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.program.roleCode')" prop="roleCode">
                      <el-input v-model="editForm.roleCode" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.program.apiRoute')" prop="routePath">
                      <el-input v-model="editForm.routePath" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.program.redirect')" prop="redirect">
                      <el-input v-model="editForm.redirect" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row full-width">
                                     <el-form-item :label="$t('SystemBasicMgmt.remarks')">
                      <el-input v-model="editForm.remarks" style="width:100%" type="textarea" :rows="3" />
                  </el-form-item>
              </div>
              <div class="form-row">
                                     <el-form-item :label="$t('SystemBasicMgmt.isEnabled')">
                      <el-switch v-model="editForm.isEnabled"
                                 :active-value="1"
                                 :inactive-value="0"
                                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                  </el-form-item>
                                     <el-form-item :label="$t('SystemBasicMgmt.isVisible')">
                      <el-switch v-model="editForm.isVisible"
                                 :active-value="1"
                                 :inactive-value="0"
                                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
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
  import { GET_PROGRAM_PAGES_API, GET_PROGRAM_ENTITY_API, INSERT_PROGRAM_API, DELETE_PROGRAM_API, GET_DOMAIN_DROP_API, GET_MODULE_DROP_API, UPDATE_PROGRAM_API, GET_MENU_TYPE_API } from '@/config/api/SystemBasicMgmt/System-Mgmt/program'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  // 使用i18n
  const { t } = useI18n()

  // 程序数据
  const programList = ref([])
  const loading = ref(false)
  const domainDropList = ref([])
  const moduleDropList = ref([])
  const menuTypeOptions = ref([])

  // 表单引用
  const editFormRef = ref(null)

  // 分页信息
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
      total: 0
  })

  // 过滤条件
  const filters = reactive({
      programCode: '',
      programName: '',
      programNameEn: '',
      programUrl: '',
      domainId: '',
      parentMenuId: ''
  })

  // 过滤模块列表
  const filterModuleList = ref([])

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      menuId: '',
      parentMenuId: '',
      domainId: '',
      menuCode: '',
      menuNameCn: '',
      menuNameEn: '',
      menuType: '',
      menuUrl: '',
      menuIcon: '',
      sortOrder: 1,
      roleCode: '',
      isEnabled: 1,
      isVisible: 1,
      level: 1,
      routePath: '',
      path: '',
      redirect: '',
      remarks: ''
  })
  // 对话框标题
  const dialogTitle = ref('')

  // 表单验证规则
  const formRules = reactive({
      menuCode: [
          { required: true, message: () => t('SystemBasicMgmt.program.pleaseInputProgramCode'), trigger: 'blur' }
      ],
      menuNameCn: [
{ required: true, message: () => t('SystemBasicMgmt.program.pleaseInputProgramNameCn'), trigger: 'blur' }
      ],
      menuNameEn: [
          { required: true, message: () => t('SystemBasicMgmt.program.pleaseInputProgramNameEn'), trigger: 'blur' }
      ],
      domainId: [
          { required: true, message: () => t('SystemBasicMgmt.program.pleaseSelectDomain'), trigger: 'change' }
      ],
      parentMenuId: [
          { required: true, message: () => t('SystemBasicMgmt.program.pleaseSelectModule'), trigger: 'change' }
      ],
      menuIcon: [
          { required: true, message: () => t('SystemBasicMgmt.program.pleaseInputProgramIcon'), trigger: 'blur' }
      ],
      sortOrder: [
          { required: true, message: () => t('SystemBasicMgmt.program.pleaseInputSortOrder'), trigger: 'blur' }
      ],
      path: [
          { required: true, message: () => t('SystemBasicMgmt.program.pleaseInputPagePath'), trigger: 'blur' }
      ],
      menuType: [
          { required: true, message: () => t('SystemBasicMgmt.program.pleaseSelectProgramType'), trigger: 'change' }
      ],
      roleCode: [
          { required: true, message: () => t('SystemBasicMgmt.program.pleaseInputRoleCode'), trigger: 'blur' }
      ],
      routePath: [
          { required: true, message: () => t('SystemBasicMgmt.program.pleaseInputApiRoute'), trigger: 'blur' }
      ],
      redirect: [
          // redirect 可为空，移除必填验证
      ]
  })

  // 组件挂载后获取网域数据
  onMounted(() => {
      initPageData() // 初始化页面数据，设置查询条件默认值
      fetchMenuTypeOptions() // 获取菜单类型选项
  })

  // 初始化页面数据（只在页面加载时调用）
  const initPageData = async () => {
      try {
          const res = await post(GET_DOMAIN_DROP_API.GET_DOMAIN_TYPE)
          // 对获取的数据进行XSS清洗
          domainDropList.value = res.data || []

          // 默认选中第一个网域（用于查询条件）
          if (domainDropList.value.length > 0) {
              filters.domainId = domainDropList.value[0].domainId
              // 获取对应的模块列表
              await fetchFilterModuleDrop()
          }

          // 应用默认值进行初始查询
          fetchProgramPages()
      } catch (error) {

      }
  }

  // 获取网域数据（用于新增时设置默认值）
  const fetchDomainDrop = async () => {
      try {
          const res = await post(GET_DOMAIN_DROP_API.GET_DOMAIN_TYPE)
          // 对获取的数据进行XSS清洗
          domainDropList.value = res.data || []

          // 新增时默认选中第一个网域
          if (dialogTitle.value === t('SystemBasicMgmt.program.addProgram') && domainDropList.value.length > 0) {
              editForm.domainId = domainDropList.value[0].domainId
              // 根据选中的网域获取模块列表
              fetchModuleDrop(true)
          }
      } catch (error) {

      }
  }

  // 获取模块数据
  const fetchModuleDrop = async (setDefaultValue = false) => {
      if (!editForm.domainId) {
          moduleDropList.value = []
          return
      }

      try {
          const params = {
              domainId: editForm.domainId
          }
          const res = await post(GET_MODULE_DROP_API.GET_MODULE_TYPE, params)
          // 对获取的数据进行XSS清洗
          moduleDropList.value = res.data || []

          // 只有当需要设置默认值且是新增时才设置默认值
          if (setDefaultValue && dialogTitle.value === t('SystemBasicMgmt.program.addProgram') && moduleDropList.value.length > 0) {
              editForm.parentMenuId = moduleDropList.value[0].menuId
          }
      } catch (error) {

      }
  }

  // 获取实体数据
  const fetchProgramEntity = async (menuId) => {
      try {
          const params = {
              menuId: menuId
          }
          const res = await post(GET_PROGRAM_ENTITY_API.GET_PROGRAM_ENTITY, params)

          if (res && res.code === '200') {
              // 还原原始的 parentMenuId 值
              const originalParentMenuId = res.data.parentMenuId
              
              // 填充表单数据
              editForm.menuId = res.data.menuId
              editForm.menuCode = res.data.menuCode || ''
              editForm.menuNameCn = res.data.menuNameCn || ''
              editForm.menuNameEn = res.data.menuNameEn || ''
              editForm.domainId = res.data.domainId
              editForm.menuType = String(res.data.menuType || '')
              editForm.menuUrl = res.data.menuUrl || ''
              editForm.menuIcon = res.data.menuIcon || ''
              editForm.sortOrder = res.data.sortOrder
              editForm.roleCode = res.data.roleCode || ''
              editForm.path = res.data.path || ''
              editForm.redirect = res.data.redirect || ''
              editForm.remarks = res.data.remarks || ''
              editForm.isEnabled = res.data.isEnabled
              editForm.isVisible = res.data.isVisible
              editForm.level = res.data.level
              editForm.routePath = res.data.routePath || ''

              // 当编辑时，需要重新获取模块列表，并还原 parentMenuId
              if (editForm.domainId) {
                  await fetchModuleDrop(false)
                  // 模块列表加载完成后，还原 parentMenuId
                  editForm.parentMenuId = originalParentMenuId
              }
          }
      } catch (error) {

      }
  }

  // 获取列表数据
  const fetchProgramPages = async () => {
      loading.value = true
      try {
          const params = {
              ...filters,
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize
          }

          const res = await post(GET_PROGRAM_PAGES_API.GET_PROGRAM_PAGES, params)

          // 确保使用sanitizeHtml清洗数据
          programList.value = res.data || []
          pagination.total = res.totalNumber || 0
      } catch (error) {

      } finally {
          loading.value = false
      }
  }

  // 搜索
  const handleSearch = () => {
      pagination.pageIndex = 1
      fetchProgramPages()
  }

  // 重置
  const handleReset = async () => {
      filters.programCode = ''
      filters.programName = ''
      filters.programUrl = ''
      
      // 设置为默认的第一个模块
      if (domainDropList.value.length > 0) {
          filters.domainId = domainDropList.value[0].domainId
          // 获取对应的模块列表
          await fetchFilterModuleDrop()
      } else {
          filters.domainId = ''
          filters.parentMenuId = ''
          filterModuleList.value = []
      }
      
      pagination.pageIndex = 1
  }

  // 分页变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchProgramPages()
  }

  // 每页条数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchProgramPages()
  }

  const resetForm = (clearValidation = true) => {
      // 清除表单验证状态，在重新设置表单值之前
      if (clearValidation && editFormRef.value) {
          try {
              // 清除表单中选择框的验证
              const selectFields = ['domainId', 'parentMenuId', 'menuType']
              selectFields.forEach(field => {
                  editFormRef.value.clearValidate(field)
              })
              // 然后清除所有验证
              editFormRef.value.clearValidate()
          } catch (error) {
              console.warn('重置表单验证状态失败:', error)
          }
      }
      
      // 重置表单值
      Object.assign(editForm, {
          menuId: '',
          menuCode: '',
          menuNameCn: '',
          menuNameEn: '',
          menuType: '',
          menuUrl: '',
          redirect: '',
          path: '',
          roleCode: '',
          menuIcon: '',
          sortOrder: 1,
          isEnabled: 1,
          isVisible: 1,
          routePath: '',
          remarks: ''
      })
      
      // 重新设置表单验证状态
      if (clearValidation) {
          nextTick(() => {
              if (editFormRef.value) {
                  try {
                      editFormRef.value.clearValidate()
                  } catch (error) {
                      console.warn('重置表单验证状态失败:', error)
                  }
              }
          })
      }
  }

  // 新增程序
  const insertProgram = async () => {
      // 验证必填项
      if (!editForm.domainId) {
          ElMessage({
              message: t('SystemBasicMgmt.program.pleaseSelectDomain'),
              type: 'warning',
              plain: true,
              showClose: true
          })
          return
      }

      // 设置必填项
      const params = {
          ...editForm,
          redirect: editForm.redirect
      }
              const res = await post(INSERT_PROGRAM_API.INSERT_PROGRAM, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          fetchProgramPages()
          dialogVisible.value = false
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 更新程序
  const updateProgram = async () => {
      // 验证必填项
      if (!editForm.domainId) {
          ElMessage({
              message: t('SystemBasicMgmt.program.pleaseSelectDomain'),
              type: 'warning',
              plain: true,
              showClose: true
          })
          return
      }

      // 设置必填项
      const params = {
          ...editForm,
          redirect: editForm.redirect
      }

      const res = await post(UPDATE_PROGRAM_API.UPDATE_PROGRAM, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          dialogVisible.value = false
          fetchProgramPages()
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 删除程序
  const deleteProgram = async (menuId) => {
      const params = {
          menuId: menuId
      }

      if (isNaN(params.menuId)) {
                     ElMessage({
                         message: t('SystemBasicMgmt.invalidId'),
                         type: 'error',
                         plain: true,
                         showClose: true
                     })
          return
      }

      const res = await post(DELETE_PROGRAM_API.DELETE_PROGRAM, params)

      if (res && res.code === '200') {
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          dialogVisible.value = false
          fetchProgramPages()
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 新增程序
  const handleAdd = () => {
      // 重置表单
      resetForm()
      // 设置默认值
      editForm.menuId = '0'
      editForm.sortOrder = 1
      editForm.isEnabled = 1
      editForm.isVisible = 1

      // 设置对话框标题
      dialogTitle.value = t('SystemBasicMgmt.program.addProgram')

      // 获取网域和菜单类型选项
      fetchDomainDrop()
      fetchMenuTypeOptions()

      // 显示对话框
      dialogVisible.value = true
  }

  // 编辑程序
  const handleEdit = async (index, row) => {
      // 重置表单
      resetForm()

      // 设置对话框标题
      dialogTitle.value = t('SystemBasicMgmt.program.editProgram')

      // 先获取网域和菜单类型选项
      await fetchDomainDrop()
      await fetchMenuTypeOptions()
      
      // 然后获取实体数据，并自动填充对应的模块列表
      await fetchProgramEntity(row.menuId)

      // 显示对话框
      dialogVisible.value = true
      
      // 延迟清除表单验证状态
      setTimeout(() => {
          if (editFormRef.value) {
              editFormRef.value.clearValidate()
          }
      }, 100)
  }

  // 关闭对话框
  const handleDialogClose = () => {
      // 使用nextTick确保DOM渲染完成后再清除验证
      nextTick(() => {
          resetForm(true)
      })
  }

  // 删除程序
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('SystemBasicMgmt.program.deleteConfirm'),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning',
          }
      )
          .then(() => {
              deleteProgram(row.menuId)
              // 刷新列表
              fetchProgramPages()
          })
          .catch(() => {
              // 取消删除
          })
  }

  // 保存
  const handleSave = () => {
      editFormRef.value?.validate((valid) => {
          if (valid) {
              // 判断是新增还是编辑
              const isNewModule = !editForm.menuId || editForm.menuId === '' || editForm.menuId === '0'

              if (isNewModule) {
                  insertProgram()
              } else {
                  updateProgram()
              }
              dialogVisible.value = false

              // 刷新列表
              fetchProgramPages()
          }
      })
  }

  // 域名变化
  const handleDomainChange = () => {
      // 清除模块选择
      editForm.parentMenuId = ''
      // 当模块选择变化时，设置默认值
      fetchModuleDrop(true)
  }

  // 过滤域名变化
  const handleFilterDomainChange = () => {
      // 清除模块选择
      filters.parentMenuId = ''
      // 当模块选择变化时，设置默认值
      fetchFilterModuleDrop()
  }

  // 获取过滤条件下的模块数据
  const fetchFilterModuleDrop = async () => {
      if (!filters.domainId) {
          filterModuleList.value = []
          return
      }

      try {
          const params = {
              domainId: filters.domainId
          }
          const res = await post(GET_MODULE_DROP_API.GET_MODULE_TYPE, params)
          filterModuleList.value = res.data || []

          // 默认选中第一个模块
          if (filterModuleList.value.length > 0) {
              filters.parentMenuId = filterModuleList.value[0].menuId
          }
      } catch (error) {
        
      }
  }

  // 获取菜单类型选项
  const fetchMenuTypeOptions = async () => {
      try {
          const res = await post(GET_MENU_TYPE_API.GET_MENU_TYPE)
          if (res && res.code === '200') {
              // 确保 menuTypeCode 为字符串
              menuTypeOptions.value = (res.data || []).map(item => ({
                  ...item,
                  menuTypeCode: String(item.menuTypeCode)
              }))
          } else {
              menuTypeOptions.value = []
          }
      } catch (error) {
          console.error('获取菜单类型选项失败:', error)
          menuTypeOptions.value = []
      }
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

