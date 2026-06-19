<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
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

      <div class="table-container">
        <el-table :data="moduleList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.index')" width="70" align="center" fixed />
          <el-table-column prop="moduleCode" :label="$t('systembasicmgmt.module.moduleCode')" align="left" min-width="230" />
          <el-table-column prop="moduleNameCn" :label="$t('systembasicmgmt.module.moduleNameCn')" align="left" min-width="280" />
          <el-table-column prop="moduleNameEn" :label="$t('systembasicmgmt.module.moduleNameEn')" align="left" min-width="280" />
          <el-table-column prop="path" :label="$t('systembasicmgmt.module.pagePath')" align="left" min-width="230" />
          <el-table-column prop="moduleIcon" :label="$t('systembasicmgmt.module.moduleIcon')" align="center" min-width="150" />
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

    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.module.moduleCode')" prop="moduleCode">
            <el-input v-model="editForm.moduleCode" style="width:100%" :placeholder="$t('systembasicmgmt.module.pleaseInputModuleCode')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.module.moduleNameCn')" prop="moduleNameCn">
            <el-input v-model="editForm.moduleNameCn" style="width:100%" :placeholder="$t('systembasicmgmt.module.pleaseInputModuleNameCn')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.module.moduleNameEn')" prop="moduleNameEn">
            <el-input v-model="editForm.moduleNameEn" style="width:100%" :placeholder="$t('systembasicmgmt.module.pleaseInputModuleNameEn')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.module.moduleIcon')" prop="moduleIcon">
            <el-input v-model="editForm.moduleIcon" style="width:100%" :placeholder="$t('systembasicmgmt.module.pleaseInputModuleIcon')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.module.sortOrder')" prop="sortOrder">
            <el-input-number v-model="editForm.sortOrder" style="width:100%" :min="1" :precision="0" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.module.pagePath')" prop="path">
            <el-input v-model="editForm.path" style="width:100%" :placeholder="$t('systembasicmgmt.module.pleaseInputPagePath')" />
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
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import { GET_MODULE_PAGES_API, INSERT_MODULE_API, DELETE_MODULE_API, GET_MODULE_ENTITY_API, UPDATE_MODULE_API } from '@/config/api/systembasicmgmt/system-mgmt/module'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const moduleList = ref([])
const loading = ref(false)

const editFormRef = ref(null)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const filters = reactive({
  moduleCode: '',
  moduleName: ''
})

const dialogVisible = ref(false)
const submitLoading = ref(false)

const editForm = reactive({
  moduleId: '0',
  moduleCode: '',
  moduleNameCn: '',
  moduleNameEn: '',
  moduleIcon: '',
  sortOrder: 1,
  isVisible: 1,
  level: 1,
  path: '',
  redirect: '',
  remarkCh: '',
  remarkEn: ''
})

const dialogTitle = ref(t('systembasicmgmt.module.editModule'))

const formRules = {
  moduleCode: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputModuleCode'), trigger: 'blur' }
  ],
  moduleNameCn: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputModuleNameCn'), trigger: 'blur' }
  ],
  moduleNameEn: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputModuleNameEn'), trigger: 'blur' }
  ],
  moduleIcon: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputModuleIcon'), trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputSortOrder'), trigger: 'blur' }
  ],
  path: [
    { required: true, message: () => t('systembasicmgmt.module.pleaseInputPagePath'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => ElMessage({ message, type, plain: true, showClose: true })

onMounted(() => {
  fetchModulePages()
})

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchModulePages()
  }, DEBOUNCE_MS)
}

const fetchModuleEntity = async (moduleId) => {
  const formData = new FormData()
  formData.append('moduleId', moduleId)
  const res = await post(GET_MODULE_ENTITY_API.GET_MODULE_ENTITY, formData)
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
    editForm.isVisible = res.data.isVisible
    editForm.level = res.data.level
  }
}

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
    showMessage(res.message)
  }
  loading.value = false
}

const handleSearch = () => {
  scheduleSearch()
}

const handleReset = () => {
  filters.moduleCode = ''
  filters.moduleName = ''
  scheduleSearch()
}

const handlePageChange = () => {
  fetchModulePages()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchModulePages()
}

const resetForm = () => {
  editForm.moduleId = '0'
  editForm.moduleCode = ''
  editForm.moduleNameCn = ''
  editForm.moduleNameEn = ''
  editForm.moduleIcon = ''
  editForm.sortOrder = 1
  editForm.isVisible = 1
  editForm.path = ''
  editForm.redirect = ''
  editForm.remarkCh = ''
  editForm.remarkEn = ''
}

const insertModule = async () => {
  submitLoading.value = true
  const res = await post(INSERT_MODULE_API.INSERT_MODULE, { ...editForm })
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    resetForm()
    dialogVisible.value = false
    fetchModulePages()
  } else {
    showMessage(res.message)
  }
  submitLoading.value = false
}

const updateModule = async () => {
  submitLoading.value = true
  const res = await post(UPDATE_MODULE_API.UPDATE_MODULE, { ...editForm })
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    resetForm()
    dialogVisible.value = false
    fetchModulePages()
  } else {
    showMessage(res.message)
  }
  submitLoading.value = false
}

const deleteModule = async (moduleId) => {
  if (isNaN(moduleId)) {
    showMessage(t('systembasicmgmt.invalidId'))
    return
  }
  const formData = new FormData()
  formData.append('moduleId', moduleId)
  const res = await post(DELETE_MODULE_API.DELETE_MODULE, formData)
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    fetchModulePages()
  } else {
    showMessage(res.message)
  }
}

const handleAdd = () => {
  resetForm()
  dialogTitle.value = t('systembasicmgmt.module.addModule')
  dialogVisible.value = true
}

const handleEdit = async (index, row) => {
  resetForm()
  await fetchModuleEntity(row.moduleId)
  dialogTitle.value = t('systembasicmgmt.module.editModule')
  dialogVisible.value = true
  nextTick(() => {
    if (editFormRef.value) {
      editFormRef.value.clearValidate()
    }
  })
}

const handleDialogClose = () => {
  resetForm()
  editFormRef.value?.clearValidate()
}

const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.module.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
  } catch {
    return
  }
  await deleteModule(row.moduleId)
}

const handleSave = async () => {
  try {
    await editFormRef.value.validate()
  } catch {
    return
  }
  if (editForm.moduleId === '0') {
    await insertModule()
  } else {
    await updateModule()
  }
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
