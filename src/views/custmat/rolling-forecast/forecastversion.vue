<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('custmat.forecastversion.ariaFilterLabel')">
        <el-form-item :label="$t('custmat.forecastversion.versionCode')">
          <el-input v-model="filters.versionCode"
                    style="width: 170px"
                    clearable
                    :placeholder="$t('custmat.forecastversion.pleaseInputVersionCode')" />
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
            {{ $t('custmat.forecastversion.addForecastVersion') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="forecastVersionList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('custmat.forecastversion.index')" width="70" align="center" fixed />
          <el-table-column prop="versionCode" :label="$t('custmat.forecastversion.versionCode')" align="center" min-width="140" />
          <el-table-column prop="startDate" :label="$t('custmat.forecastversion.startDate')" align="center" min-width="120">
            <template #default="scope">{{ formatYmd(parseApiDate(scope.row.startDate)) }}</template>
          </el-table-column>
          <el-table-column prop="endDate" :label="$t('custmat.forecastversion.endDate')" align="center" min-width="120">
            <template #default="scope">{{ formatYmd(parseApiDate(scope.row.endDate)) }}</template>
          </el-table-column>
          <el-table-column prop="year" :label="$t('custmat.forecastversion.year')" align="center" min-width="90" />
          <el-table-column prop="month" :label="$t('custmat.forecastversion.month')" align="center" min-width="90" />
          <el-table-column prop="week" :label="$t('custmat.forecastversion.week')" align="center" min-width="90" />
          <el-table-column prop="statusName" :label="$t('custmat.forecastversion.statusName')" align="center" min-width="100" />
          <el-table-column :label="$t('custmat.forecastversion.operation')" width="280" fixed="right" align="center">
            <template #default="scope">
              <el-button v-if="canEditOrDelete(scope.row)" size="small" @click="handleEdit(scope.row)">
                {{ $t('common.edit') }}
              </el-button>
              <el-button v-if="canUnlock(scope.row)" size="small" type="success" @click="handleUnlock(scope.row)">
                {{ $t('custmat.forecastversion.unlock') }}
              </el-button>
              <el-button v-if="canLock(scope.row)" size="small" type="warning" @click="handleLock(scope.row)">
                {{ $t('custmat.forecastversion.lock') }}
              </el-button>
              <el-button v-if="canEditOrDelete(scope.row)" size="small" type="danger" @click="handleDelete(scope.row)">
                {{ $t('common.delete') }}
              </el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible"
               :title="isEdit ? $t('custmat.forecastversion.editForecastVersionTitle') : $t('custmat.forecastversion.addForecastVersionTitle')"
               width="520px"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <div v-loading="dialogLoading">
        <el-form ref="editFormRef"
                 :model="editForm"
                 :rules="formRules"
                 label-width="auto"
                 class="dialog-form"
                 role="form"
                 :aria-label="$t('custmat.forecastversion.ariaEditLabel')">
          <el-form-item :label="$t('custmat.forecastversion.versionCode')" prop="versionCode">
            <el-input v-model="editForm.versionCode"
                      :placeholder="$t('custmat.forecastversion.pleaseInputVersionCode')" />
          </el-form-item>
          <el-form-item :label="$t('custmat.forecastversion.weekRange')" prop="weekValue">
            <el-date-picker v-model="editForm.weekValue"
                             type="week"
                             style="width:100%"
                             format="YYYY-MM-DD"
                             :first-day-of-week="1"
                             :placeholder="$t('custmat.forecastversion.pleaseSelectWeek')"
                             @change="handleWeekChange" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post, isHandled } from '@/utils/request'
import {
  GET_FORECAST_VERSION_PAGE_API,
  GET_FORECAST_VERSION_ENTITY_API,
  INSERT_FORECAST_VERSION_API,
  UPDATE_FORECAST_VERSION_API,
  DELETE_FORECAST_VERSION_API,
  UNLOCK_FORECAST_VERSION_API,
  LOCK_FORECAST_VERSION_API
} from '@/config/api/custmat/rolling-forecast/forecastversion'

/** 预测版本状态码：编制中 / 已解锁 */
const FORECAST_VERSION_STATUS = {
  PREPARATION: 'Preparation',
  UNLOCK: 'Unlock'
}

const { t } = useI18n()

/** 实体查询/删除接口按 form-urlencoded 提交 */
const FORM_URLENCODED = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

const forecastVersionList = ref([])
const loading = ref(false)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

const filters = reactive({
  versionCode: ''
})

// 新增/编辑对话框
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const editForm = reactive({
  versionId: '',
  versionCode: '',
  weekValue: '',
  startDate: '',
  endDate: ''
})

const formRules = {
  versionCode: [
    { required: true, message: () => t('custmat.forecastversion.versionCodeRequired'), trigger: 'blur' }
  ],
  weekValue: [
    { required: true, message: () => t('custmat.forecastversion.weekRequired'), trigger: 'change' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 业务码失败提示：400 视为告警，其余视为错误 */
const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

/** isLatest 为 1（或字符串 "1"）时展示最新标识 */
const isLatestVersion = (val) => Number(val) === 1

/** 仅状态为编制中（Preparation）时可编辑/删除 */
const canEditOrDelete = (row) => row.status === FORECAST_VERSION_STATUS.PREPARATION

/** 仅最新版本、且状态为编制中（Preparation）时可解锁 */
const canUnlock = (row) => isLatestVersion(row.isLatest) && row.status === FORECAST_VERSION_STATUS.PREPARATION

/** 状态为已解锁（Unlock）时可锁定 */
const canLock = (row) => row.status === FORECAST_VERSION_STATUS.UNLOCK

const pad2 = (n) => String(n).padStart(2, '0')

const formatYmd = (d) => {
  if (!d || isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/** 后端日期为 DateTime：ISO、/Date(ms)/、时间戳等 → JS Date */
const parseApiDate = (val) => {
  if (val === null || val === undefined || val === '') return null
  if (typeof val === 'string') {
    const msMatch = val.match(/\/Date\((-?\d+)\)\//)
    if (msMatch) return new Date(Number(msMatch[1]))
    return new Date(val.includes('T') ? val : val.replace(' ', 'T'))
  }
  if (typeof val === 'number') return new Date(val)
  return null
}

/** 将任意一天规整为其所在周的周一/周日（周一为一周的第一天） */
const getWeekRange = (date) => {
  const day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diffToMonday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { monday, sunday }
}

const handleWeekChange = (val) => {
  if (!val) {
    editForm.startDate = ''
    editForm.endDate = ''
    return
  }
  const { monday, sunday } = getWeekRange(new Date(val))
  editForm.startDate = formatYmd(monday)
  editForm.endDate = formatYmd(sunday)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    versionId: '',
    versionCode: '',
    weekValue: '',
    startDate: '',
    endDate: ''
  })
}

const buildQueryParams = () => ({
  versionCode: filters.versionCode,
  pageIndex: pagination.pageIndex,
  pageSize: pagination.pageSize,
  totalCount: pagination.totalCount
})

const fetchForecastVersionList = async () => {
  loading.value = true
  try {
    const res = await post(GET_FORECAST_VERSION_PAGE_API.GET_FORECAST_VERSION_PAGE, buildQueryParams())

    if (isHandled(res)) {
      forecastVersionList.value = []
      return
    }

    if (res?.code === 200) {
      forecastVersionList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showApiError(res, 'custmat.forecastversion.getFailed')
      forecastVersionList.value = []
    }
  } catch {
    showMessage(t('custmat.forecastversion.getFailed'))
    forecastVersionList.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.pageIndex = 1
  fetchForecastVersionList()
}

const handleReset = () => {
  Object.assign(filters, {
    versionCode: ''
  })
  handleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchForecastVersionList()
}

const handlePageChange = () => {
  fetchForecastVersionList()
}

const handleAdd = async () => {
  resetEditForm()
  isEdit.value = false
  dialogVisible.value = true
  dialogLoading.value = false

  await nextTick()
  editFormRef.value?.clearValidate()
}

const handleEdit = async (row) => {
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true

  try {
    const res = await post(
      GET_FORECAST_VERSION_ENTITY_API.GET_FORECAST_VERSION_ENTITY,
      new URLSearchParams({ versionId: String(row.versionId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) {
      dialogVisible.value = false
      return
    }

    if (res?.code === 200 && res.data) {
      const data = res.data
      const startDate = parseApiDate(data.startDate)
      const endDate = parseApiDate(data.endDate)
      Object.assign(editForm, {
        versionId: data.versionId,
        versionCode: data.versionCode,
        weekValue: startDate,
        startDate: formatYmd(startDate),
        endDate: formatYmd(endDate)
      })
    } else {
      showApiError(res, 'custmat.forecastversion.getForecastVersionDetailFailed')
      dialogVisible.value = false
    }
  } catch {
    showMessage(t('custmat.forecastversion.getForecastVersionDetailFailed'))
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
    nextTick(() => editFormRef.value?.clearValidate())
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('custmat.forecastversion.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  try {
    const res = await post(
      DELETE_FORECAST_VERSION_API.DELETE_FORECAST_VERSION,
      new URLSearchParams({ versionId: String(row.versionId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || t('custmat.forecastversion.deleteForecastVersionSuccess'), 'success')
      fetchForecastVersionList()
    } else {
      showApiError(res, 'custmat.forecastversion.operationFailed')
    }
  } catch {
    showMessage(t('custmat.forecastversion.operationFailed'))
  }
}

const handleUnlock = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('custmat.forecastversion.unlockConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  try {
    const res = await post(
      UNLOCK_FORECAST_VERSION_API.UNLOCK_FORECAST_VERSION,
      new URLSearchParams({ versionId: String(row.versionId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || t('custmat.forecastversion.unlockSuccess'), 'success')
      fetchForecastVersionList()
    } else {
      showApiError(res, 'custmat.forecastversion.operationFailed')
    }
  } catch {
    showMessage(t('custmat.forecastversion.operationFailed'))
  }
}

const handleLock = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('custmat.forecastversion.lockConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  try {
    const res = await post(
      LOCK_FORECAST_VERSION_API.LOCK_FORECAST_VERSION,
      new URLSearchParams({ versionId: String(row.versionId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || t('custmat.forecastversion.lockSuccess'), 'success')
      fetchForecastVersionList()
    } else {
      showApiError(res, 'custmat.forecastversion.operationFailed')
    }
  } catch {
    showMessage(t('custmat.forecastversion.operationFailed'))
  }
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const api = isEdit.value
      ? UPDATE_FORECAST_VERSION_API.UPDATE_FORECAST_VERSION
      : INSERT_FORECAST_VERSION_API.INSERT_FORECAST_VERSION
    const payload = isEdit.value
      ? {
          versionId: editForm.versionId,
          versionCode: editForm.versionCode,
          startDate: editForm.startDate,
          endDate: editForm.endDate
        }
      : {
          versionCode: editForm.versionCode,
          startDate: editForm.startDate,
          endDate: editForm.endDate
        }
    const res = await post(api, payload)

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || (isEdit.value ? t('custmat.forecastversion.editForecastVersionSuccess') : t('custmat.forecastversion.addForecastVersionSuccess')), 'success')
      dialogVisible.value = false
      handleSearch()
    } else {
      showApiError(res, 'custmat.forecastversion.operationFailed')
    }
  } catch {
    showMessage(t('custmat.forecastversion.operationFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetEditForm()
  dialogLoading.value = false
  editFormRef.value?.clearValidate()
}

onMounted(() => {
  fetchForecastVersionList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.dialog-form {
  padding: 4px 0 0;
}

.dialog-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.dialog-form :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style>
