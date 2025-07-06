<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="程序搜索表单">
              <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.programName')">
                  <el-input style="width: 200px" 
                            v-model="filters.programName" 
                            :placeholder="$t('systemBasicmgmt.systemMgmt.inputPlaceholder') + $t('systemBasicmgmt.systemMgmt.program.programName')" 
                            />
              </el-form-item>
              <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.domain')">
                  <el-select v-model="filters.domainId" :placeholder="$t('systemBasicmgmt.systemMgmt.selectPlaceholder') + $t('systemBasicmgmt.systemMgmt.program.domain')" style="width:180px" @change="handleFilterDomainChange">
                      <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.module')">
                  <el-select v-model="filters.parentMenuId" :placeholder="$t('systemBasicmgmt.systemMgmt.selectPlaceholder') + $t('systemBasicmgmt.systemMgmt.program.module')" style="width:180px">
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
                      {{ $t('systemBasicmgmt.systemMgmt.program.addProgram') }}
                  </el-button>
              </div>
          </el-form>

          <!-- 表格区域 -->
          <div class="table-container">
              <el-table :data="programList"
                        style="width: 100%"
                        border
                        stripe
                        max-height="calc(100vh - 240px)"
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('systemBasicmgmt.systemMgmt.index')" width="60" align="center" fixed />
                  <el-table-column prop="menuCode" :label="$t('systemBasicmgmt.systemMgmt.program.programCode')" align="left" min-width="200" />
                  <el-table-column prop="menuNameCh" :label="$t('systemBasicmgmt.systemMgmt.program.programNameCh')" align="left" min-width="260" />
                  <el-table-column prop="menuNameEn" :label="$t('systemBasicmgmt.systemMgmt.program.programNameEn')" align="left" min-width="230" />
                  <el-table-column prop="roleCode" :label="$t('systemBasicmgmt.systemMgmt.program.roleCode')" align="center" min-width="130" />
                  <el-table-column prop="path" :label="$t('systemBasicmgmt.systemMgmt.program.pagePath')" align="left" min-width="230" />
                  <el-table-column prop="menuIcon" :label="$t('systemBasicmgmt.systemMgmt.program.programIcon')" align="center" min-width="230" />
                  <el-table-column prop="isEnabled" :label="$t('systemBasicmgmt.systemMgmt.isEnabled')" align="center" min-width="150">
                      <template #default="scope">
                          <div class="flex">
                              <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                                  {{ scope.row.isEnabled ? $t('systemBasicmgmt.systemMgmt.enabled') : $t('systemBasicmgmt.systemMgmt.disabled') }}
                              </el-tag>
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="isVisible" :label="$t('systemBasicmgmt.systemMgmt.isVisible')" align="center" min-width="90">
                      <template #default="scope">
                          <div class="flex">
                              <el-tag :type="scope.row.isVisible ? 'success' : 'danger'">
                                  {{ scope.row.isVisible ? $t('systemBasicmgmt.systemMgmt.visible') : $t('systemBasicmgmt.systemMgmt.hidden') }}
                              </el-tag>
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="createdName" :label="$t('systemBasicmgmt.systemMgmt.createdBy')" min-width="120" />
                  <el-table-column prop="createdDate" :label="$t('systemBasicmgmt.systemMgmt.createdTime')" min-width="180" />
                  <el-table-column :label="$t('systemBasicmgmt.systemMgmt.operation')" min-width="170" fixed="right" align="center">
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
                 width="50%"
                 :close-on-click-modal="false"
                 :append-to-body="true"
                 :modal-append-to-body="true"
                 :lock-scroll="true"
                 @close="handleDialogClose">
          <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="程序编辑表单">
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.programCode')" prop="menuCode">
                      <el-input v-model="editForm.menuCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.programNameCh')" prop="menuNameCh">
<el-input v-model="editForm.menuNameCh" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.programNameEn')" prop="menuNameEn">
                      <el-input v-model="editForm.menuNameEn" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.domain')" prop="domainId">
                      <el-select v-model="editForm.domainId" style="width:100%" clearable :placeholder="$t('systemBasicmgmt.systemMgmt.program.pleaseSelectDomain')" @change="handleDomainChange">
                          <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
                      </el-select>
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.module')" prop="parentMenuId">
                      <el-select v-model="editForm.parentMenuId" style="width:100%" clearable :placeholder="$t('systemBasicmgmt.systemMgmt.program.pleaseSelectModule')">
                          <el-option v-for="item in moduleDropList" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.programIcon')" prop="menuIcon">
                      <el-input v-model="editForm.menuIcon" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.sortOrder')" prop="sortOrder">
                      <el-input v-model.number="editForm.sortOrder" type="number" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.pagePath')" prop="path">
                      <el-input v-model="editForm.path" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.programType')" prop="menuType">
                      <el-select v-model="editForm.menuType" style="width:100%" clearable :placeholder="$t('systemBasicmgmt.systemMgmt.program.pleaseSelectProgramType')">
                          <el-option
                              v-for="item in menuTypeOptions"
                              :key="item.menuTypeCode"
                              :label="item.menuTypeName"
                              :value="item.menuTypeCode" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.roleCode')" prop="roleCode">
                      <el-input v-model="editForm.roleCode" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.apiRoute')" prop="routePath">
                      <el-input v-model="editForm.routePath" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.component')" prop="component">
                      <el-input v-model="editForm.component" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.program.target')" prop="target">
                      <el-input v-model="editForm.target" style="width:100%" />
                  </el-form-item>
                  <el-form-item></el-form-item>
              </div>
              <div class="form-row full-width">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.remarks')">
                      <el-input v-model="editForm.remarks" style="width:100%" type="textarea" :rows="3" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.isEnabled')">
                      <el-switch v-model="editForm.isEnabled"
                                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.isVisible')">
                      <el-switch v-model="editForm.isVisible"
                                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
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
  import { post, sanitizeHtml } from '@/utils/request'
  import { GET_PROGRAM_PAGES_API, GET_PROGRAM_ENTITY_API, INSERST_PROGRAM_API, DELETE_PROGRAM_API, GET_DOMAIN_DROP_API, GET_MODULE_DROP_API, UPDATE_PROGRAM_API, GET_MENU_TYPE_API } from '@/config/api/systemBasicmgmt/system-mgmt/program'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

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

  // 过滤用模块列表
  const filterModuleList = ref([])

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      menuId: '',
      parentMenuId: '',
      domainId: '',
      menuCode: '',
      menuNameCh: '',
      menuNameEn: '',
      menuType: '',
      menuUrl: '',
      menuIcon: '',
      sortOrder: 1,
      roleCode: '',
      isEnabled: true,
      isVisible: true,
      level: 1,
      routePath: '',
      path: '',
      component: '',
      target: '',
      remarks: ''
  })
  // 对话框标题
  const dialogTitle = ref('')

  // 表单验证规则
  const formRules = reactive({
      menuCode: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseInputProgramCode'), trigger: 'blur' }
      ],
      menuNameCh: [
{ required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseInputProgramNameCh'), trigger: 'blur' }
      ],
      menuNameEn: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseInputProgramNameEn'), trigger: 'blur' }
      ],
      domainId: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseSelectDomain'), trigger: 'change' }
      ],
      parentMenuId: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseSelectModule'), trigger: 'change' }
      ],
      menuIcon: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseInputProgramIcon'), trigger: 'blur' }
      ],
      sortOrder: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseInputSortOrder'), trigger: 'blur' }
      ],
      path: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseInputPagePath'), trigger: 'blur' }
      ],
      menuType: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseSelectProgramType'), trigger: 'change' }
      ],
      roleCode: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseInputRoleCode'), trigger: 'blur' }
      ],
      routePath: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseInputApiRoute'), trigger: 'blur' }
      ],
      component: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.program.pleaseInputComponent'), trigger: 'blur' }
      ],
      target: [
          // target (Redirect) 可为空，移除必填验证
      ]
  })

  // 在组件挂载后获取日志数据
  onMounted(() => {
      initPageData() // 初始化页面数据，设置查询表单默认值
      fetchMenuTypeOptions() // 获取菜单类型选项
  })

  // 初始化页面数据（只在页面加载时调用）
  const initPageData = async () => {
      try {
          const res = await post(GET_DOMAIN_DROP_API.GET_DOMAIN_TYPE)
          // 对获取的数据进行XSS清洗
          domainDropList.value = res.data || []

          // 默认选中第一个网域（用于查询表单）
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

  // 获取网域类型（不会影响查询表单的值）
  const fetchDomainDrop = async () => {
      try {
          const res = await post(GET_DOMAIN_DROP_API.GET_DOMAIN_TYPE)
          // 对获取的数据进行XSS清洗
          domainDropList.value = res.data || []

          // 如果是新增操作，默认选中第一个网域
          if (dialogTitle.value === t('systemBasicmgmt.systemMgmt.program.addProgram') && domainDropList.value.length > 0) {
              editForm.domainId = domainDropList.value[0].domainId
              // 网域选择后联动获取模块数据，并设置默认值
              fetchModuleDrop(true)
          }
      } catch (error) {

      }
  }

  // 获取模块下拉框
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

          // 只有在明确指定需要设置默认值且是新增操作时才设置默认值
          if (setDefaultValue && dialogTitle.value === t('systemBasicmgmt.systemMgmt.program.addProgram') && moduleDropList.value.length > 0) {
              editForm.parentMenuId = moduleDropList.value[0].menuId
          }
      } catch (error) {

      }
  }

  // 获取程序实体数据
  const fetchProgramEntity = async (menuId) => {
      try {
          const params = {
              menuId: menuId
          }
          const res = await post(GET_PROGRAM_ENTITY_API.GET_PROGRAM_ENTITY, params)

          if (res && res.code === '200') {
              // 先保存原始的 parentMenuId 值
              const originalParentMenuId = res.data.parentMenuId
              
              // 对字符串类型字段进行额外的XSS清洗
              editForm.menuId = res.data.menuId
              editForm.menuCode = sanitizeHtml(res.data.menuCode || '')
              editForm.menuNameCh = sanitizeHtml(res.data.menuNameCh || '')
              editForm.menuNameEn = sanitizeHtml(res.data.menuNameEn || '')
              editForm.domainId = res.data.domainId
              editForm.menuType = res.data.menuType
              editForm.menuUrl = sanitizeHtml(res.data.menuUrl || '')
              editForm.menuIcon = sanitizeHtml(res.data.menuIcon || '')
              editForm.sortOrder = res.data.sortOrder
              editForm.roleCode = sanitizeHtml(res.data.roleCode || '')
              editForm.path = sanitizeHtml(res.data.path || '')
              editForm.component = sanitizeHtml(res.data.component || '')
              editForm.target = sanitizeHtml(res.data.target || '')
              editForm.remarks = sanitizeHtml(res.data.remarks || '')
              editForm.isEnabled = res.data.isEnabled
              editForm.isVisible = res.data.isVisible
              editForm.level = res.data.level
              editForm.routePath = sanitizeHtml(res.data.routePath || '')

              // 加载网域后，联动获取模块列表（编辑时不设置默认值）
              if (editForm.domainId) {
                  await fetchModuleDrop(false)
                  // 在模块列表加载完成后，恢复原始的 parentMenuId 值
                  editForm.parentMenuId = originalParentMenuId
              }
          }
      } catch (error) {

      }
  }

  // 获取域列表数据
  const fetchProgramPages = async () => {
      loading.value = true
      try {
          const params = {
              ...filters,
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize
          }

          const res = await post(GET_PROGRAM_PAGES_API.GET_PROGRAM_PAGES, params)

          // 在设置数据前，确保使用sanitizeHtml清洗敏感字段
          programList.value = res.data || []
          pagination.total = res.totalNumber || 0
      } catch (error) {

      } finally {
          loading.value = false
      }
  }

  // 处理搜索操作
  const handleSearch = () => {
      pagination.pageIndex = 1
      fetchProgramPages()
  }

  // 重置搜索条件
  const handleReset = async () => {
      filters.programCode = ''
      filters.programName = ''
      filters.programUrl = ''
      
      // 重置为默认的第一个网域和模块
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
      fetchProgramPages()
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchProgramPages()
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchProgramPages()
  }

  const resetForm = (clearValidation = true) => {
      // 先清除验证状态（在重置数据之前）
      if (clearValidation && editFormRef.value) {
          try {
              // 针对下拉框字段单独清除验证
              const selectFields = ['domainId', 'parentMenuId', 'menuType']
              selectFields.forEach(field => {
                  editFormRef.value.clearValidate(field)
              })
              // 然后清除所有验证
              editFormRef.value.clearValidate()
          } catch (error) {
              console.warn('清除表单验证状态失败:', error)
          }
      }
      
      // 重置表单数据
      Object.assign(editForm, {
          menuId: '',
          menuCode: '',
          menuNameCh: '',
          menuNameEn: '',
          menuType: '',
          menuUrl: '',
          component: '',
          target: '',
          path: '',
          roleCode: '',
          menuIcon: '',
          sortOrder: 1,
          isEnabled: true,
          isVisible: true,
          routePath: '',
          remarks: ''
      })
      
      // 数据重置后再次清除验证状态
      if (clearValidation) {
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
  }

  // 新增程序列表数据
  const insertProgram = async () => {
      // 检查必填字段
      if (!editForm.domainId) {
          ElMessage.warning(t('systemBasicmgmt.systemMgmt.program.pleaseSelectDomain'))
          return
      }

      // 处理数值类型字段
      const params = {
          ...editForm,
      }
      const res = await post(INSERST_PROGRAM_API.INSERST_PROGRAM, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message)
          fetchProgramPages()
          dialogVisible.value = false
      } else {
          ElMessage.error(res.message)
      }
  }

  // 更新程序列表数据
  const updateProgram = async () => {
      // 检查必填字段
      if (!editForm.domainId) {
          ElMessage.warning(t('systemBasicmgmt.systemMgmt.program.pleaseSelectDomain'))
          return
      }

      // 处理数值类型字段
      const params = {
          ...editForm
      }

      const res = await post(UPDATE_PROGRAM_API.UPDATE_PROGRAM, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message)
          dialogVisible.value = false
          fetchProgramPages()
      } else {
          ElMessage.error(res.message)
      }
  }

  // 删除程序列表数据
  const deleteProgram = async (menuId) => {
      const params = {
          menuId: menuId
      }

      if (isNaN(params.menuId)) {
          ElMessage.error(t('systemBasicmgmt.systemMgmt.invalidId'))
          return
      }

      const res = await post(DELETE_PROGRAM_API.DELETE_PROGRAM, params)

      if (res && res.code === '200') {
          ElMessage.success(res.message)
          dialogVisible.value = false
          fetchProgramPages()
      } else {
          ElMessage.error(res.message)
      }
  }

  // 处理新增操作
  const handleAdd = () => {
      // 重置表单数据
      resetForm()
      // 设置默认值
      editForm.menuId = '0'
      editForm.sortOrder = 1
      editForm.isEnabled = true
      editForm.isVisible = true

      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.systemMgmt.program.addProgram')

      // 获取网域类型和菜单类型
      fetchDomainDrop()
      fetchMenuTypeOptions()

      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑操作
  const handleEdit = async (index, row) => {
      // 重置表单数据
      resetForm()

      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.systemMgmt.program.editProgram')

      // 先获取网域类型和菜单类型
      await fetchDomainDrop()
      await fetchMenuTypeOptions()
      
      // 然后获取程序实体数据（这会自动加载对应的模块列表）
      await fetchProgramEntity(row.menuId)

      // 显示对话框
      dialogVisible.value = true
      
      // 在数据加载完成后再次清除验证状态
      setTimeout(() => {
          if (editFormRef.value) {
              editFormRef.value.clearValidate()
          }
      }, 100)
  }

  // 处理对话框关闭
  const handleDialogClose = () => {
      // 使用 nextTick 确保 DOM 更新完成后再清除验证
      nextTick(() => {
          resetForm(true)
      })
  }

  // 处理删除操作
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('systemBasicmgmt.systemMgmt.program.deleteConfirm'),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning',
          }
      )
          .then(() => {
              deleteProgram(row.menuId)
              // 重新获取数据
              fetchProgramPages()
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
              const isNewModule = !editForm.menuId || editForm.menuId === '' || editForm.menuId === '0'

              if (isNewModule) {
                  insertProgram()
              } else {
                  updateProgram()
              }
              dialogVisible.value = false

              // 重新获取数据
              fetchProgramPages()
          }
      })
  }

  // 处理网域变化事件
  const handleDomainChange = () => {
      // 清空模块选择
      editForm.parentMenuId = ''
      // 重新获取模块列表，并在新增时设置默认值
      fetchModuleDrop(true)
  }

  // 处理查询表单中网域变化（用户手动操作）
  const handleFilterDomainChange = () => {
      // 清空模块选择
      filters.parentMenuId = ''
      // 重新获取模块列表，并设置默认值
      fetchFilterModuleDrop()
  }

  // 获取查询表单中的模块下拉框数据
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
              menuTypeOptions.value = res.data || []
          } else {
              menuTypeOptions.value = []
          }
      } catch (error) {
          console.error('获取菜单类型数据失败:', error)
          menuTypeOptions.value = []
      }
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style> 

