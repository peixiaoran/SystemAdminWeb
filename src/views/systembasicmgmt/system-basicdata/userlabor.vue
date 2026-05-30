<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" aria-label="用户职业筛选">
        <el-form-item :label="$t('systembasicmgmt.userLabor.laborName')">
          <el-input
            v-model="searchForm.laborName"
            :placeholder="$t('systembasicmgmt.userLabor.pleaseInputLaborName')"
            style="width: 200px"
          />
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
            {{ $t('systembasicmgmt.userLabor.addLabor') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="laborList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('systembasicmgmt.userLabor.index')" width="70" align="center" fixed />
          <el-table-column prop="laborNameCn" :label="$t('systembasicmgmt.userLabor.laborNameCn')" align="left" min-width="100" />
          <el-table-column prop="laborNameEn" :label="$t('systembasicmgmt.userLabor.laborNameEn')" align="left" min-width="200" />
          <el-table-column prop="description" :label="$t('systembasicmgmt.userLabor.description')" align="left" min-width="300">
            <template #default="scope">
              <el-tooltip
                v-if="scope.row.description"
                :content="scope.row.description"
                placement="top"
                effect="dark"
                popper-class="fixed-width-tooltip"
              >
                <span class="ellipsis-cell">{{ scope.row.description }}</span>
              </el-tooltip>
              <span v-else class="ellipsis-cell">-</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" min-width="100" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">{{ $t('common.delete') }}</el-button>
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
      :title="isEdit ? $t('systembasicmgmt.userLabor.editLabor') : $t('systembasicmgmt.userLabor.addLabor')"
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
          label-width="100px"
          class="dialog-form"
          role="form"
          aria-label="用户职业编辑"
        >
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.userLabor.laborNameCn')" prop="laborNameCn">
              <el-input
                v-model="form.laborNameCn"
                :placeholder="$t('systembasicmgmt.userLabor.pleaseInputLaborNameCn')"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item :label="$t('systembasicmgmt.userLabor.laborNameEn')" prop="laborNameEn">
              <el-input
                v-model="form.laborNameEn"
                :placeholder="$t('systembasicmgmt.userLabor.pleaseInputLaborNameEn')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('systembasicmgmt.userLabor.description')" prop="description">
              <el-input
                v-model="form.description"
                :placeholder="$t('systembasicmgmt.userLabor.pleaseInputDescription')"
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
  GET_USERLABOR_LIST_API,
  GET_USER_LABOR_ENTITY_API,
  INSERT_USER_LABOR_API,
  UPDATE_USER_LABOR_API,
  DELETE_USER_LABOR_API
} from '@/config/api/systembasicmgmt/system-basicdata/userlabor.js'
import { useI18n } from 'vue-i18n'

const DEBOUNCE_MS = 300

const { t } = useI18n()

const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const laborList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const searchForm = reactive({
  laborName: ''
})

const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

const form = reactive({
  laborId: '',
  laborNameCn: '',
  laborNameEn: '',
  description: ''
})

const rules = {
  laborNameCn: [
    { required: true, message: () => t('systembasicmgmt.userLabor.pleaseInputLaborNameCn'), trigger: 'blur' }
  ],
  laborNameEn: [
    { required: true, message: () => t('systembasicmgmt.userLabor.pleaseInputLaborNameEn'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const getLaborList = async () => {
  loading.value = true
  const response = await post(GET_USERLABOR_LIST_API.GET_USERLABOR_LIST, {
    laborName: searchForm.laborName,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  })
  if (response?.code === 200) {
    laborList.value = response.data || []
    pagination.totalCount = response.totalCount || 0
  } else {
    if (response?.code !== 401 && response?.code !== 403) {
      showMessage(response?.message || t('systembasicmgmt.userLabor.getFailed'))
    }
    laborList.value = []
  }
  loading.value = false
}

let searchTimer = null
const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    getLaborList()
  }, DEBOUNCE_MS)
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  searchForm.laborName = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getLaborList()
}

const handleCurrentChange = () => {
  getLaborList()
}

const resetForm = () => {
  Object.assign(form, { laborId: '', laborNameCn: '', laborNameEn: '', description: '' })
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
  const formData = new FormData()
  formData.append('laborId', row.laborId)
  const response = await post(GET_USER_LABOR_ENTITY_API.GET_USER_LABOR_ENTITY, formData)
  if (response?.code === 200) {
    Object.assign(form, response.data)
  } else {
    if (response?.code !== 401 && response?.code !== 403) {
      showMessage(response?.message || t('systembasicmgmt.userLabor.getFailed'))
    }
    dialogVisible.value = false
  }
  dialogLoading.value = false
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.userLabor.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  const formData = new FormData()
  formData.append('laborId', row.laborId)
  const response = await post(DELETE_USER_LABOR_API.DELETE_USER_LABOR, formData)
  if (response?.code === 200) {
    showMessage(response.message, 'success')
    getLaborList()
  } else {
    if (response?.code !== 401 && response?.code !== 403) {
      showMessage(response?.message)
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  const api = isEdit.value ? UPDATE_USER_LABOR_API.UPDATE_USER_LABOR : INSERT_USER_LABOR_API.INSERT_USER_LABOR
  const response = await post(api, { ...form })
  if (response?.code === 200) {
    showMessage(response.message, 'success')
    dialogVisible.value = false
    getLaborList()
  } else {
    if (response?.code !== 401 && response?.code !== 403) {
      showMessage(response?.message || t('systembasicmgmt.userLabor.operationFailed'))
    }
  }
  submitLoading.value = false
}

const handleDialogClose = () => {
  resetForm()
  formRef.value?.clearValidate()
}

onMounted(() => {
  getLaborList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.ellipsis-cell {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
