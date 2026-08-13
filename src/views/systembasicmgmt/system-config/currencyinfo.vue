<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 过滤条件 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.currencyInfo.ariaFilterLabel')">
        <el-form-item :label="$t('systembasicmgmt.currencyInfo.filter.currencyCode')">
          <el-input v-model="filters.currencyCode"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode')" />
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

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="currencyList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.currencyInfo.index')" width="70" align="center" fixed />
          <el-table-column prop="currencyCode" :label="$t('systembasicmgmt.currencyInfo.currencyCode')" align="center" min-width="120" />
          <el-table-column prop="currencyNameCn" :label="$t('systembasicmgmt.currencyInfo.currencyNameCn')" align="left" min-width="150" />
          <el-table-column prop="currencyNameEn" :label="$t('systembasicmgmt.currencyInfo.currencyNameEn')" align="left" min-width="150" />
          <el-table-column prop="remark" :label="$t('systembasicmgmt.currencyInfo.remark')" align="left" min-width="200" />
          <el-table-column :label="$t('systembasicmgmt.currencyInfo.operation')" min-width="100" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">{{ $t('common.delete') }}</el-button>
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
                       @current-change="handlePageChange" />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <div v-loading="dialogLoading">
        <el-form :inline="true"
                 :model="editForm"
                 :rules="formRules"
                 ref="editFormRef"
                 label-width="130px"
                 class="dialog-form"
                 role="form"
                 :aria-label="$t('systembasicmgmt.currencyInfo.ariaEditLabel')">
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyCode')" prop="currencyCode">
              <el-input v-model="editForm.currencyCode"
                        style="width:100%"
                        :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode')" />
            </el-form-item>
            <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyNameCn')" prop="currencyNameCn">
              <el-input v-model="editForm.currencyNameCn"
                        style="width:100%"
                        :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyNameCn')" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyNameEn')" prop="currencyNameEn">
              <el-input v-model="editForm.currencyNameEn"
                        style="width:100%"
                        :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyNameEn')" />
            </el-form-item>
            <!-- 占位项：保持与上方两列布局对齐 -->
            <el-form-item />
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('systembasicmgmt.currencyInfo.remark')" prop="remark">
              <el-input v-model="editForm.remark" type="textarea" :rows="4" style="width:100%" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post } from '@/utils/request'
import {
  GET_CURRENCY_PAGES_API,
  INSERT_CURRENCY_API,
  DELETE_CURRENCY_API,
  GET_CURRENCY_ENTITY_API,
  UPDATE_CURRENCY_API
} from '@/config/api/systembasicmgmt/system-config/currency'

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
const dialogLoading = ref(false)
const dialogTitle = ref(t('systembasicmgmt.currencyInfo.editCurrency'))

const editForm = reactive({
  currencyId: '',
  currencyCode: '',
  currencyNameCn: '',
  currencyNameEn: '',
  remark: ''
})

const formRules = {
  currencyCode: [
    { required: true, message: () => t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode'), trigger: 'blur' }
  ],
  currencyNameCn: [
    { required: true, message: () => t('systembasicmgmt.currencyInfo.pleaseInputCurrencyNameCn'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const fetchCurrencyPages = async () => {
  loading.value = true
  try {
    const res = await post(GET_CURRENCY_PAGES_API.GET_CURRENCY_PAGES, {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      currencyCode: filters.currencyCode || ''
    })
    if (res?.code === 200) {
      currencyList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showMessage(res?.message || t('systembasicmgmt.currencyInfo.getCurrencyPagesFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
    }
  } catch {
    showMessage(t('systembasicmgmt.currencyInfo.getCurrencyPagesFailed'))
  } finally {
    loading.value = false
  }
}

const fetchCurrencyEntity = async (currencyId) => {
  try {
    const res = await post(GET_CURRENCY_ENTITY_API.GET_CURRENCY_ENTITY, { currencyId })
    if (res?.code === 200) {
      return res.data
    }
    showMessage(res?.message || t('systembasicmgmt.currencyInfo.getCurrencyEntityFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
    return null
  } catch {
    showMessage(t('systembasicmgmt.currencyInfo.getCurrencyEntityFailed'))
    return null
  }
}

const insertCurrency = async () => {
  submitLoading.value = true
  const res = await post(INSERT_CURRENCY_API.INSERT_CURRENCY, {
    currencyCode: editForm.currencyCode,
    currencyNameCn: editForm.currencyNameCn,
    currencyNameEn: editForm.currencyNameEn || '',
    remark: editForm.remark || ''
  })
  if (res?.code === 200) {
    showMessage(t('systembasicmgmt.currencyInfo.insertCurrencySuccess'), 'success')
    dialogVisible.value = false
    fetchCurrencyPages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
  submitLoading.value = false
}

const updateCurrency = async () => {
  submitLoading.value = true
  const res = await post(UPDATE_CURRENCY_API.UPDATE_CURRENCY, {
    currencyId: editForm.currencyId,
    currencyCode: editForm.currencyCode,
    currencyNameCn: editForm.currencyNameCn,
    currencyNameEn: editForm.currencyNameEn || '',
    remark: editForm.remark || ''
  })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    fetchCurrencyPages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
  submitLoading.value = false
}

const deleteCurrency = async (currencyId) => {
  const res = await post(DELETE_CURRENCY_API.DELETE_CURRENCY, { currencyId })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    // 删除的是当前页最后一条时回到上一页，避免停留在空页
    if (currencyList.value.length === 1 && pagination.pageIndex > 1) {
      pagination.pageIndex--
    }
    fetchCurrencyPages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchCurrencyPages()
  }, DEBOUNCE_MS)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    currencyId: '',
    currencyCode: '',
    currencyNameCn: '',
    currencyNameEn: '',
    remark: ''
  })
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.currencyCode = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchCurrencyPages()
}

const handlePageChange = () => {
  fetchCurrencyPages()
}

const handleAdd = () => {
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.currencyInfo.addCurrency')
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  dialogTitle.value = t('systembasicmgmt.currencyInfo.editCurrency')
  dialogVisible.value = true
  dialogLoading.value = true
  const entity = await fetchCurrencyEntity(row.currencyId)
  if (!entity) {
    dialogVisible.value = false
    dialogLoading.value = false
    return
  }
  Object.assign(editForm, entity)
  // 数据就绪后再清校验、收起遮罩，避免请求期间短暂显示必填红字
  nextTick(() => {
    editFormRef.value?.clearValidate()
    dialogLoading.value = false
  })
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.currencyInfo.confirmDeleteCurrency'),
      t('common.warning'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
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
  resetEditForm()
  dialogLoading.value = false
  editFormRef.value?.clearValidate()
}

onMounted(() => {
  fetchCurrencyPages()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
