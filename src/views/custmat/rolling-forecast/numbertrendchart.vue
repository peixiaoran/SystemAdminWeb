<template>
  <div class="trend-chart-page">
    <div class="trend-chart-header">
      <div class="trend-chart-header-info">
        <h2 class="trend-chart-title">{{ $t('custmat.numbertrendchart.pageTitle') }}</h2>
        <span v-if="partNumber" class="trend-chart-meta">
          {{ $t('custmat.numbertrend.partNumber') }}：{{ partNumber }}
        </span>
      </div>
      <div class="trend-chart-header-actions">
        <el-select v-model="selectedVersionIds"
                   multiple
                   collapse-tags
                   collapse-tags-tooltip
                   :placeholder="$t('custmat.numbertrendchart.pleaseSelectVersion')"
                   style="width: 320px"
                   @change="fetchChartData">
          <el-option v-for="item in versionOptions"
                     :key="item.versionId"
                     :label="item.versionCode"
                     :value="item.versionId" />
        </el-select>
        <el-button @click="closeCurrentPage">{{ $t('custmat.numbertrendchart.close') }}</el-button>
      </div>
    </div>

    <div class="trend-chart-content" v-loading="loading">
      <!-- 料号基础资料 -->
      <el-card class="trend-chart-part-info" shadow="never">
        <template #header>
          <span class="trend-chart-section-title">{{ $t('custmat.numbertrendchart.partInfoTitle') }}</span>
        </template>
        <el-descriptions v-if="partInfo" :column="4" border size="small">
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailPartNumber')">{{ partInfo.partNumber }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailPartName')">{{ partInfo.partName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailSpecification')">{{ partInfo.specification }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailPartType')">{{ partInfo.partTypeName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailCategory')">{{ partInfo.categoryName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailModel')">{{ partInfo.model }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailDrawingNumber')">{{ partInfo.drawingNumber }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailVersion')">{{ partInfo.version }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailUnit')">{{ partInfo.unit }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailSourceType')">{{ partInfo.sourceTypeName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailManufacturer')">{{ partInfo.manufacturer }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailManufacturerPartNumber')">{{ partInfo.manufacturerPartNumber }}</el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailLotControl')">
            {{ partInfo.lotControl ? $t('custmat.numbertrendchart.lotControlYes') : $t('custmat.numbertrendchart.lotControlNo') }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailStatus')">
            {{ partInfo.status ? $t('custmat.numbertrendchart.statusEnabled') : $t('custmat.numbertrendchart.statusDisabled') }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('custmat.numbertrendchart.detailRemark')" :span="3">{{ partInfo.remark }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 柱状图：天/周/合计用量 -->
      <div class="trend-chart-section">
        <div class="trend-chart-section-title">{{ $t('custmat.numbertrendchart.barChartTitle') }}</div>
        <div ref="barChartRef" class="trend-chart-canvas"></div>
      </div>

      <!-- 折线（面积）图：合计用量走势 -->
      <div class="trend-chart-section">
        <div class="trend-chart-section-title">{{ $t('custmat.numbertrendchart.areaChartTitle') }}</div>
        <div ref="areaChartRef" class="trend-chart-canvas"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { post, isHandled } from '@/utils/request'
import echarts from '@/utils/echarts'
import {
  GET_FORECAST_VERSION_DROP_API,
  GET_NUMBER_TREND_API
} from '@/config/api/custmat/rolling-forecast/numbertrend'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const partNumber = route.query.partNumber ? String(route.query.partNumber) : ''

const loading = ref(false)
const versionOptions = ref([])
const selectedVersionIds = ref([])
const partInfo = ref(null)

const barChartRef = ref(null)
const areaChartRef = ref(null)
let barChartInstance = null
let areaChartInstance = null

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

const renderBarChart = (rows) => {
  if (!barChartInstance) return

  barChartInstance.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      bottom: 0,
      data: [
        t('custmat.numbertrendchart.dayQty'),
        t('custmat.numbertrendchart.weekQty'),
        t('custmat.numbertrendchart.totalQty')
      ]
    },
    grid: { left: 40, right: 20, top: 30, bottom: 40, containLabel: true },
    xAxis: { type: 'category', data: rows.map((row) => row.versionCode) },
    yAxis: { type: 'value' },
    series: [
      {
        name: t('custmat.numbertrendchart.dayQty'),
        type: 'bar',
        data: rows.map((row) => Number(row.dayQty) || 0)
      },
      {
        name: t('custmat.numbertrendchart.weekQty'),
        type: 'bar',
        data: rows.map((row) => Number(row.weekQty) || 0)
      },
      {
        name: t('custmat.numbertrendchart.totalQty'),
        type: 'bar',
        data: rows.map((row) => Number(row.totalQty) || 0)
      }
    ]
  }, true)
}

const renderAreaChart = (rows) => {
  if (!areaChartInstance) return

  areaChartInstance.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 30, bottom: 30, containLabel: true },
    xAxis: { type: 'category', data: rows.map((row) => row.versionCode), boundaryGap: false },
    yAxis: { type: 'value' },
    series: [
      {
        name: t('custmat.numbertrendchart.totalQty'),
        type: 'line',
        areaStyle: {},
        smooth: true,
        data: rows.map((row) => Number(row.totalQty) || 0)
      }
    ]
  }, true)
}

const fetchChartData = async () => {
  if (!partNumber) {
    showMessage(t('custmat.numbertrendchart.missingPartNumber'), 'warning')
    return
  }
  if (!selectedVersionIds.value.length) {
    renderBarChart([])
    renderAreaChart([])
    return
  }

  loading.value = true
  try {
    const res = await post(GET_NUMBER_TREND_API.GET_NUMBER_TREND, {
      partNumber,
      versionIds: selectedVersionIds.value.map(String)
    })

    if (isHandled(res)) return

    if (res?.code === 200) {
      partInfo.value = res.data?.partInfo || null
      const rows = Array.isArray(res.data?.versions) ? res.data.versions : []
      renderBarChart(rows)
      renderAreaChart(rows)
      await nextTick()
      handleResize()
    } else {
      showApiError(res, 'custmat.numbertrendchart.getFailed')
    }
  } catch {
    showMessage(t('custmat.numbertrendchart.getFailed'))
  } finally {
    loading.value = false
  }
}

const fetchVersionOptions = async () => {
  try {
    const res = await post(GET_FORECAST_VERSION_DROP_API.GET_FORECAST_VERSION_DROP, {})

    if (isHandled(res)) return

    if (res?.code === 200) {
      versionOptions.value = Array.isArray(res.data) ? res.data : []
      selectedVersionIds.value = versionOptions.value.slice(0, 5).map((item) => item.versionId)
      await fetchChartData()
    } else {
      showApiError(res, 'custmat.numbertrendchart.getVersionFailed')
    }
  } catch {
    showMessage(t('custmat.numbertrendchart.getVersionFailed'))
  }
}

const handleResize = () => {
  barChartInstance?.resize()
  areaChartInstance?.resize()
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
  router.push('/custmat/rolling-forecast/numbertrend')
}

onMounted(async () => {
  await nextTick()
  barChartInstance = echarts.init(barChartRef.value)
  areaChartInstance = echarts.init(areaChartRef.value)
  window.addEventListener('resize', handleResize)
  fetchVersionOptions()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  barChartInstance?.dispose()
  areaChartInstance?.dispose()
  barChartInstance = null
  areaChartInstance = null
})
</script>

<style scoped>
.trend-chart-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 16px;
  overflow: hidden;
}

.trend-chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 12px;
}

.trend-chart-header-info {
  display: flex;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
}

.trend-chart-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.trend-chart-meta {
  color: #606266;
  font-size: 14px;
}

.trend-chart-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.trend-chart-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trend-chart-part-info {
  flex-shrink: 0;
}

.trend-chart-part-info :deep(.el-card__header) {
  padding: 10px 16px;
}

.trend-chart-part-info :deep(.el-card__body) {
  padding: 12px 16px;
}

.trend-chart-section {
  flex: 1;
  min-height: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.trend-chart-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex-shrink: 0;
  margin-bottom: 8px;
}

.trend-chart-canvas {
  flex: 1;
  min-height: 0;
  width: 100%;
}
</style>
