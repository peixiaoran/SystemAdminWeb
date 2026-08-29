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

    <div class="trend-chart-body" v-loading="loading">
      <div ref="chartRef" class="trend-chart-canvas"></div>
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
const chartRef = ref(null)
let chartInstance = null

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

const renderChart = (rows) => {
  if (!chartInstance) return

  chartInstance.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: [
        t('custmat.numbertrendchart.dayQty'),
        t('custmat.numbertrendchart.weekQty'),
        t('custmat.numbertrendchart.totalQty')
      ]
    },
    grid: { left: 40, right: 20, top: 50, bottom: 30, containLabel: true },
    xAxis: { type: 'category', data: rows.map((row) => row.versionCode) },
    yAxis: { type: 'value' },
    series: [
      {
        name: t('custmat.numbertrendchart.dayQty'),
        type: 'bar',
        stack: 'total',
        data: rows.map((row) => Number(row.dayQty) || 0)
      },
      {
        name: t('custmat.numbertrendchart.weekQty'),
        type: 'bar',
        stack: 'total',
        data: rows.map((row) => Number(row.weekQty) || 0)
      },
      {
        name: t('custmat.numbertrendchart.totalQty'),
        type: 'bar',
        stack: 'total',
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
    renderChart([])
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
      renderChart(Array.isArray(res.data) ? res.data : [])
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
      selectedVersionIds.value = versionOptions.value.slice(0, 3).map((item) => item.versionId)
      await fetchChartData()
    } else {
      showApiError(res, 'custmat.numbertrendchart.getVersionFailed')
    }
  } catch {
    showMessage(t('custmat.numbertrendchart.getVersionFailed'))
  }
}

const handleResize = () => {
  chartInstance?.resize()
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
  chartInstance = echarts.init(chartRef.value)
  window.addEventListener('resize', handleResize)
  fetchVersionOptions()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
  chartInstance = null
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

.trend-chart-body {
  flex: 1;
  min-height: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.trend-chart-canvas {
  width: 100%;
  height: 100%;
}
</style>
