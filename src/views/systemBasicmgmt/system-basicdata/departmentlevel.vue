<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="部门级别搜索表单">
              <el-form-item :label="$t('systemBasicmgmt.departmentLevel.departmentLevelCode')">
                  <el-input v-model="filters.departmentLevelCode" :placeholder="$t('systemBasicmgmt.departmentLevel.pleaseInputDepartmentLevelCode')" style="width:170px" />
              </el-form-item>
              <el-form-item :label="$t('systemBasicmgmt.departmentLevel.departmentLevelName')">
                  <el-input v-model="filters.departmentLevelName" :placeholder="$t('systemBasicmgmt.departmentLevel.pleaseInputDepartmentLevelName')" style="width:170px" />
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
                      {{ $t('systemBasicmgmt.departmentLevel.addDepartmentLevel') }}
                  </el-button>
              </el-form-item>
          </el-form>

          <!-- 表格区域 -->
          <div class="table-container">
              <el-table :data="departmentLevelList"
                        style="width: 100%"
                        border
                        stripe
                        height="100%"
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('systemBasicmgmt.departmentLevel.index')" width="60" align="center" fixed />
                  <el-table-column prop="departmentLevelCode" :label="$t('systemBasicmgmt.departmentLevel.departmentLevelCode')" align="center" min-width="120" />
                  <el-table-column prop="departmentLevelNameCh" :label="$t('systemBasicmgmt.departmentLevel.departmentLevelNameCh')" align="left" min-width="200" />
                  <el-table-column prop="departmentLevelNameEn" :label="$t('systemBasicmgmt.departmentLevel.departmentLevelNameEn')" align="left" min-width="200" />
                  <el-table-column prop="departmentLevelDescribe" :label="$t('systemBasicmgmt.departmentLevel.departmentLevelDescribe')" align="left" min-width="250" />
                  <el-table-column :label="$t('systemBasicmgmt.departmentLevel.operation')" min-width="130" fixed="right" align="center">
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
          <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="部门级别编辑表单">
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.departmentLevel.departmentLevelCode')" prop="departmentLevelCode">
                      <el-input v-model="editForm.departmentLevelCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.departmentLevel.departmentLevelNameCh')" prop="departmentLevelNameCh">
<el-input v-model="editForm.departmentLevelNameCh" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.departmentLevel.departmentLevelNameEn')" prop="departmentLevelNameEn">
                      <el-input v-model="editForm.departmentLevelNameEn" style="width:100%" />
                  </el-form-item>
                  <el-form-item></el-form-item>
              </div>
              <div class="form-row full-width">
                  <el-form-item :label="$t('systemBasicmgmt.departmentLevel.departmentLevelDescribe')">
                      <el-input v-model="editForm.departmentLevelDescribe" style="width:100%" type="textarea" :rows="3" />
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
    GET_DEPARTMENT_LEVEL_LIST_API, 
    GET_DEPARTMENT_LEVEL_ENTITY_API, 
    INSERST_DEPARTMENT_LEVEL_API, 
    DELETE_DEPARTMENT_LEVEL_API, 
    UPDATE_DEPARTMENT_LEVEL_API 
  } from '@/config/api/systemBasicmgmt/system-basic/departmentlevel'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  // 使用i18n
  const { t } = useI18n()

  // 数据列表
  const departmentLevelList = ref([])
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
      departmentLevelCode: '',
      departmentLevelName: ''
  })

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      departmentLevelId: 0,
      departmentLevelCode: '',
      departmentLevelNameCh: '',
      departmentLevelNameEn: '',
      departmentLevelDescribe: ''
  })

  // 对话框标题
  const dialogTitle = ref('')

  // 表单验证规则
  const formRules = reactive({
      departmentLevelCode: [
          { required: true, message: () => t('systemBasicmgmt.departmentLevel.pleaseInputDepartmentLevelCode'), trigger: 'blur' }
      ],
      departmentLevelNameCh: [
{ required: true, message: () => t('systemBasicmgmt.departmentLevel.pleaseInputDepartmentLevelNameCh'), trigger: 'blur' }
      ],
      departmentLevelNameEn: [
          { required: true, message: () => t('systemBasicmgmt.departmentLevel.pleaseInputDepartmentLevelNameEn'), trigger: 'blur' }
      ]
  })

  // 在组件挂载后获取数据
  onMounted(() => {
      fetchDepartmentLevelList()
  })

  // 获取部门级别实体数据
  const fetchDepartmentLevelEntity = async (departmentLevelId) => {
      const params = {
          departmentLevelId: departmentLevelId
      }
      const res = await post(GET_DEPARTMENT_LEVEL_ENTITY_API.GET_DEPARTMENT_LEVEL_ENTITY, params)

      if (res && res.code === '200') {
          editForm.departmentLevelId = res.data.departmentLevelId
          editForm.departmentLevelCode = res.data.departmentLevelCode
          editForm.departmentLevelNameCh = res.data.departmentLevelNameCh
          editForm.departmentLevelNameEn = res.data.departmentLevelNameEn
          editForm.departmentLevelDescribe = res.data.departmentLevelDescribe
      }
  }

  // 获取部门级别列表数据
  const fetchDepartmentLevelList = async () => {
      loading.value = true
      
      // 构建筛选参数
      const params = {}
      if (filters.departmentLevelCode) {
          params.departmentLevelCode = filters.departmentLevelCode
      }
      if (filters.departmentLevelName) {
          params.departmentLevelName = filters.departmentLevelName
      }

      const res = await post(GET_DEPARTMENT_LEVEL_LIST_API.GET_DEPARTMENT_LEVEL_LIST, params)

      if (res && res.code === '200') {
          departmentLevelList.value = res.data || []
          pagination.total = res.data ? res.data.length : 0
      } else {
          ElMessage.error(res?.message || '获取部门级别列表失败')
      }
      loading.value = false
  }

  // 处理搜索操作
  const handleSearch = () => {
      pagination.pageIndex = 1
      fetchDepartmentLevelList()
  }

  // 重置搜索条件
  const handleReset = () => {
      filters.departmentLevelCode = ''
      filters.departmentLevelName = ''
      pagination.pageIndex = 1
      fetchDepartmentLevelList()
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      // 由于API返回全部数据，这里不需要重新请求
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      // 由于API返回全部数据，这里不需要重新请求
  }

  // 重置表单
  const resetForm = (clearValidation = true) => {
      // 先清除验证状态（在重置数据之前）
      if (clearValidation && editFormRef.value) {
          try {
              editFormRef.value.clearValidate()
          } catch (error) {
              console.warn('清除表单验证状态失败:', error)
          }
      }
      
      editForm.departmentLevelId = 0
      editForm.departmentLevelCode = ''
      editForm.departmentLevelNameCh = ''
      editForm.departmentLevelNameEn = ''
      editForm.departmentLevelDescribe = ''
      
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

  // 新增部门级别
  const insertDepartmentLevel = async () => {
      const params = {
          ...editForm
      }

      const res = await post(INSERST_DEPARTMENT_LEVEL_API.INSERST_DEPARTMENT_LEVEL, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message || '新增成功')
          dialogVisible.value = false
          fetchDepartmentLevelList()
      } else {
          ElMessage.error(res?.message || '新增失败')
      }
  }

  // 更新部门级别
  const updateDepartmentLevel = async () => {
      const params = {
          ...editForm
      }
      const res = await post(UPDATE_DEPARTMENT_LEVEL_API.UPDATE_DEPARTMENT_LEVEL, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message || '更新成功')
          dialogVisible.value = false
          fetchDepartmentLevelList()
      } else {
          ElMessage.error(res?.message || '更新失败')
      }
  }

  // 删除部门级别
  const deleteDepartmentLevel = async (departmentLevelId) => {
      const params = {
          departmentLevelId: departmentLevelId
      }

      const res = await post(DELETE_DEPARTMENT_LEVEL_API.DELETE_DEPARTMENT_LEVEL, params)

      if (res && res.code === '200') {
          ElMessage.success(res.message || '删除成功')
          fetchDepartmentLevelList()
      } else {
          ElMessage.error(res?.message || '删除失败')
      }
  }

  // 处理新增操作
  const handleAdd = () => {
      // 重置表单数据
      resetForm()
      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.departmentLevel.addDepartmentLevel')
      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑操作
  const handleEdit = (index, row) => {
      // 重置表单数据
      resetForm()
      // 获取部门级别实体数据
      fetchDepartmentLevelEntity(row.departmentLevelId)
      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.departmentLevel.editDepartmentLevel')
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
          t('systemBasicmgmt.departmentLevel.deleteConfirm'),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning',
          }
      )
      .then(() => {
          deleteDepartmentLevel(row.departmentLevelId)
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
              const isNew = editForm.departmentLevelId === 0

              if (isNew) {
                  insertDepartmentLevel()
              } else {
                  updateDepartmentLevel()
              }
          }
      })
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

