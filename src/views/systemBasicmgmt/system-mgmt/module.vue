<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="模块搜索表单">
              <el-form-item :label="$t('SystemBasicMgmt.module.domain')">
                  <el-select style="width: 180px" 
                            v-model="filters.domainId" 
                            :placeholder="$t('SystemBasicMgmt.selectPlaceholder') + $t('SystemBasicMgmt.module.domain')">
                      <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" :disabled="item.disabled" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.module.menuCode')">
                  <el-input v-model="filters.menuCode" :placeholder="$t('SystemBasicMgmt.inputPlaceholder') + $t('SystemBasicMgmt.module.menuCode')" style="width:170px" />
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.module.menuName')">
                  <el-input v-model="filters.menuName" :placeholder="$t('SystemBasicMgmt.inputPlaceholder') + $t('SystemBasicMgmt.module.menuName')" style="width:200px" />
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
                      {{ $t('SystemBasicMgmt.module.addModule') }}
                  </el-button>
              </div>
          </el-form>

          <!-- 表格区域 -->
          <div class="table-container">
              <el-table :data="moduleList"
                        style="width: 100%"
                        border
                        stripe
                        max-height="calc(100vh - 240px)"
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('SystemBasicMgmt.index')" width="70" align="center" fixed />
                  <el-table-column prop="menuCode" :label="$t('SystemBasicMgmt.module.menuCode')" align="left" min-width="180" />
                  <el-table-column prop="menuNameCn" :label="$t('SystemBasicMgmt.module.menuNameCn')" align="left" min-width="230" />
                  <el-table-column prop="menuNameEn" :label="$t('SystemBasicMgmt.module.menuNameEn')" align="left" min-width="200" />
                  <el-table-column prop="menuTypeName" :label="$t('SystemBasicMgmt.module.menuType')" align="center" min-width="150" />
                  <el-table-column prop="roleCode" :label="$t('SystemBasicMgmt.module.roleCode')" align="center" min-width="130" />
                  <el-table-column prop="path" :label="$t('SystemBasicMgmt.module.pagePath')" align="left" min-width="280" />
                  <el-table-column prop="menuIcon" :label="$t('SystemBasicMgmt.module.menuIcon')" align="center" min-width="170" />
                  <el-table-column prop="isEnabled" :label="$t('SystemBasicMgmt.isEnabled')" align="center" min-width="120">
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
                  <el-table-column :label="$t('SystemBasicMgmt.operation')" min-width="150" fixed="right" align="center">
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
          <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="模块编辑表单">
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.module.menuCode')" prop="menuCode">
                      <el-input v-model="editForm.menuCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.module.menuNameCn')" prop="menuNameCn">
                      <el-input v-model="editForm.menuNameCn" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.module.menuNameEn')" prop="menuNameEn">
                      <el-input v-model="editForm.menuNameEn" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.module.domain')" prop="domainId">
                      <el-select v-model="editForm.domainId" style="width:100%" clearable :placeholder="$t('SystemBasicMgmt.module.pleaseSelectDomain')">
                          <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" :disabled="item.disabled" />
                      </el-select>
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.module.menuIcon')" prop="menuIcon">
                      <el-input v-model="editForm.menuIcon" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.module.sortOrder')" prop="sortOrder">
                      <el-input-number v-model="editForm.sortOrder" style="width:100%" :min="1" :precision="0" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.module.roleCode')" prop="roleCode">
                      <el-input v-model="editForm.roleCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.module.menuType')" prop="menuType">
                      <el-select v-model="editForm.menuType" style="width:100%" clearable :placeholder="$t('SystemBasicMgmt.module.pleaseSelectMenuType')">
                          <el-option
                              v-for="item in menuTypeOptions"
                              :key="item.menuTypeCode"
                              :label="item.menuTypeName"
                              :value="item.menuTypeCode" />
                      </el-select>
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.module.pagePath')" prop="path">
                      <el-input v-model="editForm.path" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.module.redirect')" prop="redirect">
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
                                 :active-text="$t('common.yes')"
                                 :inactive-text="$t('common.no')"
                                 inline-prompt
                                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.isVisible')">
                      <el-switch v-model="editForm.isVisible"
                                 :active-value="1"
                                 :inactive-value="0"
                                 :active-text="$t('common.yes')"
                                 :inactive-text="$t('common.no')"
                                 inline-prompt
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
  import { GET_MODULE_PAGES_API, GET_MODULE_ENTITY_API, INSERT_MODULE_API, DELETE_MODULE_API, GET_DOMAIN_DROP_API, UPDATE_MODULE_API, GET_MENU_TYPE_API } from '@/config/api/SystemBasicMgmt/System-Mgmt/module'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // 模块数据
  const moduleList = ref([])
  const loading = ref(false)
  const domainDropList = ref([])
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
      menuCode: '',
      menuName: '',
      menuNameEn: '',
      menuUrl: '',
      domainId: ''
  })

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      menuId: '',
      parentMenuId: '0',
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
      path: '',
      redirect: '',
      remarks: ''
  })
  // 对话框标题
  const dialogTitle = ref('')

  // 表单验证规则
  const formRules = reactive({
      menuCode: [
          { required: true, message: () => t('SystemBasicMgmt.module.pleaseInputMenuCode'), trigger: 'blur' }
      ],
      menuNameCn: [
{ required: true, message: () => t('SystemBasicMgmt.module.pleaseInputMenuNameCn'), trigger: 'blur' }
      ],
      menuNameEn: [
          { required: true, message: () => t('SystemBasicMgmt.module.pleaseInputMenuNameEn'), trigger: 'blur' }
      ],
      domainId: [
          { required: true, message: () => t('SystemBasicMgmt.module.pleaseSelectDomain'), trigger: 'change' }
      ],
      menuIcon: [
          { required: true, message: () => t('SystemBasicMgmt.module.pleaseInputMenuIcon'), trigger: 'blur' }
      ],
      sortOrder: [
          { required: true, message: () => t('SystemBasicMgmt.module.pleaseInputSortOrder'), trigger: 'blur' }
      ],
      roleCode: [
          { required: true, message: () => t('SystemBasicMgmt.module.pleaseInputRoleCode'), trigger: 'blur' }
      ],
      menuType: [
          { required: true, message: () => t('SystemBasicMgmt.module.pleaseSelectMenuType'), trigger: 'change' }
      ],
      path: [
          { required: true, message: () => t('SystemBasicMgmt.module.pleaseInputPagePath'), trigger: 'blur' }
      ],
      redirect: [
          // redirect 可为空，移除必填验证
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
          domainDropList.value = res.data || []

          // 默认选中第一个未禁用的网域（用于查询表单）
          if (domainDropList.value.length > 0) {
              const firstEnabledDomain = domainDropList.value.find(item => !item.disabled)
              if (firstEnabledDomain) {
                  filters.domainId = firstEnabledDomain.domainId
              }
          }

          // 应用默认值进行初始查询
          fetchModulePages()
      } catch (error) {
          if (error.name === 'CanceledError') {
              // 请求被取消，不显示错误信息
              return
          }
          console.error('获取网域数据失败:', error)
          ElMessage({
            message: '获取网域数据失败，请刷新页面重试',
            type: 'error',
            plain: true,
            showClose: true,
          })
      }
  }

  // 获取网域类型（不会影响查询表单的值）
  const fetchDomainDrop = async () => {
      try {
          const res = await post(GET_DOMAIN_DROP_API.GET_DOMAIN_TYPE)
          domainDropList.value = res.data || []

          // 如果是新增操作，默认选中第一个未禁用的网域
          if (dialogTitle.value === t('SystemBasicMgmt.module.addModule') && domainDropList.value.length > 0) {
              const firstEnabledDomain = domainDropList.value.find(item => !item.disabled)
              if (firstEnabledDomain) {
                  editForm.domainId = firstEnabledDomain.domainId
              }
          }
      } catch (error) {
          if (error.name === 'CanceledError') {
              // 请求被取消，不显示错误信息
              return
          }
          console.error('获取网域数据失败:', error)
          ElMessage({
            message: '获取网域数据失败，请刷新页面重试',
            type: 'error',
            plain: true,
            showClose: true,
          })
      }
  }

  // 获取菜单类型选项
  const fetchMenuTypeOptions = async () => {
      try {
          const res = await post(GET_MENU_TYPE_API.GET_MENU_TYPE)
          if (res && res.code === '200') {
              // 确保 menuTypeCode 为字符串类型
              menuTypeOptions.value = (res.data || []).map(item => ({
                  ...item,
                  menuTypeCode: String(item.menuTypeCode)
              }))
          } else {
              menuTypeOptions.value = []
          }
      } catch (error) {
          console.error('获取菜单类型数据失败:', error)
          menuTypeOptions.value = []
      }
  }

  // 获取模块实体数据
  const fetchModuleEntity = async (menuId) => {
      try {
          const params = {
              menuId: menuId
          }
          const res = await post(GET_MODULE_ENTITY_API.GET_MODULE_ENTITY, params)

          if (res && res.code === '200') {
              editForm.menuId = res.data.menuId
              editForm.menuCode = res.data.menuCode
              editForm.menuNameCn = res.data.menuNameCn
              editForm.menuNameEn = res.data.menuNameEn
              editForm.parentMenuId = res.data.parentMenuId
              editForm.domainId = res.data.domainId
              editForm.menuType = String(res.data.menuType || '')
              editForm.menuUrl = res.data.menuUrl
              editForm.menuIcon = res.data.menuIcon
              editForm.sortOrder = res.data.sortOrder
              editForm.roleCode = res.data.roleCode
              editForm.path = res.data.path
              editForm.redirect = res.data.redirect
              editForm.remarks = res.data.remarks
              editForm.isEnabled = res.data.isEnabled
              editForm.isVisible = res.data.isVisible
          }
      } catch (error) {
          if (error.name === 'CanceledError') {
              // 请求被取消，不显示错误信息
              return
          }
          console.error('获取模块实体数据失败:', error)
          ElMessage({
            message: '获取模块数据失败，请重试',
            type: 'error',
            plain: true,
            showClose: true,
          })
      }
  }

  // 获取域列表数据
  const fetchModulePages = async () => {
      loading.value = true
      try {
          const params = {
              ...filters,
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize
          }
          const res = await post(GET_MODULE_PAGES_API.GET_MODULE_PAGES, params)

          moduleList.value = res.data || []
          pagination.total = res.totalNumber || 0
      } catch (error) {
          if (error.name === 'CanceledError') {
              // 请求被取消，不显示错误信息
              return
          }
          console.error('获取模块列表失败:', error)
          ElMessage({
            message: '获取数据失败，请重试',
            type: 'error',
            plain: true,
            showClose: true,
          })
      } finally {
          loading.value = false
      }
  }

  // 处理搜索操作
  const handleSearch = () => {
      pagination.pageIndex = 1
      fetchModulePages()
  }

  // 重置搜索条件
  const handleReset = () => {
      filters.menuCode = ''
      filters.menuName = ''
      filters.menuUrl = ''
      
      // 重置为默认的第一个未禁用的网域
      if (domainDropList.value.length > 0) {
          const firstEnabledDomain = domainDropList.value.find(item => !item.disabled)
          if (firstEnabledDomain) {
              filters.domainId = firstEnabledDomain.domainId
          } else {
              filters.domainId = ''
          }
      } else {
          filters.domainId = ''
      }
      
      pagination.pageIndex = 1
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchModulePages()
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchModulePages()
  }

  const resetForm = (clearValidation = true) => {
      // 先清除验证状态（在重置数据之前）
      if (clearValidation && editFormRef.value) {
          try {
              // 针对下拉框字段单独清除验证
              const selectFields = ['domainId', 'menuType']
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
          parentMenuId: '0',
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

  // 新增域列表数据
  const insertModule = async () => {
      // 检查必填字段
      if (!editForm.domainId) {
          ElMessage({
            message: t('SystemBasicMgmt.module.pleaseSelectDomain'),
            type: 'warning',
            plain: true,
            showClose: true,
          })
          return
      }

      // 处理数值类型字段
      const params = {
          ...editForm,
          redirect: editForm.redirect
      }
      const res = await post(INSERT_MODULE_API.INSERT_MODULE, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage({
            message: res.message,
            type: 'success',
            plain: true,
            showClose: true,
          })
          fetchModulePages()
      } else {
          ElMessage({
            message: res.message,
            type: 'error',
            plain: true,
            showClose: true,
          })
      }
  }

  // 更新域列表数据
  const updateModule = async () => {
      // 检查必填字段
      if (!editForm.domainId) {
          ElMessage({
            message: t('SystemBasicMgmt.module.pleaseSelectDomain'),
            type: 'warning',
            plain: true,
            showClose: true,
          })
          return
      }

      // 处理数值类型字段
      const params = {
          ...editForm,
          redirect: editForm.redirect
      }
      const res = await post(UPDATE_MODULE_API.UPDATE_MODULE, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage({
            message: res.message,
            type: 'success',
            plain: true,
            showClose: true,
          })
          dialogVisible.value = false
          fetchModulePages()
      } else {
          ElMessage({
            message: res.message,
            type: 'error',
            plain: true,
            showClose: true,
          })
      }
  }

  // 删除域列表数据
  const deleteDomain = async (menuId) => {
      const params = {
          menuId: menuId
      }

      if (isNaN(params.menuId)) {
          ElMessage({
            message: t('SystemBasicMgmt.invalidId'),
            type: 'error',
            plain: true,
            showClose: true,
          })
          return
      }

      const res = await post(DELETE_MODULE_API.DELETE_MODULE, params)

      if (res && res.code === '200') {
          ElMessage({
            message: res.message,
            type: 'success',
            plain: true,
            showClose: true,
          })
          dialogVisible.value = false
          fetchModulePages()
      } else {
          ElMessage({
            message: res.message,
            type: 'error',
            plain: true,
            showClose: true,
          })
      }
  }

  // 处理新增操作
  const handleAdd = () => {
      // 重置表单数据
      resetForm()
      // 设置默认值
      editForm.menuId = '0'
      editForm.parentMenuId = '0'
      editForm.sortOrder = 1
      editForm.isEnabled = 1
      editForm.isVisible = 1

      // 设置对话框标题
      dialogTitle.value = t('SystemBasicMgmt.module.addModule')

      // 获取网域类型和菜单类型
      fetchDomainDrop()
      fetchMenuTypeOptions()
      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑操作
  const handleEdit = (index, row) => {
      // 重置表单数据
      resetForm()

      // 设置对话框标题
      dialogTitle.value = t('SystemBasicMgmt.module.editModule')

      // 获取网域类型和菜单类型
      fetchDomainDrop()
      fetchMenuTypeOptions()

      // 获取网域实体数据
      fetchModuleEntity(row.menuId)

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
          t('SystemBasicMgmt.module.deleteConfirm'),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning',
          }
      )
          .then(() => {
              deleteDomain(row.menuId)
              // 重新获取数据
              fetchModulePages()
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
                  insertModule()
              } else {
                  updateModule()
              }
              dialogVisible.value = false

              // 重新获取数据
              fetchModulePages()
          }
      })
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

