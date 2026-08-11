<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.departmentInfo.ariaFilterLabel')">
        <el-form-item :label="$t('systembasicmgmt.departmentInfo.filter.departmentCode')">
          <el-input v-model="filters.departmentCode"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputCode')" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.departmentInfo.filter.departmentName')">
          <el-input v-model="filters.departmentName"
                    style="width: 220px"
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
                  :tree-props="{ children: 'departmentChildList', hasChildren: 'hasChildren' }"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.departmentInfo.index')" width="70" align="center" fixed />
          <el-table-column prop="departmentCode" :label="$t('systembasicmgmt.departmentInfo.departmentCode')" align="left" min-width="170" />
          <el-table-column prop="departmentNameCn" :label="$t('systembasicmgmt.departmentInfo.departmentNameCn')" align="left" min-width="200" />
          <el-table-column prop="departmentNameEn" :label="$t('systembasicmgmt.departmentInfo.departmentNameEn')" align="left" min-width="280" />
          <el-table-column prop="departmentLevelName" :label="$t('systembasicmgmt.departmentInfo.departmentLevelName')" align="center" min-width="200" />
          <el-table-column prop="landline" :label="$t('systembasicmgmt.departmentInfo.landline')" align="center" min-width="170" />
          <el-table-column prop="email" :label="$t('systembasicmgmt.departmentInfo.email')" align="left" min-width="260" />
          <el-table-column prop="description" :label="$t('systembasicmgmt.departmentInfo.description')" align="left" min-width="230" />
          <el-table-column :label="$t('systembasicmgmt.departmentInfo.operation')" min-width="270" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small" type="success" @click="handleAddChild(scope.row)">{{ $t('systembasicmgmt.departmentInfo.addChild') }}</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">{{ $t('common.delete') }}</el-button>
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
      <el-form :model="editForm"
               :rules="formRules"
               ref="editFormRef"
               label-width="120px"
               class="dialog-form"
               role="form"
               :aria-label="$t('systembasicmgmt.departmentInfo.ariaEditLabel')">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentCode')" prop="departmentCode">
            <el-input v-model="editForm.departmentCode"
                      style="width: 100%"
                      :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputCode')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.sortOrder')" prop="sortOrder">
            <el-input-number v-model="editForm.sortOrder" :min="1" style="width: 60%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentNameCn')" prop="departmentNameCn">
            <el-input v-model="editForm.departmentNameCn"
                      style="width: 100%"
                      :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputNameCn')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentNameEn')" prop="departmentNameEn">
            <el-input v-model="editForm.departmentNameEn"
                      style="width: 100%"
                      :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputNameEn')" />
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
            <el-tree-select v-model="editForm.parentId"
                            :data="departmentOptionsWithNone"
                            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                            check-strictly
                            filterable
                            :filter-node-method="filterNodeMethod"
                            style="width: 100%"
                            popper-class="main-dept-filter-popper"
                            :placeholder="$t('systembasicmgmt.departmentInfo.pleaseSelectParentDepartment')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentLevel')" prop="departmentLevelId">
            <el-select v-model="editForm.departmentLevelId"
                       style="width: 100%"
                       :placeholder="$t('systembasicmgmt.departmentInfo.pleaseSelectDepartmentLevel')">
              <el-option v-for="item in departmentLevelOptions"
                         :key="item.departmentLevelId"
                         :label="item.departmentLevelName"
                         :value="item.departmentLevelId" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.factory')" prop="factory">
            <el-select v-model="editForm.factory"
                       style="width: 100%"
                       :placeholder="$t('systembasicmgmt.departmentInfo.pleaseSelectFactory')">
              <el-option v-for="item in factoryOptions"
                         :key="item.factory"
                         :label="item.factoryName"
                         :value="item.factory" />
            </el-select>
          </el-form-item>
          <!-- 占位项：保持与上方两列布局对齐 -->
          <el-form-item />
        </div>
        <div class="form-row full-width">
          <el-form-item :label="$t('systembasicmgmt.departmentInfo.description')" prop="description">
            <el-input v-model="editForm.description" type="textarea" :rows="3" style="width: 100%" />
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
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post } from '@/utils/request'
import {
  GET_DEPARTMENT_TREE_API,
  GET_DEPARTMENT_ENTITY_API,
  INSERT_DEPARTMENT_API,
  DELETE_DEPARTMENT_API,
  UPDATE_DEPARTMENT_API,
  GET_DEPARTMENTLEVEL_DROPDOWN_API,
  GET_DEPARTMENT_TREE_DROPDOWN_API,
  GET_FACTORY_DROP_API
} from '@/config/api/systembasicmgmt/system-basicdata/department'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const departmentList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const departmentOptions = ref([])
const departmentLevelOptions = ref([])
const factoryOptions = ref([])

const departmentOptionsWithNone = computed(() => [
  { departmentId: '0', departmentName: t('systembasicmgmt.departmentInfo.topLevel'), departmentChildList: [] },
  ...departmentOptions.value
])

const filters = reactive({
  departmentCode: '',
  departmentName: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)

const editForm = reactive({
  departmentId: '',
  departmentCode: '',
  departmentNameCn: '',
  departmentNameEn: '',
  parentId: '',
  departmentLevelId: '',
  factory: '',
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

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 401/403 由全局拦截器统一处理，这里不再重复提示 */
const showApiError = (res, fallbackKey = 'systembasicmgmt.departmentInfo.getFailed') => {
  if (res?.code === 401 || res?.code === 403) return
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

const getFirstEnabledDepartmentLevelId = () => {
  return departmentLevelOptions.value.find(item => !item.disabled)?.departmentLevelId ?? ''
}

const fetchDepartmentTree = async () => {
  loading.value = true
  const res = await post(GET_DEPARTMENT_TREE_API.GET_DEPARTMENT_TREE, {
    departmentCode: filters.departmentCode,
    departmentName: filters.departmentName
  })
  if (res?.code === 200) {
    departmentList.value = res.data || []
  } else {
    showApiError(res)
    departmentList.value = []
  }
  loading.value = false
}

const fetchDepartmentLevelDropdown = async () => {
  const res = await post(GET_DEPARTMENTLEVEL_DROPDOWN_API.GET_DEPARTMENTLEVEL_DROPDOWN, {})
  if (res?.code === 200) {
    departmentLevelOptions.value = res.data || []
  } else {
    showApiError(res)
    departmentLevelOptions.value = []
  }
}

const fetchDepartmentDropdown = async () => {
  const res = await post(GET_DEPARTMENT_TREE_DROPDOWN_API.GET_DEPARTMENT_TREE_DROPDOWN, {})
  if (res?.code === 200) {
    departmentOptions.value = res.data || []
  } else {
    showApiError(res)
    departmentOptions.value = []
  }
}

const fetchFactoryDropdown = async () => {
  const res = await post(GET_FACTORY_DROP_API.GET_FACTORY_DROP, {})
  if (res?.code === 200) {
    factoryOptions.value = res.data || []
  } else {
    showApiError(res)
    factoryOptions.value = []
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => fetchDepartmentTree(), DEBOUNCE_MS)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    departmentId: '',
    departmentCode: '',
    departmentNameCn: '',
    departmentNameEn: '',
    parentId: '0',
    departmentLevelId: getFirstEnabledDepartmentLevelId(),
    factory: '',
    description: '',
    sortOrder: 1,
    landline: '',
    email: '',
    address: '',
    isEnabled: 1
  })
}

const filterNodeMethod = (value, data) => {
  if (!value) return true
  return data.departmentName.includes(value)
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.departmentCode = ''
  filters.departmentName = ''
  scheduleSearch()
}

const handleAdd = () => {
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.departmentInfo.addDepartment')
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleAddChild = (row) => {
  resetEditForm()
  editForm.parentId = row.departmentId
  dialogTitle.value = t('systembasicmgmt.departmentInfo.addChild')
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  resetEditForm()
  const formData = new FormData()
  formData.append('deptId', row.departmentId)
  const res = await post(GET_DEPARTMENT_ENTITY_API.GET_DEPARTMENT_ENTITY, formData)
  if (res?.code === 200) {
    const data = res.data
    Object.assign(editForm, {
      departmentId: data.departmentId,
      departmentCode: data.departmentCode,
      departmentNameCn: data.departmentNameCn,
      departmentNameEn: data.departmentNameEn,
      parentId: data.parentId,
      departmentLevelId: data.departmentLevelId || getFirstEnabledDepartmentLevelId(),
      factory: data.factory || '',
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
    showApiError(res)
  }
}

const handleDelete = async (row) => {
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
  const res = await post(DELETE_DEPARTMENT_API.DELETE_DEPARTMENT, formData)
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    fetchDepartmentTree()
  } else {
    showApiError(res)
  }
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  const params = {
    departmentCode: editForm.departmentCode,
    departmentNameCn: editForm.departmentNameCn,
    departmentNameEn: editForm.departmentNameEn,
    parentId: editForm.parentId,
    departmentLevelId: editForm.departmentLevelId,
    factory: editForm.factory,
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
  const res = await post(api, params)
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    fetchDepartmentTree()
  } else {
    showApiError(res)
  }
  submitLoading.value = false
}

const handleDialogClose = () => {
  resetEditForm()
  editFormRef.value?.clearValidate()
}

onMounted(() => {
  fetchDepartmentTree()
  fetchDepartmentLevelDropdown()
  fetchDepartmentDropdown()
  fetchFactoryDropdown()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>

<!-- 部门树下拉项加高、加宽（下拉挂载到 body，需单独样式） -->
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
