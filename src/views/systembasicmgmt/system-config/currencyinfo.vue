<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 搜索 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="搜索">
        <el-form-item :label="$t('systembasicmgmt.currencyInfo.filter.currencyCode')">
          <el-input v-model="filters.currencyCode" :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode')" style="width:170px" />
        </el-form-item>
        <el-form-item style="visibility: hidden; width: 0; margin: 0; padding: 0;">
          <el-input style="width: 0; height: 0; border: none; padding: 0; margin: 0;" />
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
            {{ $t('systembasicmgmt.currencyInfo.addCurrency') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <div class="table-container">
        <el-table :data="currencyList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table">
          <el-table-column type="index" :label="$t('systembasicmgmt.currencyInfo.index')" width="70" align="center" fixed />
          <el-table-column prop="currencyCode" :label="$t('systembasicmgmt.currencyInfo.currencyCode')" align="center" min-width="120"/>
          <el-table-column prop="currencyNameCn" :label="$t('systembasicmgmt.currencyInfo.currencyNameCn')" align="left" min-width="150" />
          <el-table-column prop="currencyNameEn" :label="$t('systembasicmgmt.currencyInfo.currencyNameEn')" align="left" min-width="150" />
          <el-table-column prop="remark" :label="$t('systembasicmgmt.currencyInfo.remark')" align="left" min-width="200" />
          <el-table-column :label="$t('systembasicmgmt.currencyInfo.operation')" min-width="130" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small"
                         type="danger"
                         @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
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

    <!-- 编辑状态弹窗 -->
    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyCode')" prop="currencyCode">
            <el-input v-model="editForm.currencyCode"
                     style="width:100%"
                     :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.currencyInfo.isEnabled')" prop="isEnabled">
            <el-switch v-model="editForm.isEnabled"
                      :active-value="1"
                      :inactive-value="0"
                      :active-text="$t('common.yes')"
                      :inactive-text="$t('common.no')"
                      inline-prompt
                      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399"/>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyNameCn')" prop="currencyNameCn">
            <el-input v-model="editForm.currencyNameCn"
                     style="width:100%"
                     :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyNameCn')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyNameEn')" prop="currencyNameEn">
            <el-input v-model="editForm.currencyNameEn"
                     style="width:100%"
                     :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyNameEn')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.currencyInfo.remark')" prop="remark">
            <el-input v-model="editForm.remark" style="width:100%" />
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import {
  GET_CURRENCY_PAGES_API,
  INSERT_CURRENCY_API,
  DELETE_CURRENCY_API,
  GET_CURRENCY_ENTITY_API,
  UPDATE_CURRENCY_API
} from '@/config/api/systembasicmgmt/system-config/currency'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const currencyList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const filters = reactive({
  currencyCode: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref(t('systembasicmgmt.currencyInfo.editCurrency'))

const editForm = reactive({
  currencyId: '',
  currencyCode: '',
  currencyNameCn: '',
  currencyNameEn: '',
  isEnabled: 1,
  remark: ''
})

const formRules = {
  currencyCode: [
    { required: true, message: t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode'), trigger: 'blur' }
  ],
  currencyNameCn: [
    { required: true, message: t('systembasicmgmt.currencyInfo.pleaseInputCurrencyNameCn'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchCurrencyPages()
  }, DEBOUNCE_MS)
}

onMounted(() => {
  fetchCurrencyPages()
})

const fetchCurrencyEntity = async (currencyId) => {
  try {
    const res = await post(GET_CURRENCY_ENTITY_API.GET_CURRENCY_ENTITY, { currencyId })
    if (res && res.code === 200) {
      return res.data
    }
    showMessage(res?.message || t('systembasicmgmt.currencyInfo.getCurrencyEntityFailed'))
  } catch {
    showMessage(t('systembasicmgmt.currencyInfo.getCurrencyEntityFailed'))
    return null
  }
}

const fetchCurrencyPages = async () => {
  try {
    loading.value = true
    const params = {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      currencyCode: filters.currencyCode || ''
    }
    const res = await post(GET_CURRENCY_PAGES_API.GET_CURRENCY_PAGES, params)
    if (res && res.code === 200) {
      currencyList.value = res.data || []
      pagination.totalCount = res.data?.totalCount || 0
    } else {
      showMessage(res?.message || t('systembasicmgmt.currencyInfo.getCurrencyPagesFailed'))
    }
  } catch {
    showMessage(t('systembasicmgmt.currencyInfo.getCurrencyPagesFailed'))
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  scheduleSearch()
}

const handleReset = () => {
  filters.currencyCode = ''
  scheduleSearch()
}

const handlePageChange = () => {
  fetchCurrencyPages()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchCurrencyPages()
}

const resetForm = () => {
  editForm.currencyId = ''
  editForm.currencyCode = ''
  editForm.currencyNameCn = ''
  editForm.currencyNameEn = ''
  editForm.isEnabled = 1
  editForm.remark = ''
}

const insertCurrency = async () => {
  submitLoading.value = true
  const params = {
    currencyCode: editForm.currencyCode,
    currencyNameCn: editForm.currencyNameCn,
    currencyNameEn: editForm.currencyNameEn || '',
    remark: editForm.remark || ''
  }
  const res = await post(INSERT_CURRENCY_API.INSERT_CURRENCY, params)
  if (res && res.code === 200) {
    showMessage(t('systembasicmgmt.currencyInfo.insertCurrencySuccess'), 'success')
    dialogVisible.value = false
    fetchCurrencyPages()
  } else {
    showMessage(res?.message)
  }
  submitLoading.value = false
}

const updateCurrency = async () => {
  submitLoading.value = true
  const params = {
    currencyId: editForm.currencyId,
    currencyCode: editForm.currencyCode,
    currencyNameCn: editForm.currencyNameCn,
    currencyNameEn: editForm.currencyNameEn || '',
    isEnabled: editForm.isEnabled,
    remark: editForm.remark || ''
  }
  const res = await post(UPDATE_CURRENCY_API.UPDATE_CURRENCY, params)
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    fetchCurrencyPages()
  } else {
    showMessage(res?.message)
  }
  submitLoading.value = false
}

const deleteCurrency = async (currencyId) => {
  const res = await post(DELETE_CURRENCY_API.DELETE_CURRENCY, { currencyId })
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    if (currencyList.value.length === 1 && pagination.pageIndex > 1) {
      pagination.pageIndex--
    }
    fetchCurrencyPages()
  } else {
    showMessage(res?.message)
  }
}

const handleAdd = () => {
  resetForm()
  dialogTitle.value = t('systembasicmgmt.currencyInfo.addCurrency')
  dialogVisible.value = true
  nextTick(() => {
    editFormRef.value?.focus()
  })
}

const handleEdit = async (index, row) => {
  const entity = await fetchCurrencyEntity(row.currencyId)
  if (entity) {
    Object.assign(editForm, entity)
    dialogTitle.value = t('systembasicmgmt.currencyInfo.editCurrency')
    dialogVisible.value = true
  }
}

const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.currencyInfo.confirmDeleteCurrency'),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }
  deleteCurrency(row.currencyId)
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return
  if (editForm.currencyId) {
    updateCurrency()
  } else {
    insertCurrency()
  }
}

const handleDialogClose = () => {
  resetForm()
  editFormRef.value?.clearValidate()
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
