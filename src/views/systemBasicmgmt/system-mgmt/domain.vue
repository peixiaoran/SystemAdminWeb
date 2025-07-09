<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="域搜索表单">
              <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.domainCode')">
                  <el-input v-model="filters.domainCode" :placeholder="$t('systemBasicmgmt.systemMgmt.domain.pleaseInputDomainCode')" style="width:170px" />
              </el-form-item>
              <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.domainName')">
                  <el-input v-model="filters.domainName" :placeholder="$t('systemBasicmgmt.systemMgmt.domain.pleaseInputDomainName')" style="width:200px" />
              </el-form-item>
              <el-form-item class="form-button-group">
                  <el-button type="primary" @click="handleSearch" class="conventional-filter-form-button" plain>
                      {{ $t('common.search') }}
                  </el-button>
                  <el-button @click="handleReset">
                      {{ $t('common.reset') }}
                  </el-button>
              </el-form-item>
              <el-form-item class="form-right-button">
                  <el-button type="primary" @click="handleAdd">
                      {{ $t('systemBasicmgmt.systemMgmt.domain.addDomain') }}
                  </el-button>
              </el-form-item>
          </el-form>

          <!-- 表格区域 -->
          <div class="table-container">
              <el-table :data="domainList"
                        style="width: 100%"
                        border
                        stripe
                        max-height="calc(100vh - 240px)"
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('systemBasicmgmt.systemMgmt.index')" width="60" align="center" fixed />
                  <el-table-column prop="domainCode" :label="$t('systemBasicmgmt.systemMgmt.domain.domainCode')" align="left" min-width="230" />
                  <el-table-column prop="domainNameCh" :label="$t('systemBasicmgmt.systemMgmt.domain.domainNameCh')" align="left" min-width="280" />
                  <el-table-column prop="domainNameEn" :label="$t('systemBasicmgmt.systemMgmt.domain.domainNameEn')" align="left" min-width="280" />
                  <el-table-column prop="roleCode" :label="$t('systemBasicmgmt.systemMgmt.domain.roleCode')" align="center" min-width="130" />
                  <el-table-column prop="path" :label="$t('systemBasicmgmt.systemMgmt.domain.pagePath')" align="left" min-width="230" />
                  <el-table-column prop="domainIcon" :label="$t('systemBasicmgmt.systemMgmt.domain.domainIcon')" align="center" min-width="150" />
                  <el-table-column prop="isEnabled" :label="$t('systemBasicmgmt.systemMgmt.isEnabled')" align="center" min-width="120">
                      <template #default="scope">
                          <div class="flex">
                              <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                                  {{ scope.row.isEnabled ? $t('systemBasicmgmt.systemMgmt.enabled') : $t('systemBasicmgmt.systemMgmt.disabled') }}
                              </el-tag>
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="isVisible" :label="$t('systemBasicmgmt.systemMgmt.isVisible')" align="center" min-width="120">
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
                  <el-table-column :label="$t('systemBasicmgmt.systemMgmt.operation')" min-width="180" fixed="right" align="center">
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
                             @current-change="handlePageChange"/>
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
          <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="域编辑表单">
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.domainCode')" prop="domainCode">
                      <el-input v-model="editForm.domainCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.domainNameCh')" prop="domainNameCh">
<el-input v-model="editForm.domainNameCh" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.domainNameEn')" prop="domainNameEn">
                      <el-input v-model="editForm.domainNameEn" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.domainIcon')" prop="domainIcon">
                      <el-input v-model="editForm.domainIcon" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.sortOrder')" prop="sortOrder">
                      <el-input v-model="editForm.sortOrder" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.roleCode')" prop="roleCode">
                      <el-input v-model="editForm.roleCode" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.pagePath')" prop="path">
                      <el-input v-model="editForm.path" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.component')" prop="component">
                      <el-input v-model="editForm.component" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.domain.target')" prop="target">
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
                                 :active-value="1"
                                 :inactive-value="0"
                                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.systemMgmt.isVisible')">
                      <el-switch v-model="editForm.isVisible"
                                 :active-value="1"
                                 :inactive-value="0"
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
  import { GET_DOMAIN_PAGES_API, INSERST_DOMAIN_API, DELETE_DOMAIN_API, GET_DOMAIN_ENTITY_API, UPDATE_DOMAIN_API } from '@/config/api/systemBasicmgmt/system-mgmt/domain'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  // 使用i18n
  const { t } = useI18n()

  // 日志数据
  const domainList = ref([])
  const loading = ref(false)
  const domainTypeList = ref([])

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
      domainCode: '',
      domainName: '',
      domainNameEn: '',
      domainUrl: ''
  })

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      domainId: '0',
      domainCode: '',
      domainNameCh: '',
      domainNameEn: '',
      domainIcon: '',
      sortOrder: 1,
      roleCode: '',
      isEnabled: 1,
      isVisible: 1,
      level: 1,
      path: '',
      component: '',
      target: '',
      remarks: ''
  })
  // 对话框标题
  const dialogTitle = ref(t('systemBasicmgmt.systemMgmt.domain.editDomain'))

  // 表单验证规则
  const formRules = reactive({
      domainCode: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.domain.pleaseInputDomainCode'), trigger: 'blur' }
      ],
      domainNameCh: [
{ required: true, message: () => t('systemBasicmgmt.systemMgmt.domain.pleaseInputDomainNameCh'), trigger: 'blur' }
      ],
      domainNameEn: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.domain.pleaseInputDomainNameEn'), trigger: 'blur' }
      ],
      domainIcon: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.domain.pleaseInputDomainIcon'), trigger: 'blur' }
      ],
      sortOrder: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.domain.pleaseInputSortOrder'), trigger: 'blur' }
      ],
      roleCode: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.domain.pleaseInputRoleCode'), trigger: 'blur' }
      ],
      path: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.domain.pleaseInputPagePath'), trigger: 'blur' }
      ],
      component: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.domain.pleaseInputComponent'), trigger: 'blur' }
      ],
      target: [
          { required: true, message: () => t('systemBasicmgmt.systemMgmt.domain.pleaseInputTarget'), trigger: 'blur' }
      ]
  })

  // 在组件挂载后获取日志数据
  onMounted(() => {
      fetchDomainPages()
  })

  // 获取网域实体数据
  const fetchDomainEntity = async (domainId) => {
      const params = {
          domainId: domainId
      }
      const res = await post(GET_DOMAIN_ENTITY_API.GET_DOMAIN_ENTITY, params)

      if (res && res.code === '200') {
          editForm.domainId = res.data.domainId
          editForm.domainCode = res.data.domainCode
          editForm.domainNameCh = res.data.domainNameCh
          editForm.domainNameEn = res.data.domainNameEn
          editForm.domainIcon = res.data.domainIcon
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
  }

  // 获取域列表数据
  const fetchDomainPages = async () => {
      loading.value = true
      const params = {
          ...filters,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize
      }

      const res = await post(GET_DOMAIN_PAGES_API.GET_DOMAIN_PAGES, params)

      if (res && res.code === '200') {
          domainList.value = res.data || []
          pagination.total = res.totalNumber || 0
      } else {
          ElMessage.error(res.message)
      }
      loading.value = false
  }

  // 处理搜索操作
  const handleSearch = () => {
      pagination.pageIndex = 1
      fetchDomainPages()
  }

  // 重置搜索条件
  const handleReset = () => {
      filters.domainCode = ''
      filters.domainName = ''
      filters.domainUrl = ''
      pagination.pageIndex = 1
      fetchDomainPages()
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchDomainPages()
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchDomainPages()
  }

  const resetForm = (clearValidation = true) => {
      // 先清除验证状态（在重置数据之前）
      if (clearValidation && editFormRef.value) {
          try {
              editFormRef.value.clearValidate()
          } catch (error) {
              console.warn('清除表单验证状态失败:', error)
          }
      }
      
      editForm.component = ''
      editForm.target = ''
      editForm.path = ''
      editForm.roleCode = ''
      editForm.domainIcon = ''
      editForm.sortOrder = 1
      editForm.isEnabled = 1
      editForm.isVisible = 1
      editForm.domainId = '0'
      editForm.domainCode = ''
      editForm.domainNameCh = ''
      editForm.domainNameEn = ''
      
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
  const insertDomain = async () => {
      const params = {
          ...editForm
      }

      const res = await post(INSERST_DOMAIN_API.INSERST_DOMAIN, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message)
          dialogVisible.value = false
          fetchDomainPages()

      } else {
          ElMessage.error(res.message)
      }
  }

  // 更新域列表数据
  const updateDomain = async () => {
      const params = {
          ...editForm
      }
      const res = await post(UPDATE_DOMAIN_API.UPDATE_DOMAIN, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message)
          dialogVisible.value = false
          fetchDomainPages()
      } else {
          ElMessage.error(res.message)
      }
  }

  // 删除域列表数据
  const deleteDomain = async (domainId) => {
      const params = {
          domainId: domainId
      }

      if (isNaN(params.domainId)) {
          ElMessage.error(t('systemBasicmgmt.systemMgmt.invalidId'))
          return
      }

      const res = await post(DELETE_DOMAIN_API.DELETE_DOMAIN, params)

      if (res && res.code === '200') {
          ElMessage.success(res.message)
          dialogVisible.value = false
          fetchDomainPages()
      } else {
          ElMessage.error(res.message)
      }
  }

  // 处理新增操作
  const handleAdd = () => {
      // 重置表单数据
      resetForm()
      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.systemMgmt.domain.addDomain')
      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑操作
  const handleEdit = (index, row) => {
      // 重置表单数据
      resetForm()
      // 获取网域实体数据
      fetchDomainEntity(row.domainId)

      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.systemMgmt.domain.editDomain')

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
          t('systemBasicmgmt.systemMgmt.domain.deleteConfirm'),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning',
          }
      )
          .then(() => {
              deleteDomain(row.domainId)
              // 重新获取数据
              fetchDomainPages()
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
              const actionType = editForm.domainId === '0' ? '新增' : '编辑'

              if (actionType === '新增') {
                  insertDomain()
              } else {
                  updateDomain()
              }
              dialogVisible.value = false

              // 重新获取数据
              fetchDomainPages()
          }
      })
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style> 

