<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" :aria-label="$t('formbusiness.controlinfo.ariaFilterLabel')">
        <el-form-item :label="$t('formbusiness.controlinfo.controlCode')">
          <el-input
            v-model="searchForm.controlCode"
            :placeholder="$t('formbusiness.controlinfo.pleaseInputControlCode')"
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
            {{ $t('formbusiness.controlinfo.addControl') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="controlList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        :empty-text="$t('common.noData')"
        >
          <el-table-column type="index" :label="$t('formbusiness.controlinfo.index')" width="70" align="center" fixed />
          <el-table-column prop="controlCode" :label="$t('formbusiness.controlinfo.controlCode')" align="left" min-width="150" />
          <el-table-column prop="controlName" :label="$t('formbusiness.controlinfo.controlName')" align="left" min-width="150" />
          <el-table-column prop="description" :label="$t('formbusiness.controlinfo.description')" align="left" min-width="300" />
          <el-table-column :label="$t('common.operation')" min-width="60" fixed="right" align="center">
            <template #default="scope">
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
          @current-change="getControlList"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? $t('formbusiness.controlinfo.editControl') : $t('formbusiness.controlinfo.addControl')"
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
          :aria-label="$t('formbusiness.controlinfo.ariaEditLabel')"
        >
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.controlinfo.controlCode')" prop="controlCode">
              <el-input
                v-model="form.controlCode"
                :placeholder="$t('formbusiness.controlinfo.pleaseInputControlCode')"
                style="width:100%"
                :disabled="isEdit"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.controlinfo.controlName')" prop="controlName">
              <el-input
                v-model="form.controlName"
                :placeholder="$t('formbusiness.controlinfo.pleaseInputControlName')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('formbusiness.controlinfo.description')" prop="description">
              <el-input
                v-model="form.description"
                :placeholder="$t('formbusiness.controlinfo.pleaseInputDescription')"
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
  GET_CONTROL_PAGE_API,
  INSERT_CONTROL_ENTITY_API,
  DELETE_CONTROL_API
} from '@/config/api/formbusiness/form-basicInfo/controlinfo.js'
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
const controlList = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)
const isEdit = ref(false)

const searchForm = reactive({ controlCode: '' })

const pagination = reactive({ pageIndex: 1, pageSize: 20, totalCount: 0 })

const form = reactive({ controlCode: '', controlName: '', description: '' })

const rules = {
  controlCode: [{ required: true, message: () => t('formbusiness.controlinfo.pleaseInputControlCode'), trigger: 'blur' }],
  controlName: [{ required: true, message: () => t('formbusiness.controlinfo.pleaseInputControlName'), trigger: 'blur' }]
}

const getControlList = async () => {
  loading.value = true
  try {
    const res = await post(GET_CONTROL_PAGE_API, {
      controlCode: searchForm.controlCode,
      pageIndex:   pagination.pageIndex,
      pageSize:    pagination.pageSize,
      totalCount:  pagination.totalCount
    })
    if (res.code === 200) {
      controlList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showMessage(res.message)
      controlList.value = []
    }
  } catch {
    showMessage(t('formbusiness.controlinfo.getFailed'))
    controlList.value = []
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
    getControlList()
  }, DEBOUNCE_MS)
}

const handleReset = () => {
  searchForm.controlCode = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getControlList()
}

const resetForm = () => {
  form.controlCode = ''
  form.controlName = ''
  form.description = ''
}

const handleAdd = () => {
  resetForm()
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.controlinfo.deleteConfirm'),
      t('common.warning'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  try {
    const res = await post(DELETE_CONTROL_API, buildFormData({ controlCode: row.controlCode }))
    if (res.code === 200) {
      showMessage(res.message, 'success')
      getControlList()
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.controlinfo.operationFailed'))
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
    const res = await post(INSERT_CONTROL_ENTITY_API, {
      controlCode: form.controlCode,
      controlName: form.controlName,
      description: form.description
    })
    if (res.code === 200) {
      showMessage(res.message, 'success')
      dialogVisible.value = false
      getControlList()
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.controlinfo.operationFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetForm()
  formRef.value?.clearValidate()
}

onMounted(() => {
  getControlList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
