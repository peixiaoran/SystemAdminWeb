<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form
        :inline="true"
        :model="searchForm"
        class="conventional-filter-form"
        role="search"
        :aria-label="$t('formbusiness.formtypefield.ariaFilterLabel')"
      >
        <el-form-item :label="$t('formbusiness.formtypefield.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            :placeholder="$t('formbusiness.formtypefield.pleaseSelectFormGroup')"
            style="width: 200px"
            :clearable="false"
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
        <el-form-item :label="$t('formbusiness.formtypefield.formTypeName')">
          <el-select
            v-model="searchForm.formTypeId"
            :placeholder="$t('formbusiness.formtypefield.pleaseSelectFormType')"
            style="width: 200px"
            :clearable="false"
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
        <el-form-item class="form-button-group">
          <el-button type="primary" @click="scheduleSearch" plain>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
        <el-form-item class="form-right-button">
          <el-button type="primary" @click="handleAdd">
            {{ $t('formbusiness.formtypefield.addFormTypeField') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="fieldList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.formtypefield.index')" width="70" align="center" fixed />
          <el-table-column prop="fieldKey" :label="$t('formbusiness.formtypefield.fieldKey')" align="left" min-width="180" />
          <el-table-column prop="fieldNameCn" :label="$t('formbusiness.formtypefield.fieldNameCn')" align="left" min-width="180" />
          <el-table-column prop="fieldNameEn" :label="$t('formbusiness.formtypefield.fieldNameEn')" align="left" min-width="200" />
          <el-table-column prop="sortOrder" :label="$t('formbusiness.formtypefield.sortOrder')" align="center" min-width="100" />
          <el-table-column :label="$t('common.operation')" min-width="120" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">
                {{ $t('common.delete') }}
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
          @current-change="getFieldList"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? $t('formbusiness.formtypefield.editFormTypeField') : $t('formbusiness.formtypefield.addFormTypeField')"
      width="50%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="true"
      @close="handleDialogClose"
    >
      <div v-loading="dialogLoading">
        <el-form
          :inline="true"
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
          class="dialog-form"
          role="form"
          :aria-label="$t('formbusiness.formtypefield.ariaEditLabel')"
        >
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formtypefield.formTypeName')" prop="formTypeId">
              <el-select
                v-model="form.formTypeId"
                :placeholder="$t('formbusiness.formtypefield.pleaseSelectFormType')"
                style="width:100%"
                :disabled="isEdit"
              >
                <el-option
                  v-for="item in formTypeOptions"
                  :key="item.formTypeId"
                  :label="item.formTypeName"
                  :value="item.formTypeId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.formtypefield.fieldKey')" prop="fieldKey">
              <el-input
                v-model="form.fieldKey"
                :placeholder="$t('formbusiness.formtypefield.pleaseInputFieldKey')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formtypefield.fieldNameCn')" prop="fieldNameCn">
              <el-input
                v-model="form.fieldNameCn"
                :placeholder="$t('formbusiness.formtypefield.pleaseInputFieldNameCn')"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.formtypefield.fieldNameEn')" prop="fieldNameEn">
              <el-input
                v-model="form.fieldNameEn"
                :placeholder="$t('formbusiness.formtypefield.pleaseInputFieldNameEn')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formtypefield.sortOrder')" prop="sortOrder">
              <el-input-number v-model="form.sortOrder" :min="0" :max="9999" style="width:100%" />
            </el-form-item>
            <el-form-item />
          </div>
        </el-form>
      </div>
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
  GET_FORMTYPEFIELD_PAGE_API,
  GET_FORMTYPEFIELD_ENTITY_API,
  INSERT_FORMTYPEFIELD_ENTITY_API,
  UPDATE_FORMTYPEFIELD_API,
  DELETE_FORMTYPEFIELD_API,
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API
} from '@/config/api/formbusiness/form-basicInfo/formtypefield.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DEBOUNCE_MS = 300

const buildFormData = (params) => {
  const fd = new FormData()
  Object.entries(params).forEach(([k, v]) => fd.append(k, v ?? ''))
  return fd
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const fieldList = ref([])
const formGroupOptions = ref([])
const formTypeOptions = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)
const isEdit = ref(false)

const searchForm = reactive({
  formGroupId: '',
  formTypeId: ''
})

const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

const form = reactive({
  fieldId: '',
  formTypeId: '',
  fieldKey: '',
  fieldNameCn: '',
  fieldNameEn: '',
  sortOrder: 0
})

const rules = {
  formTypeId: [{ required: true, message: () => t('formbusiness.formtypefield.pleaseSelectFormType'), trigger: 'change' }],
  fieldKey: [{ required: true, message: () => t('formbusiness.formtypefield.pleaseInputFieldKey'), trigger: 'blur' }],
  fieldNameCn: [{ required: true, message: () => t('formbusiness.formtypefield.pleaseInputFieldNameCn'), trigger: 'blur' }],
  fieldNameEn: [{ required: true, message: () => t('formbusiness.formtypefield.pleaseInputFieldNameEn'), trigger: 'blur' }],
  sortOrder: [{ required: true, message: () => t('formbusiness.formtypefield.pleaseInputSortOrder'), trigger: 'blur' }]
}

const getFormGroupOptions = async () => {
  try {
    const res = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (res.code === 200) {
      formGroupOptions.value = res.data || []
      if (formGroupOptions.value.length > 0 && !searchForm.formGroupId) {
        searchForm.formGroupId = formGroupOptions.value[0].formGroupId
      }
    } else {
      showMessage(res.message || t('formbusiness.formtypefield.getFormGroupFailed'))
    }
  } catch {
    showMessage(t('formbusiness.formtypefield.getFormGroupFailed'))
  }
}

const getFormTypeOptions = async (formGroupId = searchForm.formGroupId) => {
  if (!formGroupId) {
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    return
  }
  try {
    const res = await post(GET_FORMTYPE_DROPDOWN_API, buildFormData({ formGroupId }))
    if (res.code === 200) {
      formTypeOptions.value = res.data || []
      if (formTypeOptions.value.length > 0) {
        const exists = formTypeOptions.value.some(item => item.formTypeId === searchForm.formTypeId)
        if (!exists) {
          searchForm.formTypeId = formTypeOptions.value[0].formTypeId
        }
      } else {
        searchForm.formTypeId = ''
      }
    } else {
      formTypeOptions.value = []
      searchForm.formTypeId = ''
      showMessage(res.message || t('formbusiness.formtypefield.getFormTypeFailed'))
    }
  } catch {
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    showMessage(t('formbusiness.formtypefield.getFormTypeFailed'))
  }
}

const getFieldList = async () => {
  if (!searchForm.formTypeId) {
    fieldList.value = []
    pagination.totalCount = 0
    loading.value = false
    return
  }
  loading.value = true
  try {
    const res = await post(GET_FORMTYPEFIELD_PAGE_API, {
      formTypeId: searchForm.formTypeId,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    })
    if (res.code === 200) {
      fieldList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showMessage(res.message || t('formbusiness.formtypefield.getFailed'))
      fieldList.value = []
      pagination.totalCount = 0
    }
  } catch {
    showMessage(t('formbusiness.formtypefield.getFailed'))
    fieldList.value = []
    pagination.totalCount = 0
  } finally {
    loading.value = false
  }
}

let searchTimer = null
const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    getFieldList()
  }, DEBOUNCE_MS)
}

const handleFormGroupChange = async () => {
  loading.value = true
  searchForm.formTypeId = ''
  await getFormTypeOptions()
  scheduleSearch()
}

const handleFormTypeChange = () => {
  scheduleSearch()
}

const handleReset = async () => {
  loading.value = true
  if (formGroupOptions.value.length > 0) {
    searchForm.formGroupId = formGroupOptions.value[0].formGroupId
  } else {
    searchForm.formGroupId = ''
  }
  searchForm.formTypeId = ''
  await getFormTypeOptions()
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getFieldList()
}

const resetForm = () => {
  form.fieldId = ''
  form.formTypeId = searchForm.formTypeId || ''
  form.fieldKey = ''
  form.fieldNameCn = ''
  form.fieldNameEn = ''
  form.sortOrder = 0
}

const handleAdd = () => {
  if (!searchForm.formTypeId) {
    showMessage(t('formbusiness.formtypefield.pleaseSelectFormType'))
    return
  }
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true
  try {
    const res = await post(GET_FORMTYPEFIELD_ENTITY_API, buildFormData({ fieldId: row.fieldId }))
    if (res.code === 200 && res.data) {
      const d = res.data
      form.fieldId = d.fieldId || row.fieldId || ''
      form.formTypeId = d.formTypeId || searchForm.formTypeId || ''
      form.fieldKey = d.fieldKey || ''
      form.fieldNameCn = d.fieldNameCn || ''
      form.fieldNameEn = d.fieldNameEn || ''
      form.sortOrder = Number(d.sortOrder ?? 0)
      nextTick(() => formRef.value?.clearValidate())
    } else {
      showMessage(res.message || t('formbusiness.formtypefield.getFailed'))
      dialogVisible.value = false
    }
  } catch {
    showMessage(t('formbusiness.formtypefield.getFailed'))
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.formtypefield.deleteConfirm'),
      t('common.warning'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  try {
    const res = await post(DELETE_FORMTYPEFIELD_API, buildFormData({ fieldId: row.fieldId }))
    if (res.code === 200) {
      showMessage(res.message, 'success')
      if (fieldList.value.length === 1 && pagination.pageIndex > 1) {
        pagination.pageIndex--
      }
      getFieldList()
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.formtypefield.operationFailed'))
  }
}

const buildSubmitPayload = () => ({
  fieldId: form.fieldId || '',
  formTypeId: form.formTypeId || '',
  fieldKey: (form.fieldKey || '').trim(),
  fieldNameCn: (form.fieldNameCn || '').trim(),
  fieldNameEn: (form.fieldNameEn || '').trim(),
  sortOrder: form.sortOrder ?? 0
})

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  submitLoading.value = true
  try {
    const api = isEdit.value ? UPDATE_FORMTYPEFIELD_API : INSERT_FORMTYPEFIELD_ENTITY_API
    const res = await post(api, buildSubmitPayload())
    if (res.code === 200) {
      showMessage(res.message, 'success')
      dialogVisible.value = false
      getFieldList()
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.formtypefield.operationFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetForm()
  formRef.value?.clearValidate()
}

onMounted(async () => {
  loading.value = true
  await getFormGroupOptions()
  await getFormTypeOptions()
  await getFieldList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
