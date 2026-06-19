<template>
<div class="conventional-table-container">
  <el-card class="conventional-card">
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

    <div class="table-container">
      <el-table :data="departmentLevelList"
                style="width: 100%"
                border
                stripe
                height="100%"
                :header-cell-style="{ background: '#f5f7fa' }"
                v-loading="loading"
                class="conventional-table"
                :empty-text="$t('common.noData')"
                >
        <el-table-column type="index" :label="$t('systembasicmgmt.departmentLevel.index')" width="70" align="center" fixed />
        <el-table-column prop="departmentLevelCode" :label="$t('systembasicmgmt.departmentLevel.departmentLevelCode')" align="center" min-width="150" />
        <el-table-column prop="departmentLevelNameCn" :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameCn')" align="left" min-width="200" />
        <el-table-column prop="departmentLevelNameEn" :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameEn')" align="left" min-width="200" />
        <el-table-column prop="description" :label="$t('systembasicmgmt.departmentLevel.description')" align="left" min-width="250" />
        <el-table-column :label="$t('systembasicmgmt.departmentLevel.operation')" min-width="130" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
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
    <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="编辑部门级别">
      <div class="form-row">
        <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelCode')" prop="departmentLevelCode">
          <el-input v-model="editForm.departmentLevelCode" :placeholder="$t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelCode')" style="width:100%" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameCn')" prop="departmentLevelNameCn">
          <el-input v-model="editForm.departmentLevelNameCn" :placeholder="$t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelNameCn')" style="width:100%" />
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameEn')" prop="departmentLevelNameEn">
          <el-input v-model="editForm.departmentLevelNameEn" :placeholder="$t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelNameEn')" style="width:100%" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.departmentLevel.sortOrder')" prop="sortOrder">
          <el-input-number v-model="editForm.sortOrder" :min="1" style="width:100%" />
        </el-form-item>
      </div>
      <div class="form-row full-width">
        <el-form-item :label="$t('systembasicmgmt.departmentLevel.description')">
          <el-input v-model="editForm.description" style="width:100%" type="textarea" :rows="3" />
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
import {
  GET_DEPARTMENT_LEVEL_LIST_API,
  GET_DEPARTMENT_LEVEL_ENTITY_API,
  INSERT_DEPARTMENT_LEVEL_API,
  DELETE_DEPARTMENT_LEVEL_API,
  UPDATE_DEPARTMENT_LEVEL_API
} from '@/config/api/systembasicmgmt/system-basicdata/departmentlevel'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const DEBOUNCE_MS = 300

const { t } = useI18n()

const departmentLevelList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const filters = reactive({
  departmentLevelCode: '',
  departmentLevelName: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref('')

const editForm = reactive({
  departmentLevelId: '',
  departmentLevelCode: '',
  departmentLevelNameCn: '',
  departmentLevelNameEn: '',
  description: '',
  sortOrder: 1
})

const formRules = {
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
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const fetchDepartmentLevelList = async () => {
  loading.value = true
  const res = await post(GET_DEPARTMENT_LEVEL_LIST_API.GET_DEPARTMENT_LEVEL_LIST, {
    departmentLevelCode: filters.departmentLevelCode,
    departmentLevelName: filters.departmentLevelName,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  })
  if (res?.code === 200) {
    departmentLevelList.value = res.data || []
    pagination.totalCount = res.totalCount || 0
  } else if (res) {
    showMessage(res.message)
    departmentLevelList.value = []
  }
  loading.value = false
}

let searchTimer = null
const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchDepartmentLevelList()
  }, DEBOUNCE_MS)
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.departmentLevelCode = ''
  filters.departmentLevelName = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchDepartmentLevelList()
}

const handlePageChange = () => {
  fetchDepartmentLevelList()
}

const fetchDepartmentLevelEntity = async (departmentLevelId) => {
  const formData = new FormData()
  formData.append('deptlevelId', departmentLevelId)
  const res = await post(GET_DEPARTMENT_LEVEL_ENTITY_API.GET_DEPARTMENT_LEVEL_ENTITY, formData)
  if (res?.code === 200) {
    Object.assign(editForm, res.data)
  }
}

const resetEditForm = () => {
  Object.assign(editForm, {
    departmentLevelId: '',
    departmentLevelCode: '',
    departmentLevelNameCn: '',
    departmentLevelNameEn: '',
    description: '',
    sortOrder: 1
  })
}

const handleAdd = () => {
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.departmentLevel.addDepartmentLevel')
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (index, row) => {
  resetEditForm()
  await fetchDepartmentLevelEntity(row.departmentLevelId)
  dialogTitle.value = t('systembasicmgmt.departmentLevel.editDepartmentLevel')
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.departmentLevel.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  const formData = new FormData()
  formData.append('deptlevelId', row.departmentLevelId)
  const res = await post(DELETE_DEPARTMENT_LEVEL_API.DELETE_DEPARTMENT_LEVEL, formData)
  if (res?.code === 200) {
    showMessage(res.message || t('systembasicmgmt.departmentLevel.deleteSuccess'), 'success')
    fetchDepartmentLevelList()
  } else {
    showMessage(res?.message || t('systembasicmgmt.departmentLevel.deleteFailed'))
  }
}

const handleSave = async () => {
  const isValid = await editFormRef.value?.validate().catch(() => false)
  if (!isValid) return

  submitLoading.value = true
  try {
    const api = editForm.departmentLevelId
      ? UPDATE_DEPARTMENT_LEVEL_API.UPDATE_DEPARTMENT_LEVEL
      : INSERT_DEPARTMENT_LEVEL_API.INSERT_DEPARTMENT_LEVEL
    const res = await post(api, { ...editForm })
    if (res?.code === 200) {
      showMessage(res.message || t('systembasicmgmt.departmentLevel.saveSuccess'), 'success')
      dialogVisible.value = false
      fetchDepartmentLevelList()
    } else {
      showMessage(res?.message || t('systembasicmgmt.departmentLevel.saveFailed'))
    }
  } catch {
    showMessage(t('systembasicmgmt.departmentLevel.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetEditForm()
  editFormRef.value?.clearValidate()
}

onMounted(() => {
  fetchDepartmentLevelList()
})
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>
