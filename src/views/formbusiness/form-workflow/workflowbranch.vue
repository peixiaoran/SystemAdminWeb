<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="流程分支筛选">
        <el-form-item :label="$t('formbusiness.workflowbranch.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            filterable
            style="width: 180px"
            @change="handleFormGroupChange"
          >
            <el-option
              v-for="item in formGroupOptions"
              :key="item.formGroupId"
              :label="item.formGroupName"
              :value="item.formGroupId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('formbusiness.workflowbranch.formTypeName')">
          <el-select
            v-model="searchForm.formTypeId"
            filterable
            style="width: 180px"
            @change="handleFormTypeChange"
          >
            <el-option
              v-for="item in formTypeOptions"
              :key="item.formTypeId"
              :label="item.formTypeName"
              :value="item.formTypeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-right-button">
          <el-button type="primary" @click="handleAdd" :disabled="!searchForm.formTypeId">
            {{ $t('formbusiness.workflowbranch.addBranch') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="branchList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.workflowbranch.index')" width="70" align="center" fixed />
          <el-table-column prop="branchNameCn" :label="$t('formbusiness.workflowbranch.branchNameCn')" align="left" min-width="200" />
          <el-table-column prop="branchNameEn" :label="$t('formbusiness.workflowbranch.branchNameEn')" align="left" min-width="240" />
          <el-table-column prop="handlerKey" :label="$t('formbusiness.workflowbranch.handlerKey')" align="left" min-width="200" />
          <el-table-column prop="description" :label="$t('formbusiness.workflowbranch.description')" align="left" min-width="260">
            <template #default="{ row }">
              <span>{{ row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.workflowbranch.operation')" width="200" align="center" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleEdit(row)" plain>
                {{ $t('formbusiness.workflowbranch.editBranch') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">
                {{ $t('formbusiness.workflowbranch.deleteBranch') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.pageIndex"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? $t('formbusiness.workflowbranch.editBranch') : $t('formbusiness.workflowbranch.addBranch')"
      width="50%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="true"
      @close="handleDialogClose"
    >
      <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogFormRules" label-width="auto" class="dialog-form">
        <div class="form-row">
          <el-form-item :label="$t('formbusiness.workflowbranch.branchNameCn')" prop="branchNameCn">
            <el-input v-model="dialogForm.branchNameCn" :placeholder="$t('formbusiness.workflowbranch.pleaseInputBranchNameCn')" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('formbusiness.workflowbranch.branchNameEn')" prop="branchNameEn">
            <el-input v-model="dialogForm.branchNameEn" :placeholder="$t('formbusiness.workflowbranch.pleaseInputBranchNameEn')" style="width:100%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('formbusiness.workflowbranch.handlerKey')" prop="handlerKey">
            <el-input v-model="dialogForm.handlerKey" :placeholder="$t('formbusiness.workflowbranch.pleaseInputHandlerKey')" style="width:100%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('formbusiness.workflowbranch.description')" class="full-width-item">
            <el-input v-model="dialogForm.description" style="width:100%" />
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import {
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API,
  GET_WORKFLOWBRANCH_LIST_API,
  INSERT_WORKFLOWBRANCH_API,
  DELETE_WORKFLOWBRANCH_API,
  GET_WORKFLOWBRANCH_ENTITY_API,
  UPDATE_WORKFLOWBRANCH_API
} from '@/config/api/formbusiness/form-workflow/workflowbranch.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(false)
const branchList = ref([])
const formGroupOptions = ref([])
const formTypeOptions = ref([])

const searchForm = reactive({
  formGroupId: '',
  formTypeId: ''
})

const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const getFormGroupOptions = async () => {
  try {
    const response = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (response.code === 200) {
      formGroupOptions.value = response.data || []
      if (formGroupOptions.value.length > 0 && !searchForm.formGroupId) {
        searchForm.formGroupId = formGroupOptions.value[0].formGroupId
        await getFormTypeOptions(searchForm.formGroupId)
      }
    } else {
      showMessage(response.message)
    }
  } catch {
    showMessage(t('formbusiness.workflowbranch.getFormGroupFailed'))
  }
}

const getFormTypeOptions = async (formGroupId) => {
  if (!formGroupId) {
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    branchList.value = []
    return
  }
  try {
    const formData = new FormData()
    formData.append('formGroupId', String(formGroupId))
    const response = await post(GET_FORMTYPE_DROPDOWN_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (response.code === 200) {
      formTypeOptions.value = response.data || []
      if (formTypeOptions.value.length > 0) {
        searchForm.formTypeId = formTypeOptions.value[0].formTypeId
        await getBranchList()
      } else {
        searchForm.formTypeId = ''
        branchList.value = []
      }
    } else {
      showMessage(response.message)
      formTypeOptions.value = []
      searchForm.formTypeId = ''
      branchList.value = []
    }
  } catch {
    showMessage(t('formbusiness.workflowbranch.getFormTypeFailed'))
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    branchList.value = []
  }
}

const getBranchList = async () => {
  if (!searchForm.formTypeId) {
    branchList.value = []
    return
  }
  loading.value = true
  try {
    const params = {
      formTypeId: searchForm.formTypeId,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    }
    const response = await post(GET_WORKFLOWBRANCH_LIST_API, params)
    if (response.code === 200) {
      branchList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      showMessage(response.message)
      branchList.value = []
    }
  } catch {
    showMessage(t('formbusiness.workflowbranch.getFailed'))
    branchList.value = []
  } finally {
    loading.value = false
  }
}

const handleFormGroupChange = async (val) => {
  await getFormTypeOptions(val)
}

const handleFormTypeChange = async () => {
  pagination.pageIndex = 1
  await getBranchList()
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getBranchList()
}

const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getBranchList()
}

const dialogVisible = ref(false)
const submitLoading = ref(false)
const dialogFormRef = ref(null)
const isEditMode = ref(false)

const dialogForm = reactive({
  branchId: '',
  branchNameCn: '',
  branchNameEn: '',
  handlerKey: '',
  description: ''
})

const dialogFormRules = reactive({
  branchNameCn: [
    { required: true, message: () => t('formbusiness.workflowbranch.pleaseInputBranchNameCn'), trigger: 'blur' }
  ],
  branchNameEn: [
    { required: true, message: () => t('formbusiness.workflowbranch.pleaseInputBranchNameEn'), trigger: 'blur' }
  ],
  handlerKey: [
    { required: true, message: () => t('formbusiness.workflowbranch.pleaseInputHandlerKey'), trigger: 'blur' }
  ]
})

const resetDialogForm = () => {
  dialogForm.branchId = ''
  dialogForm.branchNameCn = ''
  dialogForm.branchNameEn = ''
  dialogForm.handlerKey = ''
  dialogForm.description = ''
}

const handleAdd = () => {
  isEditMode.value = false
  resetDialogForm()
  dialogVisible.value = true
  nextTick(() => {
    dialogFormRef.value?.clearValidate()
  })
}

const handleEdit = async (row) => {
  try {
    const formData = new FormData()
    formData.append('branchId', String(row.branchId))
    const response = await post(GET_WORKFLOWBRANCH_ENTITY_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (response.code === 200 && response.data) {
      isEditMode.value = true
      dialogForm.branchId = response.data.branchId || ''
      dialogForm.branchNameCn = response.data.branchNameCn || ''
      dialogForm.branchNameEn = response.data.branchNameEn || ''
      dialogForm.handlerKey = response.data.handlerKey || ''
      dialogForm.description = response.data.description || ''
      dialogVisible.value = true
      nextTick(() => {
        dialogFormRef.value?.clearValidate()
      })
    } else {
      showMessage(response.message || t('formbusiness.workflowbranch.getEntityFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowbranch.getEntityFailed'))
  }
}

const handleDialogClose = () => {
  resetDialogForm()
  isEditMode.value = false
  dialogVisible.value = false
}

const handleSubmit = async () => {
  if (!dialogFormRef.value) return
  try {
    await dialogFormRef.value.validate()
  } catch {
    return
  }

  submitLoading.value = true
  const isEdit = isEditMode.value
  try {
    const params = {
      branchId: dialogForm.branchId || '',
      formTypeId: searchForm.formTypeId,
      branchNameCn: dialogForm.branchNameCn,
      branchNameEn: dialogForm.branchNameEn,
      handlerKey: dialogForm.handlerKey,
      description: dialogForm.description || ''
    }
    const api = isEdit ? UPDATE_WORKFLOWBRANCH_API : INSERT_WORKFLOWBRANCH_API
    const successKey = isEdit ? 'editSuccess' : 'addSuccess'
    const failKey = isEdit ? 'editFailed' : 'addFailed'

    const response = await post(api, params)
    if (response.code === 200 || response.code === '200') {
      showMessage(response.message || t(`formbusiness.workflowbranch.${successKey}`), 'success')
      dialogVisible.value = false
      await getBranchList()
    } else {
      showMessage(response.message || t(`formbusiness.workflowbranch.${failKey}`))
    }
  } catch {
    showMessage(t(`formbusiness.workflowbranch.${isEdit ? 'editFailed' : 'addFailed'}`))
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.workflowbranch.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('branchId', String(row.branchId))
    const response = await post(DELETE_WORKFLOWBRANCH_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (response.code === 200 || response.code === '200') {
      showMessage(response.message || t('formbusiness.workflowbranch.deleteSuccess'), 'success')
      if (branchList.value.length === 1 && pagination.pageIndex > 1) {
        pagination.pageIndex--
      }
      await getBranchList()
    } else {
      showMessage(response.message || t('formbusiness.workflowbranch.deleteFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowbranch.deleteFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getFormGroupOptions()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.full-width-item {
  flex: 1 1 100% !important;
  max-width: 100% !important;
}
</style>
