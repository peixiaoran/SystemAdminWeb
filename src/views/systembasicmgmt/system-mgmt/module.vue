<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">

      <!-- 搜索 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="搜索">
        <el-form-item :label="$t('systembasicmgmt.module.filter.moduleCode')">
          <el-input v-model="filters.moduleCode" :placeholder="$t('systembasicmgmt.module.filter.pleaseInputModuleCode')" style="width:170px" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.module.filter.moduleNameCh')">
          <el-input v-model="filters.moduleName" :placeholder="$t('systembasicmgmt.module.filter.pleaseInputModuleNameCh')" style="width:200px" />
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
            {{ $t('systembasicmgmt.module.addModule') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <div class="table-container">
        <el-table :data="moduleList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table">
          <el-table-column type="index" :label="$t('systembasicmgmt.index')" width="70" align="center" fixed />
          <el-table-column prop="moduleCode" :label="$t('systembasicmgmt.module.moduleCode')" align="left" min-width="230" />
          <el-table-column prop="moduleNameCn" :label="$t('systembasicmgmt.module.moduleNameCn')" align="left" min-width="280" />
          <el-table-column prop="moduleNameEn" :label="$t('systembasicmgmt.module.moduleNameEn')" align="left" min-width="280" />
          <el-table-column prop="path" :label="$t('systembasicmgmt.module.pagePath')" align="left" min-width="230" />
          <el-table-column prop="moduleIcon" :label="$t('systembasicmgmt.module.moduleIcon')" align="center" min-width="150" />
          <el-table-column :label="$t('systembasicmgmt.isEnabled')" align="center" min-width="90">
            <template #default="scope">
              <div class="flex">
                <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                  {{ scope.row.isEnabled ? $t('systembasicmgmt.enabled') : $t('systembasicmgmt.disabled') }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('systembasicmgmt.isVisible')" align="center" min-width="90">
            <template #default="scope">
              <div class="flex">
                <el-tag :type="scope.row.isVisible ? 'success' : 'danger'">
                  {{ scope.row.isVisible ? $t('systembasicmgmt.visible') : $t('systembasicmgmt.hidden') }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('systembasicmgmt.operation')" min-width="150" fixed="right" align="center">
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

    <!-- 编辑状态弹窗 -->
    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :modal-append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.module.moduleCode')" prop="moduleCode">
            <el-input v-model="editForm.moduleCode" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.module.moduleNameCn')" prop="moduleNameCn">
            <el-input v-model="editForm.moduleNameCn" style="width:100%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.module.moduleNameEn')" prop="moduleNameEn">
            <el-input v-model="editForm.moduleNameEn" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.module.moduleIcon')" prop="moduleIcon">
            <el-input v-model="editForm.moduleIcon" style="width:100%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.module.sortOrder')" prop="sortOrder">
            <el-input-number v-model="editForm.sortOrder" style="width:100%" :min="1" :precision="0" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.module.pagePath')" prop="path">
            <el-input v-model="editForm.path" style="width:100%" />
          </el-form-item>
        </div>
        <div class="form-row full-width">
          <el-form-item :label="$t('systembasicmgmt.module.remarksCh')" prop="remarkCh">
            <el-input v-model="editForm.remarkCh" style="width:100%" type="textarea" :rows="2" />
          </el-form-item>
        </div>
        <div class="form-row full-width">
          <el-form-item :label="$t('systembasicmgmt.module.remarksEn')" prop="remarkEn">
            <el-input v-model="editForm.remarkEn" style="width:100%" type="textarea" :rows="2" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.isEnabled')">
            <el-switch v-model="editForm.isEnabled"
                       :active-value="1"
                       :inactive-value="0"
                       :active-text="$t('common.yes')"
                       :inactive-text="$t('common.no')"
                       inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.isVisible')">
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
          <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'
import { GET_MODULE_PAGES_API, INSERT_MODULE_API, DELETE_MODULE_API, GET_MODULE_ENTITY_API, UPDATE_MODULE_API } from '@/config/api/systembasicmgmt/system-mgmt/module'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

// 使用i18n
const { t } = useI18n()

// 网域数据
const moduleList = ref([])
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
  moduleCode: '',
  moduleName: ''
})

// 对话框显示状态
const dialogVisible = ref(false)

// 提交加载状态
const submitLoading = ref(false)

// 编辑表单
const editForm = reactive({
  moduleId: '0',
  moduleCode: '',
  moduleNameCn: '',
  moduleNameEn: '',
  moduleIcon: '',
  sortOrder: 1,
  isEnabled: 1,
  isVisible: 1,
  level: 1,
  path: '',
  redirect: '',
  remarkCh: '',
  remarkEn: ''
})

// 对话框标题
const dialogTitle = ref(t('systembasicmgmt.module.editModule'))

// 表单验证规则
const formRules = reactive({
  moduleCode: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputModuleCode'), trigger: 'blur' }
  ],
  moduleNameCn: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputModuleNameCn'), trigger: 'blur' }
  ],
  moduleNameEn: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputModuleNameEn'), trigger: 'blur' }
  ],
  remarkCh: [
    { required: false, message: () => t('systembasicmgmt.module.pleaseInputRemarksCh'), trigger: 'blur' }
  ],
  remarkEn: [
    { required: false, message: () => t('systembasicmgmt.module.pleaseInputRemarksEn'), trigger: 'blur' }
  ],
  moduleIcon: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputModuleIcon'), trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputSortOrder'), trigger: 'blur' }
  ],
  path: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputPagePath'), trigger: 'blur' }
  ],
  redirect: [
    { required: false, message: () => t('systembasicmgmt.module.pleaseInputRedirect'), trigger: 'blur' }
  ]
})

// 组件挂载后获取网域数据
onMounted(() => {
  fetchModulePages()
})

// 获取网域实体数据
const fetchModuleEntity = async (moduleId) => {
  const params = {
    moduleId: moduleId
  }
  const res = await post(GET_MODULE_ENTITY_API.GET_MODULE_ENTITY, params)

  if (res && res.code === 200) {
    editForm.moduleId = res.data.moduleId
    editForm.moduleCode = res.data.moduleCode
    editForm.moduleNameCn = res.data.moduleNameCn
    editForm.moduleNameEn = res.data.moduleNameEn
    editForm.moduleIcon = res.data.moduleIcon
    editForm.sortOrder = res.data.sortOrder
    editForm.path = res.data.path
    editForm.redirect = res.data.redirect
    editForm.remarkCh = res.data.remarkCh ?? res.data.remarksCh ?? ''
    editForm.remarkEn = res.data.remarkEn ?? res.data.remarksEn ?? ''
    editForm.isEnabled = res.data.isEnabled
    editForm.isVisible = res.data.isVisible
    editForm.level = res.data.level
  }
}

// 获取网域列表
const fetchModulePages = async () => {
  loading.value = true
  const params = {
    ...filters,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  }

  const res = await post(GET_MODULE_PAGES_API.GET_MODULE_PAGES, params)

  if (res && res.code === 200) {
    moduleList.value = res.data || []
    pagination.totalCount = res.totalCount || 0
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true
    })
  }
  loading.value = false
}

// 使用通用防抖工具
const debouncedFetchModulePages = debounce(() => {
  fetchModulePages()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

// 处理搜索操作（带防抖）
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedFetchModulePages()
}

// 立即查询数据（不使用防抖，用于保存后刷新）
const fetchModulePagesImmediate = () => {
  fetchModulePages()
}

// 重置
const handleReset = () => {
  filters.moduleCode = ''
  filters.moduleName = ''
  // 重置后自动触发查询（使用防抖）
  pagination.pageIndex = 1
  loading.value = true
  debouncedFetchModulePages()
}

// 分页变化
const handlePageChange = (page) => {
  pagination.pageIndex = page
  fetchModulePages()
}

// 每页条数变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageIndex = 1
  fetchModulePages()
}

const resetForm = (clearValidation = true) => {
  // 重置表单数据
  editForm.moduleId = '0'
  editForm.moduleCode = ''
  editForm.moduleNameCn = ''
  editForm.moduleNameEn = ''
  editForm.moduleIcon = ''
  editForm.sortOrder = 1
  editForm.isEnabled = 1
  editForm.isVisible = 1
  editForm.path = ''
  editForm.redirect = ''
  editForm.remarkCh = ''
  editForm.remarkEn = ''
  
  // 清除表单验证状态
  if (clearValidation && editFormRef.value) {
    nextTick(() => {
      try {
        editFormRef.value.clearValidate()
      } catch (error) {
        console.warn('清除表单验证状态失败:', error)
      }
    })
  }
}

// 插入网域
const insertModule = async () => {
  submitLoading.value = true
  const params = {
    ...editForm,
    redirect: editForm.redirect
  }
  
  const res = await post(INSERT_MODULE_API.INSERT_MODULE, params)
  if (res && res.code === 200) {
    resetForm()
    ElMessage({
      message: res.message,
      type: 'success',
      plain: true,
      showClose: true
    })
    dialogVisible.value = false
    fetchModulePages()
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true
    })
  }
  submitLoading.value = false
}

// 更新网域
const updateModule = async () => {
  submitLoading.value = true
  const params = {
    ...editForm,
    redirect: editForm.redirect
  }
  
  const res = await post(UPDATE_MODULE_API.UPDATE_MODULE, params)
  if (res && res.code === 200) {
    resetForm()
    ElMessage({
      message: res.message,
      type: 'success',
      plain: true,
      showClose: true
    })
    dialogVisible.value = false
    fetchModulePages()
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true
    })
  }
  submitLoading.value = false
}

// 删除网域
const deleteModule = async (moduleId) => {
  const params = {
    moduleId: moduleId
  }

  if (isNaN(params.moduleId)) {
    ElMessage({
      message: t('systembasicmgmt.invalidId'),
      type: 'error',
      plain: true,
      showClose: true
    })
    return
  }

  const res = await post(DELETE_MODULE_API.DELETE_MODULE, params)

  if (res && res.code === 200) {
    ElMessage({
      message: res.message,
      type: 'success',
      plain: true,
      showClose: true
    })
    dialogVisible.value = false
    fetchModulePages()
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true
    })
  }
}

// 添加网域
const handleAdd = () => {
  // 重置表单
  resetForm()
  // 设置对话框标题
  dialogTitle.value = t('systembasicmgmt.module.addModule')
  // 显示对话框
  dialogVisible.value = true
}

// 编辑网域
const handleEdit = async (index, row) => {
  // 重置表单
  resetForm()
  // 获取网域实体数据
  await fetchModuleEntity(row.moduleId)

  // 设置对话框标题
  dialogTitle.value = t('systembasicmgmt.module.editModule')

  dialogVisible.value = true
  
  // 数据加载完成后清除表单验证状态
  nextTick(() => {
    if (editFormRef.value) {
      editFormRef.value.clearValidate()
    }
  })
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
    t('systembasicmgmt.module.deleteConfirm'),
    t('common.tip'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
    }
  )
    .then(() => {
      deleteModule(row.moduleId)
      // 刷新列表
      fetchModulePages()
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
      const actionType = editForm.moduleId === '0' ? '新增' : '编辑'

      if (actionType === '新增') {
        insertModule()
      } else {
        updateModule()
      }
      dialogVisible.value = false

      // 刷新列表
      fetchModulePages()
    }
  })
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>

