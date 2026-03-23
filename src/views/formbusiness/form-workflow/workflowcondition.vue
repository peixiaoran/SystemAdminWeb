<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="流程条件筛选">
        <el-form-item :label="$t('formbusiness.workflowcondition.formGroupName')">
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
        <el-form-item :label="$t('formbusiness.workflowcondition.formTypeName')">
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
            {{ $t('formbusiness.workflowcondition.addCondition') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="conditionList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.workflowcondition.index')" width="70" align="center" fixed />
          <el-table-column prop="conditionNameCn" :label="$t('formbusiness.workflowcondition.conditionNameCn')" align="left" min-width="200" />
          <el-table-column prop="conditionNameEn" :label="$t('formbusiness.workflowcondition.conditionNameEn')" align="left" min-width="240" />
          <el-table-column prop="handlerKey" :label="$t('formbusiness.workflowcondition.handlerKey')" align="left" min-width="200" />
          <el-table-column prop="description" :label="$t('formbusiness.workflowcondition.description')" align="left" min-width="260">
            <template #default="{ row }">
              <span>{{ row.description || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.workflowcondition.operation')" width="200" align="center" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleEdit(row)" plain>
                {{ $t('formbusiness.workflowcondition.editCondition') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)" plain>
                {{ $t('formbusiness.workflowcondition.deleteCondition') }}
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
      :title="isEditMode ? $t('formbusiness.workflowcondition.editCondition') : $t('formbusiness.workflowcondition.addCondition')"
      width="50%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="true"
      @close="handleDialogClose"
    >
      <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogFormRules" label-width="auto" class="dialog-form">
        <div class="form-row">
          <el-form-item :label="$t('formbusiness.workflowcondition.conditionNameCn')" prop="conditionNameCn">
            <el-input v-model="dialogForm.conditionNameCn" :placeholder="$t('formbusiness.workflowcondition.pleaseInputConditionNameCn')" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('formbusiness.workflowcondition.conditionNameEn')" prop="conditionNameEn">
            <el-input v-model="dialogForm.conditionNameEn" :placeholder="$t('formbusiness.workflowcondition.pleaseInputConditionNameEn')" style="width:100%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('formbusiness.workflowcondition.handlerKey')" prop="handlerKey">
            <el-input v-model="dialogForm.handlerKey" :placeholder="$t('formbusiness.workflowcondition.pleaseInputHandlerKey')" style="width:100%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('formbusiness.workflowcondition.description')" class="full-width-item">
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
  GET_WORKFLOWCONDITION_LIST_API,
  INSERT_WORKFLOWCONDITION_API,
  DELETE_WORKFLOWCONDITION_API,
  GET_WORKFLOWCONDITION_ENTITY_API,
  UPDATE_WORKFLOWCONDITION_API
} from '@/config/api/formbusiness/form-workflow/workflowcondition.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const loading = ref(false)
const conditionList = ref([])
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
    showMessage(t('formbusiness.workflowcondition.getFormGroupFailed'))
  }
}

const getFormTypeOptions = async (formGroupId) => {
  if (!formGroupId) {
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    conditionList.value = []
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
        await getConditionList()
      } else {
        searchForm.formTypeId = ''
        conditionList.value = []
      }
    } else {
      showMessage(response.message)
      formTypeOptions.value = []
      searchForm.formTypeId = ''
      conditionList.value = []
    }
  } catch {
    showMessage(t('formbusiness.workflowcondition.getFormTypeFailed'))
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    conditionList.value = []
  }
}

const getConditionList = async () => {
  if (!searchForm.formTypeId) {
    conditionList.value = []
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
    const response = await post(GET_WORKFLOWCONDITION_LIST_API, params)
    if (response.code === 200) {
      conditionList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      showMessage(response.message)
      conditionList.value = []
    }
  } catch {
    showMessage(t('formbusiness.workflowcondition.getFailed'))
    conditionList.value = []
  } finally {
    loading.value = false
  }
}

const handleFormGroupChange = async (val) => {
  await getFormTypeOptions(val)
}

const handleFormTypeChange = async () => {
  pagination.pageIndex = 1
  await getConditionList()
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getConditionList()
}

const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getConditionList()
}

const dialogVisible = ref(false)
const submitLoading = ref(false)
const dialogFormRef = ref(null)
const isEditMode = ref(false)

const dialogForm = reactive({
  conditionId: '',
  conditionNameCn: '',
  conditionNameEn: '',
  handlerKey: '',
  description: ''
})

const dialogFormRules = reactive({
  conditionNameCn: [
    { required: true, message: () => t('formbusiness.workflowcondition.pleaseInputConditionNameCn'), trigger: 'blur' }
  ],
  conditionNameEn: [
    { required: true, message: () => t('formbusiness.workflowcondition.pleaseInputConditionNameEn'), trigger: 'blur' }
  ],
  handlerKey: [
    { required: true, message: () => t('formbusiness.workflowcondition.pleaseInputHandlerKey'), trigger: 'blur' }
  ]
})

const resetDialogForm = () => {
  dialogForm.conditionId = ''
  dialogForm.conditionNameCn = ''
  dialogForm.conditionNameEn = ''
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
    formData.append('conditionId', String(row.conditionId))
    const response = await post(GET_WORKFLOWCONDITION_ENTITY_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (response.code === 200 && response.data) {
      isEditMode.value = true
      dialogForm.conditionId = response.data.conditionId || ''
      dialogForm.conditionNameCn = response.data.conditionNameCn || ''
      dialogForm.conditionNameEn = response.data.conditionNameEn || ''
      dialogForm.handlerKey = response.data.handlerKey || ''
      dialogForm.description = response.data.description || ''
      dialogVisible.value = true
      nextTick(() => {
        dialogFormRef.value?.clearValidate()
      })
    } else {
      showMessage(response.message || t('formbusiness.workflowcondition.getEntityFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowcondition.getEntityFailed'))
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
      conditionId: dialogForm.conditionId || '',
      formTypeId: searchForm.formTypeId,
      conditionNameCn: dialogForm.conditionNameCn,
      conditionNameEn: dialogForm.conditionNameEn,
      handlerKey: dialogForm.handlerKey,
      description: dialogForm.description || ''
    }
    const api = isEdit ? UPDATE_WORKFLOWCONDITION_API : INSERT_WORKFLOWCONDITION_API
    const successKey = isEdit ? 'editSuccess' : 'addSuccess'
    const failKey = isEdit ? 'editFailed' : 'addFailed'

    const response = await post(api, params)
    if (response.code === 200 || response.code === '200') {
      showMessage(response.message || t(`formbusiness.workflowcondition.${successKey}`), 'success')
      dialogVisible.value = false
      await getConditionList()
    } else {
      showMessage(response.message || t(`formbusiness.workflowcondition.${failKey}`))
    }
  } catch {
    showMessage(t(`formbusiness.workflowcondition.${isEdit ? 'editFailed' : 'addFailed'}`))
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.workflowcondition.deleteConfirm'),
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
    formData.append('condititonId', String(row.conditionId))
    const response = await post(DELETE_WORKFLOWCONDITION_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (response.code === 200 || response.code === '200') {
      showMessage(response.message || t('formbusiness.workflowcondition.deleteSuccess'), 'success')
      if (conditionList.value.length === 1 && pagination.pageIndex > 1) {
        pagination.pageIndex--
      }
      await getConditionList()
    } else {
      showMessage(response.message || t('formbusiness.workflowcondition.deleteFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowcondition.deleteFailed'))
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
