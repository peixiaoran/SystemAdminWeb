<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="部门搜索表单">
        <el-form-item :label="$t('systembasicmgmt.departmentInfo.filter.departmentCode')">
          <el-input style="width: 180px"
                    v-model="filters.departmentCode"
                    :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputCode')" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.departmentInfo.filter.departmentName')">
          <el-input style="width: 180px"
                    v-model="filters.departmentName"
                    :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputName')" />
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
            {{ $t('systembasicmgmt.departmentInfo.addDepartment') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table :data="departmentList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  row-key="departmentId"
                  :default-expand-all="true"
                  :tree-props="{ children: 'departmentChildList', hasChildren: 'hasChildren' }">
          <el-table-column type="index" :label="$t('systembasicmgmt.departmentInfo.index')" width="70" align="center" fixed />
          <el-table-column prop="departmentCode" :label="$t('systembasicmgmt.departmentInfo.departmentCode')" align="left" min-width="210" />
          <el-table-column prop="departmentNameCn" :label="$t('systembasicmgmt.departmentInfo.departmentNameCn')" align="left" min-width="200" />
          <el-table-column prop="departmentNameEn" :label="$t('systembasicmgmt.departmentInfo.departmentNameEn')" align="left" min-width="280" />
          <el-table-column prop="departmentLevelName" :label="$t('systembasicmgmt.departmentInfo.departmentLevelName')" align="center" min-width="200" />
          <el-table-column prop="landline" :label="$t('systembasicmgmt.departmentInfo.landline')" align="center" min-width="170" />
          <el-table-column prop="email" :label="$t('systembasicmgmt.departmentInfo.email')" align="left" min-width="260" />
          <el-table-column prop="description" :label="$t('systembasicmgmt.departmentInfo.description')" align="left" min-width="230" />
          <el-table-column :label="$t('systembasicmgmt.departmentInfo.operation')" min-width="270" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small" type="success" @click="handleAddChild(scope.$index, scope.row)">{{ $t('systembasicmgmt.departmentInfo.addChild') }}</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="55%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="部门编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentCode')" prop="departmentCode">
            <el-input v-model="editForm.departmentCode" :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputCode')" style="width: 100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.sortOrder')" prop="sortOrder">
            <el-input-number v-model="editForm.sortOrder" :min="1" style="width: 60%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentNameCn')" prop="departmentNameCn">
            <el-input v-model="editForm.departmentNameCn" :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputNameCn')" style="width: 100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentNameEn')" prop="departmentNameEn">
            <el-input v-model="editForm.departmentNameEn" :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputNameEn')" style="width: 100%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.landline')" prop="landline">
            <el-input v-model="editForm.landline" style="width: 100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.email')" prop="email">
            <el-input v-model="editForm.email" style="width: 100%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.parentDepartment')" prop="parentId">
            <el-tree-select
              v-model="editForm.parentId"
              :data="departmentOptionsWithNone || []"
              :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
              check-strictly
              filterable
              :filter-node-method="filterNodeMethod"
              popper-class="main-dept-filter-popper"
              :placeholder="$t('systembasicmgmt.departmentInfo.pleaseSelectParentDepartment')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentLevel')" prop="departmentLevelId">
            <el-select v-model="editForm.departmentLevelId" style="width: 100%" :placeholder="$t('systembasicmgmt.departmentInfo.pleaseSelectDepartmentLevel')">
              <el-option
                v-for="item in departmentLevelOptions"
                :key="item.departmentLevelId"
                :label="item.departmentLevelName"
                :value="item.departmentLevelId" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row full-width">
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.description')" prop="description">
            <el-input v-model="editForm.description" type="textarea" :rows="3" style="width: 100%" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { post } from '@/utils/request'
import {
  GET_DEPARTMENT_TREE_API,
  GET_DEPARTMENT_ENTITY_API,
  INSERT_DEPARTMENT_API,
  DELETE_DEPARTMENT_API,
  UPDATE_DEPARTMENT_API,
  GET_DEPARTMENTLEVEL_DROPDOWN_API,
  GET_DEPARTMENT_TREE_DROPDOWN_API
} from '@/config/api/systembasicmgmt/system-basicdata/department'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const DEBOUNCE_MS = 300

const { t } = useI18n()

const departmentList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)

const filters = reactive({
  departmentCode: '',
  departmentName: ''
})

const editForm = reactive({
  departmentId: '',
  departmentCode: '',
  departmentNameCn: '',
  departmentNameEn: '',
  parentId: '',
  departmentLevelId: '',
  description: '',
  sortOrder: 1,
  landline: '',
  email: '',
  address: '',
  isEnabled: 1
})

const formRules = {
  departmentCode: [
    { required: true, message: () => t('systembasicmgmt.departmentInfo.pleaseInputCode'), trigger: 'blur' }
  ],
  departmentNameCn: [
    { required: true, message: () => t('systembasicmgmt.departmentInfo.pleaseInputNameCn'), trigger: 'blur' }
  ],
  departmentNameEn: [
    { required: true, message: () => t('systembasicmgmt.departmentInfo.pleaseInputNameEn'), trigger: 'blur' }
  ],
  parentId: [
    { required: true, message: () => t('systembasicmgmt.departmentInfo.pleaseSelectParentDepartment'), trigger: 'change' }
  ],
  departmentLevelId: [
    { required: true, message: () => t('systembasicmgmt.departmentInfo.pleaseSelectLevel'), trigger: 'change' }
  ]
}

const departmentOptions = ref([])
const departmentOptionsWithNone = computed(() => {
  return [
    { departmentId: '0', departmentName: t('systembasicmgmt.departmentInfo.topLevel'), departmentChildList: [] },
    ...departmentOptions.value
  ]
})

const departmentLevelOptions = ref([])

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const getFirstEnabledDepartmentLevelId = () => {
  return departmentLevelOptions.value.find(item => !item.disabled)?.departmentLevelId ?? ''
}

const getDepartmentTree = async () => {
  loading.value = true
  const response = await post(GET_DEPARTMENT_TREE_API.GET_DEPARTMENT_TREE, {
    departmentCode: filters.departmentCode,
    departmentName: filters.departmentName
  })
  if (response?.code === 200) {
    departmentList.value = response.data || []
  } else {
    if (response?.code !== 401 && response?.code !== 403) {
      showMessage(response?.message || t('systembasicmgmt.departmentInfo.getFailed'))
    }
    departmentList.value = []
  }
  loading.value = false
}

const getDepartmentLevelDropdown = async () => {
  const response = await post(GET_DEPARTMENTLEVEL_DROPDOWN_API.GET_DEPARTMENTLEVEL_DROPDOWN, {})
  if (response?.code === 200) {
    departmentLevelOptions.value = response.data || []
  } else {
    if (response?.code !== 401 && response?.code !== 403) {
      showMessage(response?.message || t('systembasicmgmt.departmentInfo.getFailed'))
    }
    departmentLevelOptions.value = []
  }
}

const getDepartmentDropdown = async () => {
  const response = await post(GET_DEPARTMENT_TREE_DROPDOWN_API.GET_DEPARTMENT_TREE_DROPDOWN, {})
  if (response?.code === 200) {
    departmentOptions.value = response.data || []
  } else {
    if (response?.code !== 401 && response?.code !== 403) {
      showMessage(response?.message || t('systembasicmgmt.departmentInfo.getFailed'))
    }
    departmentOptions.value = []
  }
}

let searchTimer = null
const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => getDepartmentTree(), DEBOUNCE_MS)
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.departmentCode = ''
  filters.departmentName = ''
  scheduleSearch()
}

const resetForm = () => {
  Object.assign(editForm, {
    departmentId: '',
    departmentCode: '',
    departmentNameCn: '',
    departmentNameEn: '',
    parentId: '0',
    departmentLevelId: getFirstEnabledDepartmentLevelId(),
    description: '',
    sortOrder: 1,
    landline: '',
    email: '',
    address: '',
    isEnabled: 1
  })
}

const handleAdd = () => {
  resetForm()
  dialogTitle.value = t('systembasicmgmt.departmentInfo.addDepartment')
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleAddChild = (index, row) => {
  resetForm()
  editForm.parentId = row.departmentId
  dialogTitle.value = t('systembasicmgmt.departmentInfo.addChild')
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (index, row) => {
  resetForm()
  const formData = new FormData()
  formData.append('deptId', row.departmentId)
  const response = await post(GET_DEPARTMENT_ENTITY_API.GET_DEPARTMENT_ENTITY, formData)
  if (response?.code === 200) {
    const data = response.data
    Object.assign(editForm, {
      departmentId: data.departmentId,
      departmentCode: data.departmentCode,
      departmentNameCn: data.departmentNameCn,
      departmentNameEn: data.departmentNameEn,
      parentId: data.parentId,
      departmentLevelId: data.departmentLevelId || getFirstEnabledDepartmentLevelId(),
      description: data.description,
      sortOrder: data.sortOrder,
      landline: data.landline,
      email: data.email,
      address: data.address,
      isEnabled: data.isEnabled
    })
    dialogTitle.value = t('systembasicmgmt.departmentInfo.editDepartment')
    isEdit.value = true
    dialogVisible.value = true
    nextTick(() => editFormRef.value?.clearValidate())
  } else {
    if (response?.code !== 401 && response?.code !== 403) {
      showMessage(response?.message || t('systembasicmgmt.departmentInfo.getFailed'))
    }
  }
}

const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.departmentInfo.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  const formData = new FormData()
  formData.append('deptId', row.departmentId)
  const response = await post(DELETE_DEPARTMENT_API.DELETE_DEPARTMENT, formData)
  if (response?.code === 200) {
    showMessage(response.message, 'success')
    getDepartmentTree()
  } else {
    if (response?.code !== 401 && response?.code !== 403) {
      showMessage(response?.message)
    }
  }
}

const handleSubmit = async () => {
  const isValid = await editFormRef.value?.validate().catch(() => false)
  if (!isValid) return

  submitLoading.value = true
  const params = {
    departmentCode: editForm.departmentCode,
    departmentNameCn: editForm.departmentNameCn,
    departmentNameEn: editForm.departmentNameEn,
    parentId: editForm.parentId,
    departmentLevelId: editForm.departmentLevelId,
    description: editForm.description,
    sortOrder: editForm.sortOrder,
    landline: editForm.landline,
    email: editForm.email,
    address: editForm.address
  }
  if (isEdit.value) {
    params.departmentId = editForm.departmentId
    params.isEnabled = editForm.isEnabled
  } else {
    params.isEnabled = 1
  }

  const api = isEdit.value ? UPDATE_DEPARTMENT_API.UPDATE_DEPARTMENT : INSERT_DEPARTMENT_API.INSERT_DEPARTMENT
  const response = await post(api, params)
  if (response?.code === 200) {
    showMessage(response.message, 'success')
    dialogVisible.value = false
    getDepartmentTree()
  } else {
    if (response?.code !== 401 && response?.code !== 403) {
      showMessage(response?.message)
    }
  }
  submitLoading.value = false
}

const handleDialogClose = () => {
  resetForm()
  editFormRef.value?.clearValidate()
}

const filterNodeMethod = (value, data) => {
  if (!value) return true
  return data.departmentName.includes(value)
}

onMounted(() => {
  getDepartmentTree()
  getDepartmentLevelDropdown()
  getDepartmentDropdown()
})
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

<style>
  .main-dept-filter-popper {
    width: auto !important;
    min-width: 320px !important;
  }
  .main-dept-filter-popper .el-select-dropdown__wrap,
  .main-dept-filter-popper .el-scrollbar__view,
  .main-dept-filter-popper .el-tree {
    width: 100% !important;
    min-width: 100% !important;
  }
  .main-dept-filter-popper .el-tree-node__content {
    height: 36px;
    line-height: 36px;
    padding-left: 12px;
    width: 100% !important;
    min-width: 100% !important;
  }
</style>
