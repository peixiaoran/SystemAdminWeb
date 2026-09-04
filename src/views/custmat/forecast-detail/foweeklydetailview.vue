<template>
  <div class="fo-detail-page">
    <div class="fo-detail-header">
      <div class="fo-detail-header-info">
        <h2 class="fo-detail-title">{{ $t('custmat.forecastdetailweeklydata.viewTitle') }}</h2>
        <span v-if="header.versionCode" class="fo-detail-meta">
          {{ $t('custmat.forecastdetailweeklydata.versionCode') }}：{{ header.versionCode }}
        </span>
        <span v-if="header.startDate" class="fo-detail-meta">
          {{ $t('custmat.forecastdetailweeklydata.startDate') }}：{{ formatYmd(parseApiDate(header.startDate)) }}
        </span>
      </div>
      <div class="fo-detail-header-actions">
        <el-select v-model="salesUserId"
                   :placeholder="$t('custmat.forecastdetailweeklydata.pleaseSelectSalesUser')"
                   style="width: 200px"
                   @change="fetchFoWeeklyDetail">
          <el-option v-for="item in salesUserOptions"
                     :key="item.salesUserId"
                     :label="item.userName"
                     :value="item.salesUserId" />
        </el-select>
        <el-button type="success" :loading="exportDataLoading" @click="handleExportData">
          {{ $t('custmat.forecastdetailweeklydata.exportData') }}
        </el-button>
        <el-button @click="closeCurrentPage">{{ $t('custmat.forecastdetailweeklydata.close') }}</el-button>
      </div>
    </div>

    <div class="fo-detail-table-container">
      <el-table :data="rows"
                border
                stripe
                :header-cell-style="{ background: '#f5f7fa' }"
                v-loading="loading"
                class="fo-detail-table"
                height="100%"
                :empty-text="$t('common.noData')">
        <el-table-column type="index" :label="$t('custmat.forecastdetailweekly.index')" width="70" align="center" fixed />
        <el-table-column prop="partNumber" :label="$t('custmat.forecastdetailweeklydata.partNumber')" min-width="130" align="center" fixed />
        <el-table-column prop="partName" :label="$t('custmat.forecastdetailweeklydata.partName')" min-width="280" align="left" fixed show-overflow-tooltip />
        <el-table-column :label="$t('custmat.forecastdetailweeklydata.dayTotal')" min-width="110" align="center" fixed>
          <template #default="scope">{{ formatQuantity(sumQuantities(scope.row, 'D')) }}</template>
        </el-table-column>
        <el-table-column :label="$t('custmat.forecastdetailweeklydata.weekTotal')" min-width="110" align="center" fixed>
          <template #default="scope">{{ formatQuantity(sumQuantities(scope.row, 'W')) }}</template>
        </el-table-column>
        <el-table-column :label="$t('custmat.forecastdetailweeklydata.dayQtyChangeRate')" min-width="130" align="center" fixed>
          <template #default="scope">
            <el-tag :type="changeRateTagType(scope.row.dayQtyChangeRate)" effect="dark" size="small" round>
              {{ formatChangeRate(scope.row.dayQtyChangeRate) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('custmat.forecastdetailweeklydata.weekQtyChangeRate')" min-width="130" align="center" fixed>
          <template #default="scope">
            <el-tag :type="changeRateTagType(scope.row.weekQtyChangeRate)" effect="dark" size="small" round>
              {{ formatChangeRate(scope.row.weekQtyChangeRate) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-for="col in periodColumns"
                          :key="col.periodKey"
                          :prop="col.periodKey"
                          width="160"
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { post, postBlob, isHandled } from '@/utils/request'
import {
  GET_FO_WEEKLY_DETAIL_API,
  GET_FO_WEEKLY_ARCHIVE_DETAIL_API,
  EXPORT_FO_WEEKLY_DETAIL_API,
  GET_SALES_USER_DROP_API
} from '@/config/api/custmat/forecast-detail/foweeklydetail'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const FORM_URLENCODED = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

const loading = ref(false)
const exportDataLoading = ref(false)
const rows = ref([])
const periodColumns = ref([])

const salesUserOptions = ref([])
const salesUserId = ref('')

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
/** 非最新版本（isLatest=0）查看时改用归档明细接口 */
const isLatest = computed(() => route.query.isLatest !== '0')

/** 业务人员下拉，默认选中第一个 */
const fetchSalesUserOptions = async () => {
  try {
    const res = await post(GET_SALES_USER_DROP_API.GET_SALES_USER_DROP, {})

    if (isHandled(res)) return

    if (res?.code === 200) {
      salesUserOptions.value = Array.isArray(res.data) ? res.data : []
      if (salesUserOptions.value.length) {
        salesUserId.value = salesUserOptions.value[0].salesUserId
      }
    } else {
      showApiError(res, 'custmat.forecastdetailweeklydata.getSalesUserFailed')
    }
  } catch {
    showMessage(t('custmat.forecastdetailweeklydata.getSalesUserFailed'))
  }
}

const fetchFoWeeklyDetail = async () => {
  if (!versionId.value) {
    showMessage(t('custmat.forecastdetailweeklydata.missingVersionId'), 'warning')
    return
  }

  loading.value = true
  try {
    const api = isLatest.value
      ? GET_FO_WEEKLY_DETAIL_API.GET_FO_WEEKLY_DETAIL
      : GET_FO_WEEKLY_ARCHIVE_DETAIL_API.GET_FO_WEEKLY_ARCHIVE_DETAIL
    const res = await post(
      api,
      new URLSearchParams({ versionId: versionId.value, salesUserId: salesUserId.value || '' }),
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
      showApiError(res, 'custmat.forecastdetailweeklydata.getFailed')
    }
  } catch {
    showMessage(t('custmat.forecastdetailweeklydata.getFailed'))
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

const handleExportData = async () => {
  if (!versionId.value) {
    showMessage(t('custmat.forecastdetailweeklydata.missingVersionId'), 'warning')
    return
  }

  exportDataLoading.value = true
  try {
    const res = await postBlob(
      EXPORT_FO_WEEKLY_DETAIL_API.EXPORT_FO_WEEKLY_DETAIL,
      new URLSearchParams({ versionId: versionId.value, salesUserId: salesUserId.value || '' }),
      FORM_URLENCODED
    )
    await assertDownloadableBlob(res?.data, 'custmat.forecastdetailweeklydata.exportDataFailed')
    downloadBlob(res.data, `${t('custmat.forecastdetailweeklydata.exportDataFileName')}.xlsx`)
  } catch (error) {
    showMessage(error?.message || t('custmat.forecastdetailweeklydata.exportDataFailed'))
  } finally {
    exportDataLoading.value = false
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
  router.push('/custmat/forecast-detail/foweeklydetail')
}

onMounted(async () => {
  await fetchSalesUserOptions()
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

</style>
