<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="模块搜索表单">
              <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.domain')">
                  <el-select style="width: 180px" 
                            v-model="filters.domainId" 
                            :placeholder="$t('systemBasicmgmt.systemMgmt.selectPlaceholder') + $t('systemBasicmgmt.systemMgmt.module.domain')">
                      <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.menuCode')">
                  <el-input v-model="filters.menuCode" :placeholder="$t('systemBasicmgmt.systemMgmt.inputPlaceholder') + $t('systemBasicmgmt.systemMgmt.module.menuCode')" style="width:170px" />
              </el-form-item>
              <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.menuName')">
                  <el-input v-model="filters.menuName" :placeholder="$t('systemBasicmgmt.systemMgmt.inputPlaceholder') + $t('systemBasicmgmt.systemMgmt.module.menuName')" style="width:200px" />
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
                      {{ $t('systemBasicmgmt.systemMgmt.module.addModule') }}
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
                  <el-table-column type="index" :label="$t('systemBasicmgmt.systemMgmt.index')" width="60" align="center" fixed />
                  <el-table-column prop="menuCode" :label="$t('systemBasicmgmt.systemMgmt.module.menuCode')" align="left" min-width="200" />
                  <el-table-column prop="menuNameCn" :label="$t('systemBasicmgmt.systemMgmt.module.menuNameCn')" align="left" min-width="170" />
                  <el-table-column prop="menuNameEn" :label="$t('systemBasicmgmt.systemMgmt.module.menuNameEn')" align="left" min-width="170" />
                  <el-table-column prop="roleCode" :label="$t('systemBasicmgmt.systemMgmt.module.roleCode')" align="center" min-width="130" />
                  <el-table-column prop="path" :label="$t('systemBasicmgmt.systemMgmt.module.pagePath')" align="left" min-width="230" />
                  <el-table-column prop="menuIcon" :label="$t('systemBasicmgmt.systemMgmt.module.menuIcon')" align="center" min-width="120" />
                  <el-table-column prop="isEnabled" :label="$t('systemBasicmgmt.systemMgmt.isEnabled')" align="center" min-width="90">
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
                  <el-table-column :label="$t('systemBasicmgmt.systemMgmt.operation')" min-width="150" fixed="right">
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
              <el-pagination v-model:current-page="pagination.currentPage"
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
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.menuCode')" prop="menuCode">
                      <el-input v-model="editForm.menuCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.menuNameCn')" prop="menuNameCn">
                      <el-input v-model="editForm.menuNameCn" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.menuNameEn')" prop="menuNameEn">
                      <el-input v-model="editForm.menuNameEn" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.domain')" prop="domainId">
                      <el-select v-model="editForm.domainId" style="width:100%" :placeholder="$t('systemBasicmgmt.systemMgmt.module.pleaseSelectDomain')">
                          <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
                      </el-select>
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.menuIcon')" prop="menuIcon">
                      <el-input v-model="editForm.menuIcon" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.sortOrder')" prop="sortOrder">
                      <el-input v-model.number="editForm.sortOrder" type="number" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.roleCode')" prop="roleCode">
                      <el-input v-model="editForm.roleCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.level')" prop="level">
                      <el-input v-model.number="editForm.level" type="number" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.pagePath')" prop="path">
                      <el-input v-model="editForm.path" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.component')" prop="component">
                      <el-input v-model="editForm.component" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.module.target')" prop="target">
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
  import { post } from '@/utils/request'
  import { GET_MODULE_PAGES_API, GET_MODULE_ENTITY_API, INSERST_MODULE_API, DELETE_MODULE_API, GET_DOMAIN_DROP_API, UPDATE_MODULE_API } from '@/config/api/systemBasicmgmt/system-mgmt/module'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  // 模块数据
  const moduleList = ref([])
  const loading = ref(false)
  const domainDropList = ref([])

  // 表单引用
  const editFormRef = ref(null)

  // 分页信息
  const pagination = reactive({
      currentPage: 1,
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
      menuType: 1,
      menuUrl: '',
      menuIcon: '',
      sortOrder: 1,
      roleCode: '',
      isEnabled: true,
      isVisible: true,
      level: 1,
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
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseInputMenuCode'), trigger: 'blur' }
      ],
      menuNameCn: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseInputMenuNameCn'), trigger: 'blur' }
      ],
      menuNameEn: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseInputMenuNameEn'), trigger: 'blur' }
      ],
      domainId: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseSelectDomain'), trigger: 'change' }
      ],
      menuIcon: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseInputMenuIcon'), trigger: 'blur' }
      ],
      sortOrder: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseInputSortOrder'), trigger: 'blur' }
      ],
      roleCode: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseInputRoleCode'), trigger: 'blur' }
      ],
      level: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseInputLevel'), trigger: 'blur' }
      ],
      path: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseInputPagePath'), trigger: 'blur' }
      ],
      component: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseInputComponent'), trigger: 'blur' }
      ],
      target: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.module.pleaseInputTarget'), trigger: 'blur' }
      ]
  })

  // 在组件挂载后获取日志数据
  onMounted(() => {
      fetchDomainDrop() // 先获取网域，设置默认值后再查询数据
  })

  // 获取网域类型
  const fetchDomainDrop = async () => {
      try {
          const res = await post(GET_DOMAIN_DROP_API.GET_DOMAIN_TYPE)
          domainDropList.value = res.data || []

          // 默认选中第一个网域
          if (domainDropList.value.length > 0) {
              filters.domainId = domainDropList.value[0].domainId
          }

          // 如果是新增操作，默认选中第一个模块
          if (dialogTitle.value === t('systemBasicmgmt.systemMgmt.module.addModule') && domainDropList.value.length > 0) {
              editForm.domainId = domainDropList.value[0].domainId
          }

          // 应用默认值进行初始查询
          fetchModulePages()
      } catch (error) {
          if (error.name === 'CanceledError') {
              // 请求被取消，不显示错误信息
              return
          }
          console.error('获取网域数据失败:', error)
          ElMessage.error('获取网域数据失败，请刷新页面重试')
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
              editForm.menuType = res.data.menuType
              editForm.menuUrl = res.data.menuUrl
              editForm.menuIcon = res.data.menuIcon
              editForm.sortOrder = res.data.sortOrder
              editForm.roleCode = res.data.roleCode
              editForm.path = res.data.path
              editForm.component = res.data.component
              editForm.target = res.data.target
              editForm.remarks = res.data.remarks
              editForm.isEnabled = res.data.isEnabled
              editForm.isVisible = res.data.isVisible
              editForm.level = res.data.level
          }
      } catch (error) {
          if (error.name === 'CanceledError') {
              // 请求被取消，不显示错误信息
              return
          }
          console.error('获取模块实体数据失败:', error)
          ElMessage.error('获取模块数据失败，请重试')
      }
  }

  // 获取域列表数据
  const fetchModulePages = async () => {
      loading.value = true
      try {
          const params = {
              ...filters,
              pageNumber: pagination.currentPage,
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
          ElMessage.error('获取数据失败，请重试')
      } finally {
          loading.value = false
      }
  }

  // 处理搜索操作
  const handleSearch = () => {
      pagination.currentPage = 1
      fetchModulePages()
  }

  // 重置搜索条件
  const handleReset = () => {
      filters.menuCode = ''
      filters.menuName = ''
      filters.menuUrl = ''
      filters.domainId = ''
      pagination.currentPage = 1
      fetchModulePages()
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.currentPage = page
      fetchModulePages()
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.currentPage = 1
      fetchModulePages()
  }

  const resetForm = (clearValidation = true) => {
      // 先清除验证状态（在重置数据之前）
      if (clearValidation && editFormRef.value) {
          try {
              // 针对下拉框字段单独清除验证
              const selectFields = ['domainId']
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
          menuType: 1,
          menuUrl: '',
          component: '',
          target: '',
          path: '',
          roleCode: '',
          menuIcon: '',
          sortOrder: 1,
          isEnabled: true,
          isVisible: true,
          level: 1,
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
          ElMessage.warning(t('systemBasicmgmt.systemMgmt.module.pleaseSelectDomain'))
          return
      }

      // 处理数值类型字段
      const params = {
          ...editForm,
      }


      const res = await post(INSERST_MODULE_API.INSERST_MODULE, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message)
          fetchModulePages()
      } else {
          ElMessage.error(res.message)
      }
  }

  // 更新域列表数据
  const updateModule = async () => {
      // 检查必填字段
      if (!editForm.domainId) {
          ElMessage.warning(t('systemBasicmgmt.systemMgmt.module.pleaseSelectDomain'))
          return
      }

      // 处理数值类型字段
      const params = {
          ...editForm
      }
      const res = await post(UPDATE_MODULE_API.UPDATE_MODULE, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message)
          dialogVisible.value = false
          fetchModulePages()
      } else {
          ElMessage.error(res.message)
      }
  }

  // 删除域列表数据
  const deleteDomain = async (menuId) => {
      const params = {
          menuId: menuId
      }

      if (isNaN(params.menuId)) {
          ElMessage.error(t('systemBasicmgmt.systemMgmt.invalidId'))
          return
      }

      const res = await post(DELETE_MODULE_API.DELETE_MODULE, params)

      if (res && res.code === '200') {
          ElMessage.success(res.message)
          dialogVisible.value = false
          fetchModulePages()
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
      editForm.parentMenuId = '0'
      editForm.menuType = 1
      editForm.sortOrder = 1
      editForm.level = 1
      editForm.isEnabled = true
      editForm.isVisible = true

      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.systemMgmt.module.addModule')

      // 获取网域类型
      fetchDomainDrop()
      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑操作
  const handleEdit = (index, row) => {
      // 重置表单数据
      resetForm()

      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.systemMgmt.module.editModule')

      // 获取网域类型
      fetchDomainDrop()

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
          t('systemBasicmgmt.systemMgmt.module.deleteConfirm'),
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
