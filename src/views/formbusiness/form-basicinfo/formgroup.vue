<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" aria-label="表单组别筛选">
        <el-form-item :label="$t('formbusiness.formgroup.formGroupName')">
          <el-input
            v-model="searchForm.formGroupName"
            :placeholder="$t('formbusiness.formgroup.pleaseInputFormGroupName')"
            clearable
            style="width: 200px"
          />
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
            {{ $t('formbusiness.formgroup.addFormGroup') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="formGroupList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        :empty-text="$t('common.noData')"
        >
          <el-table-column type="index" :label="$t('formbusiness.formgroup.index')" width="70" align="center" fixed />
          <el-table-column prop="formGroupNameCn" :label="$t('formbusiness.formgroup.formGroupNameCn')" align="left" min-width="150" />
          <el-table-column prop="formGroupNameEn" :label="$t('formbusiness.formgroup.formGroupNameEn')" align="left" min-width="150" />
          <el-table-column prop="description" :label="$t('formbusiness.formgroup.description')" align="left" min-width="300" />
          <el-table-column :label="$t('common.operation')" min-width="100" fixed="right" align="center">
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
          @current-change="getFormGroupList"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? $t('formbusiness.formgroup.editFormGroup') : $t('formbusiness.formgroup.addFormGroup')"
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
          aria-label="表单组别编辑"
        >
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formgroup.formGroupNameCn')" prop="formGroupNameCn">
              <el-input
                v-model="form.formGroupNameCn"
                :placeholder="$t('formbusiness.formgroup.pleaseInputFormGroupNameCn')"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.formgroup.formGroupNameEn')" prop="formGroupNameEn">
              <el-input
                v-model="form.formGroupNameEn"
                :placeholder="$t('formbusiness.formgroup.pleaseInputFormGroupNameEn')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formgroup.sortOrder')" prop="sortOrder">
              <el-input-number v-model="form.sortOrder" :min="1" :max="999" style="width:100%" />
            </el-form-item>
            <el-form-item />
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('formbusiness.formgroup.description')" prop="description">
              <el-input
                v-model="form.description"
                :placeholder="$t('formbusiness.formgroup.pleaseInputDescription')"
                style="width:100%"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
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
  GET_FORMGROUP_LIST_API,
  GET_FORMGROUP_ENTITY_API,
  INSERT_FORMGROUP_ENTITY_API,
  UPDATE_FORMGROUP_API,
  DELETE_FORMGROUP_ENTITY_API
} from '@/config/api/formbusiness/form-basicInfo/formgroup.js'
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
const formGroupList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const searchForm = reactive({ formGroupName: '' })

const pagination = reactive({ pageIndex: 1, pageSize: 20, totalCount: 0 })

const form = reactive({
  formGroupId:     '',
  formGroupNameCn: '',
  formGroupNameEn: '',
  sortOrder:       1,
  description:     ''
})

const rules = {
  formGroupNameCn: [{ required: true, message: () => t('formbusiness.formgroup.pleaseInputFormGroupNameCn'), trigger: 'blur' }],
  formGroupNameEn: [{ required: true, message: () => t('formbusiness.formgroup.pleaseInputFormGroupNameEn'), trigger: 'blur' }]
}

const getFormGroupList = async () => {
  loading.value = true
  try {
    const res = await post(GET_FORMGROUP_LIST_API, {
      formGroupName: searchForm.formGroupName,
      pageIndex:     pagination.pageIndex,
      pageSize:      pagination.pageSize,
      totalCount:    pagination.totalCount
    })
    if (res.code === 200) {
      formGroupList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showMessage(res.message)
      formGroupList.value = []
    }
  } catch {
    showMessage(t('formbusiness.formgroup.getFailed'))
    formGroupList.value = []
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
    getFormGroupList()
  }, DEBOUNCE_MS)
}

const handleReset = () => {
  searchForm.formGroupName = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getFormGroupList()
}

const resetForm = () => {
  form.formGroupId     = ''
  form.formGroupNameCn = ''
  form.formGroupNameEn = ''
  form.sortOrder       = 1
  form.description     = ''
}

const handleAdd = () => {
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
    const res = await post(GET_FORMGROUP_ENTITY_API, buildFormData({ formGroupId: row.formGroupId }))
    if (res.code === 200) {
      const d = res.data
      form.formGroupId     = d.formGroupId
      form.formGroupNameCn = d.formGroupNameCn
      form.formGroupNameEn = d.formGroupNameEn
      form.sortOrder       = d.sortOrder
      form.description     = d.description
    } else {
      showMessage(res.message)
      dialogVisible.value = false
    }
  } catch {
    showMessage(t('formbusiness.formgroup.getFailed'))
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.formgroup.deleteConfirm'),
      t('common.warning'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  try {
    const res = await post(DELETE_FORMGROUP_ENTITY_API, buildFormData({ formGroupId: row.formGroupId }))
    if (res.code === 200) {
      showMessage(res.message, 'success')
      getFormGroupList()
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.formgroup.operationFailed'))
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  submitLoading.value = true
  try {
    const api = isEdit.value ? UPDATE_FORMGROUP_API : INSERT_FORMGROUP_ENTITY_API
    const res = await post(api, {
      formGroupId:     form.formGroupId,
      formGroupNameCn: form.formGroupNameCn,
      formGroupNameEn: form.formGroupNameEn,
      sortOrder:       form.sortOrder,
      description:     form.description
    })
    if (res.code === 200) {
      showMessage(res.message, 'success')
      dialogVisible.value = false
      getFormGroupList()
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.formgroup.operationFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetForm()
  formRef.value?.clearValidate()
}

onMounted(() => {
  getFormGroupList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
