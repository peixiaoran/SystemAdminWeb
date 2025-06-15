<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="公司搜索表单">
              <el-form-item :label="$t('systemBasicmgmt.companyInfo.filter.companyName')">
                  <el-input style="width: 180px;"
                            v-model="filters.companyName"
                            :placeholder="$t('systemBasicmgmt.companyInfo.pleaseInputName')"
                            />
              </el-form-item>
              <el-form-item class="form-button-group">
                  <el-button type="primary" @click="handleSearch" plain>
                      {{ $t('common.search') }}
                  </el-button>
                  <el-button @click="handleReset">
                      {{ $t('common.reset') }}
                  </el-button>
              </el-form-item>
              <el-form-item class="form-right-button">
                  <el-button type="primary" @click="handleAdd">
                      {{ $t('systemBasicmgmt.companyInfo.addCompany') }}
                  </el-button>
              </el-form-item>
          </el-form>

          <!-- 表格区域 -->
          <div class="table-container">
              <el-table :data="companyList"
                        border
                        stripe
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('systemBasicmgmt.companyInfo.index')" width="60" align="center" fixed />
                  <el-table-column prop="companyNameCn" :label="$t('systemBasicmgmt.companyInfo.companyNameCn')" align="left" min-width="240" />
                  <el-table-column prop="companyNameEn" :label="$t('systemBasicmgmt.companyInfo.companyNameEn')" align="left" min-width="360" />
                  <el-table-column prop="companyiPhone" :label="$t('systemBasicmgmt.companyInfo.companyPhone')" align="center" min-width="280" />
                  <el-table-column prop="companyFax" :label="$t('systemBasicmgmt.companyInfo.companyFax')" align="center" min-width="300" />
                  <el-table-column prop="createdDate" :label="$t('systemBasicmgmt.companyInfo.createdTime')" min-width="180" />
                  <el-table-column prop="remark" :label="$t('systemBasicmgmt.companyInfo.remark')" align="left" min-width="450" />
                  <el-table-column :label="$t('systemBasicmgmt.companyInfo.operation')" min-width="170" fixed="right">
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
          <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="公司编辑表单">
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.companyInfo.companyNameCn')" prop="companyNameCn">
                      <el-input v-model="editForm.companyNameCn" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.companyInfo.companyNameEn')" prop="companyNameEn">
                      <el-input v-model="editForm.companyNameEn" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.companyInfo.companyPhone')" prop="companyiPhone">
                      <el-input v-model="editForm.companyiPhone" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.companyInfo.companyFax')" prop="companyFax">
                      <el-input v-model="editForm.companyFax" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row full-width">
                  <el-form-item :label="$t('systemBasicmgmt.companyInfo.remark')">
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
  import { GET_COMPANY_PAGES_API, INSERST_COMPANY_API, DELETE_COMPANY_API, GET_COMPANY_ENTITY_API, UPDATE_COMPANY_API } from '@/config/api/systemBasicmgmt/system-basic/company'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  // 初始化i18n
  const { t } = useI18n()

  // 公司数据
  const companyList = ref([])
  const loading = ref(false)

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
      companyName: '',
  })

  // Composition API

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      companyId: '',
      companyNameCn: '',
      companyNameEn: '',
      companyiPhone: '',
      companyFax: '',
      createdBy: 1,
      createdDate: '',
      modifiedBy: 1,
      modifiedDate: '',
      remark: ''
  })

  // 对话框标题
  const dialogTitle = ref(t('systemBasicmgmt.companyInfo.editCompany'))

  // 表单验证规则
  const formRules = reactive({
      companyNameCn: [
          { required: true, message: () => t('systemBasicmgmt.companyInfo.pleaseInputNameCn'), trigger: 'blur' }
      ],
      companyNameEn: [
          { required: true, message: () => t('systemBasicmgmt.companyInfo.pleaseInputNameEn'), trigger: 'blur' }
      ],
      companyiPhone: [
          { required: true, message: () => t('systemBasicmgmt.companyInfo.pleaseInputPhone'), trigger: 'blur' }
      ],
      companyFax: [
          { required: true, message: () => t('systemBasicmgmt.companyInfo.pleaseInputFax'), trigger: 'blur' }
      ]
  })

  // 在组件挂载后获取公司数据
  onMounted(() => {
      fetchCompanyPages()
  })

  // 获取公司实体数据
  const fetchCompanyEntity = async (companyId) => {
      const params = {
          companyId: companyId
      }
      
      const res = await post(GET_COMPANY_ENTITY_API.GET_COMPANY_ENTITY, params)

      if (res && res.code === '200') {
          editForm.companyId = res.data.companyId
          editForm.companyNameCn = res.data.companyNameCn
          editForm.companyNameEn = res.data.companyNameEn
          editForm.companyiPhone = res.data.companyiPhone
          editForm.companyFax = res.data.companyFax
          editForm.createdBy = res.data.createdBy
          editForm.createdDate = res.data.createdDate
          editForm.modifiedBy = res.data.modifiedBy
          editForm.modifiedDate = res.data.modifiedDate
          editForm.remark = res.data.remark
      }
  }

  // 获取公司列表数据
  const fetchCompanyPages = async () => {
      loading.value = true
      const params = {
          companyName: filters.companyName,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize
      }

      const res = await post(GET_COMPANY_PAGES_API.GET_COMPANY_PAGES, params)

      if (res && res.code === '200') {
          companyList.value = res.data || []
          pagination.total = res.totalNumber || 0
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.companyInfo.getFailed'))
      }
      loading.value = false
  }

  // 防抖搜索优化
  let searchTimer = null
  const handleSearch = () => {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
          pagination.pageIndex = 1
          fetchCompanyPages()
      }, 300) // 300ms防抖
  }

  // 重置搜索条件
  const handleReset = () => {
      filters.companyName = ''
      pagination.pageIndex = 1
      fetchCompanyPages()
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchCompanyPages()
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchCompanyPages()
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
      
      editForm.companyId = ''
      editForm.companyNameCn = ''
      editForm.companyNameEn = ''
      editForm.companyiPhone = ''
      editForm.companyFax = ''
      editForm.createdBy = 1
      editForm.createdDate = ''
      editForm.modifiedBy = 1
      editForm.modifiedDate = ''
      editForm.remark = ''
      
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

  // 新增公司数据
  const insertCompany = async () => {
      const params = {
          ...editForm
      }

      const res = await post(INSERST_COMPANY_API.INSERST_COMPANY, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message || t('systemBasicmgmt.companyInfo.saveSuccess'))
          dialogVisible.value = false
          fetchCompanyPages()
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.companyInfo.operationFailed'))
      }
  }

  // 更新公司数据
  const updateCompany = async () => {
      const params = {
          ...editForm
      }
      const res = await post(UPDATE_COMPANY_API.UPDATE_COMPANY, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message || t('systemBasicmgmt.companyInfo.updateSuccess'))
          dialogVisible.value = false
          fetchCompanyPages()
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.companyInfo.operationFailed'))
      }
  }

  // 删除公司数据
  const deleteCompany = async (companyId) => {
      const params = {
          CompanyId: companyId
      }

      const res = await post(DELETE_COMPANY_API.DELETE_COMPANY, params)

      if (res && res.code === '200') {
          ElMessage.success(res.message || t('systemBasicmgmt.companyInfo.deleteSuccess'))
          fetchCompanyPages()
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.companyInfo.operationFailed'))
      }
  }

  // 处理新增操作
  const handleAdd = () => {
      // 重置表单数据
      resetForm()
      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.companyInfo.addCompany')
      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑操作
  const handleEdit = async (index, row) => {
      // 重置表单数据
      resetForm()
      // 获取公司实体数据
      await fetchCompanyEntity(row.companyId)
      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.companyInfo.editCompany')
      // 显示对话框
      dialogVisible.value = true
      
      // 在数据加载完成后再次清除验证状态
      setTimeout(() => {
          if (editFormRef.value) {
              editFormRef.value.clearValidate()
          }
      }, 100)
  }

  // 处理删除操作
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('systemBasicmgmt.companyInfo.deleteConfirm'),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning',
          }
      )
          .then(() => {
              deleteCompany(row.companyId)
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
              if (!editForm.companyId) {
                  insertCompany()
              } else {
                  updateCompany()
              }
          }
      })
  }

  // 处理对话框关闭
  const handleDialogClose = () => {
      // 使用 nextTick 确保 DOM 更新完成后再清除验证
      nextTick(() => {
          resetForm(true)
      })
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style> 

