<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">
          <!-- 搜索 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="搜索部门级别">
              <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelCode')">
                  <el-input v-model="filters.departmentLevelCode" :placeholder="$t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelCode')" style="width:170px" />
              </el-form-item>
              <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelName')">
                  <el-input v-model="filters.departmentLevelName" :placeholder="$t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelName')" style="width:170px" />
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
                      {{ $t('systembasicmgmt.departmentLevel.addDepartmentLevel') }}
                  </el-button>
              </el-form-item>
          </el-form>

          <!-- 表格 -->
          <div class="table-container">
              <el-table :data="departmentLevelList"
                        style="width: 100%"
                        border
                        stripe
                        height="100%"
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('systembasicmgmt.departmentLevel.index')" width="70" align="center" fixed />
                  <el-table-column prop="departmentLevelCode" :label="$t('systembasicmgmt.departmentLevel.departmentLevelCode')" align="center" min-width="150" />
                  <el-table-column prop="departmentLevelNameCn" :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameCn')" align="left" min-width="200" />
                  <el-table-column prop="departmentLevelNameEn" :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameEn')" align="left" min-width="200" />
                  <el-table-column prop="departmentLevelDescribe" :label="$t('systembasicmgmt.departmentLevel.departmentLevelDescribe')" align="left" min-width="250" />
                  <el-table-column :label="$t('systembasicmgmt.departmentLevel.operation')" min-width="130" fixed="right" align="center">
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
                             :total="pagination.totalCount"
                             @size-change="handleSizeChange"
                             @current-change="handlePageChange"/>
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
          <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="编辑部门级别">
              <div class="form-row">
                  <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelCode')" prop="departmentLevelCode">
                      <el-input v-model="editForm.departmentLevelCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameCn')" prop="departmentLevelNameCn">
                      <el-input v-model="editForm.departmentLevelNameCn" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameEn')" prop="departmentLevelNameEn">
                      <el-input v-model="editForm.departmentLevelNameEn" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systembasicmgmt.departmentLevel.sortOrder')" prop="sortOrder">
                      <el-input-number v-model="editForm.sortOrder" :min="1" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row full-width">
                  <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelDescribe')">
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
    INSERT_DEPARTMENT_LEVEL_API, 
    DELETE_DEPARTMENT_LEVEL_API, 
    UPDATE_DEPARTMENT_LEVEL_API 
  } from '@/config/api/systembasicmgmt/system-basicdata/departmentlevel'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  // 使用i18n
  const { t } = useI18n()

  // 级别列表
  const departmentLevelList = ref([])
  const loading = ref(false)

  // 表单引用
  const editFormRef = ref(null)

  // 分页信息
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0
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
      departmentLevelId: '',
      departmentLevelCode: '',
      departmentLevelNameCn: '',
      departmentLevelNameEn: '',
      departmentLevelDescribe: '',
      sortOrder: 1
  })

  // 对话框标题
  const dialogTitle = ref('')

  // 表单验证规则
  const formRules = reactive({
      departmentLevelCode: [
          { required: true, message: () => t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelCode'), trigger: 'blur' }
      ],
      departmentLevelNameCn: [
          { required: true, message: () => t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelNameCn'), trigger: 'blur' }
      ],
      departmentLevelNameEn: [
          { required: true, message: () => t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelNameEn'), trigger: 'blur' }
      ],
      sortOrder: [
          { required: true, message: () => t('systembasicmgmt.departmentLevel.pleaseInputSortOrder'), trigger: 'blur' }
      ]
  })

  // 组件挂载后获取数据
  onMounted(() => {
      fetchDepartmentLevelList()
  })

  // 获取部门级别实体数据
  const fetchDepartmentLevelEntity = async (departmentLevelId) => {
      const params = {
          departmentLevelId: departmentLevelId
      }
      const res = await post(GET_DEPARTMENT_LEVEL_ENTITY_API.GET_DEPARTMENT_LEVEL_ENTITY, params)

      if (res && res.code === 200) {
          editForm.departmentLevelId = res.data.departmentLevelId
          editForm.departmentLevelCode = res.data.departmentLevelCode
          editForm.departmentLevelNameCn = res.data.departmentLevelNameCn
          editForm.departmentLevelNameEn = res.data.departmentLevelNameEn
          editForm.departmentLevelDescribe = res.data.departmentLevelDescribe
          editForm.sortOrder = res.data.sortOrder
      }
  }

  // 获取部门级别列表数据
  const fetchDepartmentLevelList = async () => {
      loading.value = true
      
      // 添加筛选条件
      const params = {}
      if (filters.departmentLevelCode) {
          params.departmentLevelCode = filters.departmentLevelCode
      }
      if (filters.departmentLevelName) {
          params.departmentLevelName = filters.departmentLevelName
      }

      const res = await post(GET_DEPARTMENT_LEVEL_LIST_API.GET_DEPARTMENT_LEVEL_LIST, params)

      if (res && res.code === 200) {
          departmentLevelList.value = res.data || []
          pagination.totalCount = res.data ? res.data.length : 0
      } else {
          ElMessage({
              message: res?.message || '获取部门级别列表失败',
              type: 'error',
              plain: true,
              showClose: true
          })
      }
      loading.value = false
  }

  // 搜索防抖定时器
  let searchTimer = null

  /**
   * 清除搜索防抖定时器
   */
  const clearSearchTimer = () => {
      if (searchTimer) {
          clearTimeout(searchTimer)
          searchTimer = null
      }
  }

  /**
   * 执行查询数据操作
   * @param {boolean} resetPage - 是否重置页码到第一页
   * @param {number} delay - 延迟执行时间（毫秒），0表示立即执行
   */
  const executeSearch = (resetPage = false, delay = 0) => {
      // 立即显示加载状态
      loading.value = true
      
      // 清除之前的定时器
      clearSearchTimer()
      
      if (delay > 0) {
          // 设置延迟执行
          searchTimer = setTimeout(() => {
              if (resetPage) {
                  pagination.pageIndex = 1
              }
              fetchDepartmentLevelList()
          }, delay)
      } else {
          // 立即执行
          if (resetPage) {
              pagination.pageIndex = 1
          }
          fetchDepartmentLevelList()
      }
  }

  // 处理搜索事件（带防抖）
  const handleSearch = () => {
      executeSearch(true, 300) // 重置页码，300ms防抖
  }

  // 立即查询数据（不使用防抖，用于保存后刷新）
  const fetchDepartmentLevelListImmediate = () => {
      executeSearch(false, 0) // 不重置页码，立即执行
  }

  // 处理重置事件
  const handleReset = () => {
      loading.value = true
      filters.departmentLevelCode = ''
      filters.departmentLevelName = ''
      pagination.pageIndex = 1
      fetchDepartmentLevelList()
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      // 因为API返回全部数据，这里不需要重新请求
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      // 因为API返回全部数据，这里不需要重新请求
  }

  // 重置表单
  const resetForm = (clearValidation = true) => {
      // 清除验证状态（需要在重置之前）
      if (clearValidation && editFormRef.value) {
          try {
              editFormRef.value.clearValidate()
          } catch (error) {
              console.warn('清除表单验证状态失败:', error)
          }
      }
      
      editForm.departmentLevelId = ''
      editForm.departmentLevelCode = ''
      editForm.departmentLevelNameCn = ''
      editForm.departmentLevelNameEn = ''
      editForm.departmentLevelDescribe = ''
      editForm.sortOrder = 1
      
      // 重置完成后再次清除验证状态
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

      const res = await post(INSERT_DEPARTMENT_LEVEL_API.INSERT_DEPARTMENT_LEVEL, params)

      if (res && res.code === 200) {
          resetForm()
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          dialogVisible.value = false
          fetchDepartmentLevelList()
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 更新部门级别
  const updateDepartmentLevel = async () => {
      const params = {
          ...editForm
      }
      const res = await post(UPDATE_DEPARTMENT_LEVEL_API.UPDATE_DEPARTMENT_LEVEL, params)

      if (res && res.code === 200) {
          resetForm()
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          dialogVisible.value = false
          fetchDepartmentLevelList()
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 删除部门级别
  const deleteDepartmentLevel = async (departmentLevelId) => {
      const params = {
          departmentLevelId: departmentLevelId
      }

      const res = await post(DELETE_DEPARTMENT_LEVEL_API.DELETE_DEPARTMENT_LEVEL, params)

      if (res && res.code === 200) {
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          fetchDepartmentLevelList()
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 处理添加事件
  const handleAdd = () => {
      // 重置表单数据
      resetForm()
      // 设置对话框标题
      dialogTitle.value = t('systembasicmgmt.departmentLevel.addDepartmentLevel')
      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑事件
  const handleEdit = (index, row) => {
      // 重置表单数据
      resetForm()
      // 获取部门级别实体数据
      fetchDepartmentLevelEntity(row.departmentLevelId)
      // 设置对话框标题
      dialogTitle.value = t('systembasicmgmt.departmentLevel.editDepartmentLevel')
      // 显示对话框
      dialogVisible.value = true
  }

  // 处理对话框关闭
  const handleDialogClose = () => {
      // 使用 nextTick 确保 DOM 更新完成后清除验证
      nextTick(() => {
          resetForm(true)
      })
  }

  // 处理删除事件
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('systembasicmgmt.departmentLevel.deleteConfirm'),
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

  // 处理编辑保存
  const handleSave = () => {
      editFormRef.value?.validate((valid) => {
          if (valid) {
              // 判断是新增还是编辑
              const isNew = editForm.departmentLevelId === ''

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

