<template>
  <div class="fo-detail-page" v-loading="loading">
    <div class="fo-detail-header">
      <div class="fo-detail-header-info">
        <h2 class="fo-detail-title">{{ $t('custmat.foweeklydetaildata.arrangeTitle') }}</h2>
        <span v-if="header.versionCode" class="fo-detail-meta">
          {{ $t('custmat.foweeklydetaildata.versionCode') }}：{{ header.versionCode }}
        </span>
        <span v-if="header.startDate" class="fo-detail-meta">
          {{ $t('custmat.foweeklydetaildata.startDate') }}：{{ formatYmd(parseApiDate(header.startDate)) }}
        </span>
      </div>
      <div class="fo-detail-header-actions">
        <el-button type="warning" @click="handleOpenImport">
          {{ $t('custmat.foweeklydetaildata.import') }}
        </el-button>
        <el-button :icon="Download" :loading="exportLoading" @click="handleExportTemplate">
          {{ $t('custmat.foweeklydetaildata.exportTemplate') }}
        </el-button>
        <el-button type="success" :loading="exportDataLoading" @click="handleExportData">
          {{ $t('custmat.foweeklydetaildata.exportData') }}
        </el-button>
        <el-button @click="closeCurrentPage">{{ $t('custmat.foweeklydetaildata.close') }}</el-button>
      </div>
    </div>

    <div class="fo-detail-table-container">
      <el-table :data="rows"
                border
                stripe
                :header-cell-style="{ background: '#f5f7fa' }"
                class="fo-detail-table"
                height="100%"
                :empty-text="$t('common.noData')">
        <el-table-column type="index" :label="$t('custmat.foweeklydetail.index')" width="70" align="center" fixed />
        <el-table-column prop="partNumber" :label="$t('custmat.foweeklydetaildata.partNumber')" min-width="150" align="center" fixed />
        <el-table-column prop="partName" :label="$t('custmat.foweeklydetaildata.partName')" min-width="280" align="left" fixed show-overflow-tooltip />
        <el-table-column :label="$t('custmat.foweeklydetaildata.dayTotal')" min-width="110" align="center" fixed>
          <template #default="scope">{{ formatQuantity(sumQuantities(scope.row, 'D')) }}</template>
        </el-table-column>
        <el-table-column :label="$t('custmat.foweeklydetaildata.weekTotal')" min-width="110" align="center" fixed>
          <template #default="scope">{{ formatQuantity(sumQuantities(scope.row, 'W')) }}</template>
        </el-table-column>
        <el-table-column :label="$t('custmat.foweeklydetaildata.dayQtyChangeRate')" min-width="130" align="center" fixed>
          <template #default="scope">
            <el-tag :type="changeRateTagType(scope.row.dayQtyChangeRate)" effect="dark" size="small" round>
              {{ formatChangeRate(scope.row.dayQtyChangeRate) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('custmat.foweeklydetaildata.weekQtyChangeRate')" min-width="130" align="center" fixed>
          <template #default="scope">
            <el-tag :type="changeRateTagType(scope.row.weekQtyChangeRate)" effect="dark" size="small" round>
              {{ formatChangeRate(scope.row.weekQtyChangeRate) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-for="col in periodColumns"
                          :key="col.periodKey"
                          :prop="col.periodKey"
                          width="150"
                          align="center">
          <template #header>
            <span class="period-col-header">
              <span class="period-col-date">{{ col.dateLabel }}</span>
              <span class="period-col-key" :class="col.periodKey.startsWith('D') ? 'is-day' : 'is-week'">{{ col.periodKey }}</span>
            </span>
          </template>
          <template #default="scope">
            {{ formatQuantity(scope.row.quantities?.[col.periodKey]) }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible"
               :title="$t('custmat.foweeklydetaildata.import')"
               width="520px"
               draggable
               :close-on-click-modal="false"
               :append-to-body="true"
               @close="handleImportDialogClose">
      <div class="import-dialog-body">
        <el-upload drag
                   action="#"
                   accept=".xls,.xlsx"
                   :auto-upload="false"
                   :show-file-list="true"
                   :limit="1"
                   :on-change="handleImportFileChange"
                   :on-exceed="handleImportFileExceed"
                   :on-remove="handleImportFileRemove"
                   :file-list="importFileList">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            {{ $t('custmat.foweeklydetaildata.dragFileHint') }}
          </div>
        </el-upload>

        <el-input v-if="importErrorMessage"
                  class="import-error-textarea"
                  type="textarea"
                  :model-value="importErrorMessage"
                  :rows="4"
                  readonly />
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="importLoading" :disabled="!importFile" @click="handleImportSubmit">
          {{ $t('custmat.foweeklydetaildata.startImport') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UploadFilled, Download } from '@element-plus/icons-vue'
import { post, postBlob, isHandled } from '@/utils/request'
import {
  GET_FO_WEEKLY_DETAIL_API,
  EXPORT_FO_WEEKLY_DETAIL_TEMPLATE_API,
  EXPORT_FO_WEEKLY_DETAIL_API,
  IMPORT_FO_WEEKLY_DETAIL_API
} from '@/config/api/custmat/rolling-forecast/foweeklydetail'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const FORM_URLENCODED = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

const loading = ref(false)
const exportLoading = ref(false)
const exportDataLoading = ref(false)
const rows = ref([])
const periodColumns = ref([])

const importDialogVisible = ref(false)
const importLoading = ref(false)
const importFile = ref(null)
const importFileList = ref([])
const importErrorMessage = ref('')

const header = reactive({
  versionId: '',
  versionCode: '',
  startDate: ''
})

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

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

const formatQuantity = (val) => {
  const n = Number(val)
  return Number.isFinite(n) ? n.toLocaleString('en-US') : '0'
}

/** 环比百分比：增长为正显示红色，减少为负显示绿色 */
const formatChangeRate = (val) => {
  const n = Number(val)
  if (!Number.isFinite(n)) return '-'
  return `${n > 0 ? '+' : ''}${n.toFixed(2)}%`
}

/** 环比标签颜色：增长为红色，减少为绿色，持平为灰色 */
const changeRateTagType = (val) => {
  const n = Number(val)
  if (!Number.isFinite(n) || n === 0) return 'info'
  return n > 0 ? 'danger' : 'success'
}

/** 按前缀（D 天 / W 周）汇总某一行的总量 */
const sumQuantities = (row, prefix) => {
  return periodColumns.value.reduce((sum, col) => {
    if (!col.periodKey.startsWith(prefix)) return sum
    const n = Number(row.quantities?.[col.periodKey])
    return sum + (Number.isFinite(n) ? n : 0)
  }, 0)
}

const buildPeriodColumns = (periods) => {
  if (!Array.isArray(periods)) return []
  return periods.map((p) => ({
    periodKey: p.periodKey,
    dateLabel: formatYmd(parseApiDate(p.startDate))
  }))
}

const versionId = computed(() => String(route.query.versionId || ''))

const fetchFoWeeklyDetail = async () => {
  if (!versionId.value) {
    showMessage(t('custmat.foweeklydetaildata.missingVersionId'), 'warning')
    return
  }

  loading.value = true
  try {
    const res = await post(
      GET_FO_WEEKLY_DETAIL_API.GET_FO_WEEKLY_DETAIL,
      new URLSearchParams({ versionId: versionId.value }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200 && res.data) {
      const data = res.data
      header.versionId = data.versionId || ''
      header.versionCode = data.versionCode || ''
      header.startDate = data.startDate || ''
      periodColumns.value = buildPeriodColumns(data.periods)
      rows.value = Array.isArray(data.rows) ? data.rows : []
    } else {
      showApiError(res, 'custmat.foweeklydetaildata.getFailed')
    }
  } catch {
    showMessage(t('custmat.foweeklydetaildata.getFailed'))
  } finally {
    loading.value = false
  }
}

/** 后端出错时会返回 JSON 而非文件，需要读出里面的错误信息 */
const assertDownloadableBlob = async (blob, fallbackKey) => {
  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error(t(fallbackKey))
  }
  if (blob.type && blob.type.includes('application/json')) {
    const text = await blob.text()
    let message = t(fallbackKey)
    try {
      message = JSON.parse(text)?.message || message
    } catch {
      // 非 JSON 内容时沿用默认文案
    }
    throw new Error(message)
  }
}

const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

const handleExportTemplate = async () => {
  if (!versionId.value) {
    showMessage(t('custmat.foweeklydetaildata.missingVersionId'), 'warning')
    return
  }

  exportLoading.value = true
  try {
    const res = await postBlob(
      EXPORT_FO_WEEKLY_DETAIL_TEMPLATE_API.EXPORT_FO_WEEKLY_DETAIL_TEMPLATE,
      new URLSearchParams({ versionId: versionId.value }),
      FORM_URLENCODED
    )
    await assertDownloadableBlob(res?.data, 'custmat.foweeklydetaildata.exportTemplateFailed')
    downloadBlob(res.data, `${t('custmat.foweeklydetaildata.exportTemplateFileName')}_${header.versionCode}.xlsx`)
  } catch (error) {
    showMessage(error?.message || t('custmat.foweeklydetaildata.exportTemplateFailed'))
  } finally {
    exportLoading.value = false
  }
}

const handleExportData = async () => {
  if (!versionId.value) {
    showMessage(t('custmat.foweeklydetaildata.missingVersionId'), 'warning')
    return
  }

  exportDataLoading.value = true
  try {
    const res = await postBlob(
      EXPORT_FO_WEEKLY_DETAIL_API.EXPORT_FO_WEEKLY_DETAIL,
      new URLSearchParams({ versionId: versionId.value }),
      FORM_URLENCODED
    )
    await assertDownloadableBlob(res?.data, 'custmat.foweeklydetaildata.exportDataFailed')
    downloadBlob(res.data, `${t('custmat.foweeklydetaildata.exportDataFileName')}_${header.versionCode}.xlsx`)
  } catch (error) {
    showMessage(error?.message || t('custmat.foweeklydetaildata.exportDataFailed'))
  } finally {
    exportDataLoading.value = false
  }
}

const handleOpenImport = () => {
  importFile.value = null
  importFileList.value = []
  importErrorMessage.value = ''
  importDialogVisible.value = true
}

const handleImportDialogClose = () => {
  importFile.value = null
  importFileList.value = []
  importErrorMessage.value = ''
}

const handleImportFileChange = (uploadFile) => {
  importFile.value = uploadFile.raw
  importFileList.value = [uploadFile]
  importErrorMessage.value = ''
}

/** 超出单文件限制时替换为最新选择的文件 */
const handleImportFileExceed = (files) => {
  const file = files[0]
  importFile.value = file
  importFileList.value = [{ name: file.name, raw: file }]
  importErrorMessage.value = ''
}

const handleImportFileRemove = () => {
  importFile.value = null
  importFileList.value = []
}

const handleImportSubmit = async () => {
  if (!importFile.value || !versionId.value) return

  importErrorMessage.value = ''
  importLoading.value = true
  try {
    const formData = new FormData()
    formData.append('versionId', versionId.value)
    formData.append('file', importFile.value)

    const res = await post(IMPORT_FO_WEEKLY_DETAIL_API.IMPORT_FO_WEEKLY_DETAIL, formData)

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || t('common.success'), 'success')
      importDialogVisible.value = false
      fetchFoWeeklyDetail()
    } else if (Number(res?.code) === 400) {
      importErrorMessage.value = res?.message || t('custmat.foweeklydetaildata.importFailed')
    } else {
      showApiError(res, 'custmat.foweeklydetaildata.importFailed')
    }
  } catch {
    showMessage(t('custmat.foweeklydetaildata.importFailed'))
  } finally {
    importLoading.value = false
  }
}

const isPopupWindow = () => {
  try {
    return !!(window.opener && !window.opener.closed)
  } catch {
    return !!window.opener
  }
}

const closeCurrentPage = () => {
  if (isPopupWindow()) {
    window.close()
    return
  }
  router.push('/custmat/rolling-forecast/foweeklydetail')
}

onMounted(() => {
  fetchFoWeeklyDetail()
})
</script>

<style scoped>
.fo-detail-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 16px;
  overflow: hidden;
}

.fo-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 12px;
}

.fo-detail-header-info {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.fo-detail-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.fo-detail-meta {
  color: #606266;
  font-size: 14px;
}

.fo-detail-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.fo-detail-table-container {
  flex: 1;
  min-height: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.fo-detail-table {
  width: 100%;
  height: 100%;
}

.fo-detail-table :deep(.el-table__header th .cell) {
  white-space: nowrap;
}

.period-col-header {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.period-col-key {
  font-size: 12px;
  font-weight: 700;
}

.period-col-key.is-day {
  color: #67c23a;
}

.period-col-key.is-week {
  color: #e6a23c;
}


.import-dialog-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.import-error-textarea :deep(.el-textarea__inner) {
  color: #f56c6c;
  white-space: pre-wrap;
}
</style>
