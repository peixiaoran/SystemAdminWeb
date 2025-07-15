<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 搜索 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="搜索">
              <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.domain.domainCode')">
                  <el-input v-model="filters.domainCode" :placeholder="$t('SystemBasicMgmt.systemMgmt.domain.pleaseInputDomainCode')" style="width:170px" />
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.domain.domainName')">
                  <el-input v-model="filters.domainName" :placeholder="$t('SystemBasicMgmt.systemMgmt.domain.pleaseInputDomainName')" style="width:200px" />
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
                      {{ $t('SystemBasicMgmt.systemMgmt.domain.addDomain') }}
                  </el-button>
              </el-form-item>
          </el-form>

          <!-- 表格 -->
          <div class="table-container">
              <el-table :data="domainList"
                        style="width: 100%"
                        border
                        stripe
                        max-height="calc(100vh - 240px)"
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('SystemBasicMgmt.systemMgmt.index')" width="60" align="center" fixed />
                  <el-table-column prop="domainCode" :label="$t('SystemBasicMgmt.systemMgmt.domain.domainCode')" align="left" min-width="230" />
                  <el-table-column prop="domainNameCh" :label="$t('SystemBasicMgmt.systemMgmt.domain.domainNameCh')" align="left" min-width="280" />
                  <el-table-column prop="domainNameEn" :label="$t('SystemBasicMgmt.systemMgmt.domain.domainNameEn')" align="left" min-width="280" />
                  <el-table-column prop="roleCode" :label="$t('SystemBasicMgmt.systemMgmt.domain.roleCode')" align="center" min-width="130" />
                  <el-table-column prop="path" :label="$t('SystemBasicMgmt.systemMgmt.domain.pagePath')" align="left" min-width="230" />
                  <el-table-column prop="domainIcon" :label="$t('SystemBasicMgmt.systemMgmt.domain.domainIcon')" align="center" min-width="150" />
                  <el-table-column prop="isEnabled" :label="$t('SystemBasicMgmt.systemMgmt.isEnabled')" align="center" min-width="120">
                      <template #default="scope">
                          <div class="flex">
                              <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                                  {{ scope.row.isEnabled ? $t('SystemBasicMgmt.systemMgmt.enabled') : $t('SystemBasicMgmt.systemMgmt.disabled') }}
                              </el-tag>
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="isVisible" :label="$t('SystemBasicMgmt.systemMgmt.isVisible')" align="center" min-width="120">
                      <template #default="scope">
                          <div class="flex">
                              <el-tag :type="scope.row.isVisible ? 'success' : 'danger'">
                                  {{ scope.row.isVisible ? $t('SystemBasicMgmt.systemMgmt.visible') : $t('SystemBasicMgmt.systemMgmt.hidden') }}
                              </el-tag>
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="createdName" :label="$t('SystemBasicMgmt.systemMgmt.createdBy')" min-width="120" />
                  <el-table-column prop="createdDate" :label="$t('SystemBasicMgmt.systemMgmt.createdTime')" min-width="180" />
                  <el-table-column :label="$t('SystemBasicMgmt.systemMgmt.operation')" min-width="180" fixed="right" align="center">
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

      <!-- 编辑状态弹窗 -->
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
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.domain.domainCode')" prop="domainCode">
                      <el-input v-model="editForm.domainCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.domain.domainNameCh')" prop="domainNameCh">
<el-input v-model="editForm.domainNameCh" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.domain.domainNameEn')" prop="domainNameEn">
                      <el-input v-model="editForm.domainNameEn" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.domain.domainIcon')" prop="domainIcon">
                      <el-input v-model="editForm.domainIcon" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.domain.sortOrder')" prop="sortOrder">
                      <el-input v-model="editForm.sortOrder" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.domain.roleCode')" prop="roleCode">
                      <el-input v-model="editForm.roleCode" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.domain.pagePath')" prop="path">
                      <el-input v-model="editForm.path" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.domain.redirect')" prop="redirect">
                      <el-input v-model="editForm.redirect" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row full-width">
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.remarks')">
                      <el-input v-model="editForm.remarks" style="width:100%" type="textarea" :rows="3" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.isEnabled')">
                      <el-switch v-model="editForm.isEnabled"
                                 :active-value="1"
                                 :inactive-value="0"
                                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.systemMgmt.isVisible')">
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
  import { GET_DOMAIN_PAGES_API, INSERT_DOMAIN_API, DELETE_DOMAIN_API, GET_DOMAIN_ENTITY_API, UPDATE_DOMAIN_API } from '@/config/api/SystemBasicMgmt/system-mgmt/domain'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  // 使用i18n
  const { t } = useI18n()

  // 网域数据
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
      redirect: '',
      remarks: ''
  })
  // 对话框标题
  const dialogTitle = ref(t('SystemBasicMgmt.systemMgmt.domain.editDomain'))

  // 表单验证规则
  const formRules = reactive({
      domainCode: [
          { required: true, message: () => t('SystemBasicMgmt.systemMgmt.domain.pleaseInputDomainCode'), trigger: 'blur' }
      ],
      domainNameCh: [
          { required: true, message: () => t('SystemBasicMgmt.systemMgmt.domain.pleaseInputDomainNameCh'), trigger: 'blur' }
      ],
      domainNameEn: [
          { required: true, message: () => t('SystemBasicMgmt.systemMgmt.domain.pleaseInputDomainNameEn'), trigger: 'blur' }
      ],
      domainIcon: [
          { required: true, message: () => t('SystemBasicMgmt.systemMgmt.domain.pleaseInputDomainIcon'), trigger: 'blur' }
      ],
      sortOrder: [
          { required: true, message: () => t('SystemBasicMgmt.systemMgmt.domain.pleaseInputSortOrder'), trigger: 'blur' }
      ],
      roleCode: [
          { required: true, message: () => t('SystemBasicMgmt.systemMgmt.domain.pleaseInputRoleCode'), trigger: 'blur' }
      ],
      path: [
          { required: true, message: () => t('SystemBasicMgmt.systemMgmt.domain.pleaseInputPagePath'), trigger: 'blur' }
      ],
      redirect: [
          // redirect 可為空，移除必填驗證
      ]
  })

  // 组件挂载后获取网域数据
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
          editForm.redirect = res.data.redirect
          editForm.remarks = res.data.remarks
          editForm.isEnabled = res.data.isEnabled
          editForm.isVisible = res.data.isVisible
          editForm.level = res.data.level
      }
  }

  // 获取网域列表
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

  // 搜索
  const handleSearch = () => {
      pagination.pageIndex = 1
      fetchDomainPages()
  }

  // 重置
  const handleReset = () => {
      filters.domainCode = ''
      filters.domainName = ''
      filters.domainUrl = ''
      pagination.pageIndex = 1
      fetchDomainPages()
  }

  // 分页变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchDomainPages()
  }

  // 每页条数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchDomainPages()
  }

  const resetForm = (clearValidation = true) => {
      // 清除表单验证状态，在提交之前
      if (clearValidation && editFormRef.value) {
          try {
              editFormRef.value.clearValidate()
          } catch (error) {
              console.warn('清除表单验证状态失败:', error)
          }
      }
      
      editForm.redirect = ''
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
      
      // 组件挂载后清除表单验证状态
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

  // 插入网域
  const insertDomain = async () => {
      const params = {
          ...editForm,
          redirect: editForm.redirect
      }

              const res = await post(INSERT_DOMAIN_API.INSERT_DOMAIN, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message)
          dialogVisible.value = false
          fetchDomainPages()

      } else {
          ElMessage.error(res.message)
      }
  }

  // 更新网域
  const updateDomain = async () => {
      const params = {
          ...editForm,
          redirect: editForm.redirect
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

  // 删除网域
  const deleteDomain = async (domainId) => {
      const params = {
          domainId: domainId
      }

      if (isNaN(params.domainId)) {
          ElMessage.error(t('SystemBasicMgmt.systemMgmt.invalidId'))
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

  // 添加网域
  const handleAdd = () => {
      // 重置表单
      resetForm()
      // 设置对话框标题
      dialogTitle.value = t('SystemBasicMgmt.systemMgmt.domain.addDomain')
      // 显示对话框
      dialogVisible.value = true
  }

  // 编辑网域
  const handleEdit = (index, row) => {
      // 重置表单
      resetForm()
      // 获取网域实体数据
      fetchDomainEntity(row.domainId)

      // 设置对话框标题
      dialogTitle.value = t('SystemBasicMgmt.systemMgmt.domain.editDomain')

      dialogVisible.value = true
      
      // 数据加载完成后清除表单验证状态
      setTimeout(() => {
          if (editFormRef.value) {
              editFormRef.value.clearValidate()
          }
      }, 100)
  }

  // 关闭对话框
  const handleDialogClose = () => {
      // 使用 nextTick 确保 DOM 渲染完成后再清除验证
      nextTick(() => {
          resetForm(true)
      })
  }

  // 删除网域
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('SystemBasicMgmt.systemMgmt.domain.deleteConfirm'),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning',
          }
      )
          .then(() => {
              deleteDomain(row.domainId)
              // 刷新列表
              fetchDomainPages()
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
              const actionType = editForm.domainId === '0' ? '新增' : '编辑'

              if (actionType === '新增') {
                  insertDomain()
              } else {
                  updateDomain()
              }
              dialogVisible.value = false

              // 刷新列表
              fetchDomainPages()
          }
      })
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style> 

