<template>
  <div class="customer-distribution-page">
    <div class="customer-distribution-header">
      <h2 class="customer-distribution-title">{{ $t('custmat.salescustomerdistribution.pageTitle') }}</h2>
      <el-button @click="closeCurrentPage">{{ $t('custmat.salescustomerdistribution.close') }}</el-button>
    </div>

    <div class="customer-distribution-content" v-loading="loading">
      <div ref="pieChartRef" class="customer-distribution-canvas"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { post, isHandled } from '@/utils/request'
import echarts from '@/utils/echarts'
import { GET_SALES_CUSTOMER_DISTRIBUTION_API } from '@/config/api/custmat/sales-mgmt/salesnumber'

const { t } = useI18n()
const router = useRouter()

const loading = ref(false)
const pieChartRef = ref(null)
let pieChartInstance = null

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

const renderPieChart = (rows) => {
  if (!pieChartInstance) return

  pieChartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const row = params.data.raw
        return [
          `${row.customerCode} ${row.customerName}`,
          `${t('custmat.salescustomerdistribution.partNumberCount')}：${row.customerPartNumberCount}`,
          `${t('custmat.salescustomerdistribution.percentage')}：${row.percentage}`
        ].join('<br/>')
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20
    },
    series: [
      {
        name: t('custmat.salescustomerdistribution.pageTitle'),
        type: 'pie',
        radius: '65%',
        center: ['40%', '52%'],
        label: { formatter: '{b}：{d}%' },
        data: rows.map((row) => ({
          name: row.customerName,
          value: Number(row.customerPartNumberCount) || 0,
          raw: row
        }))
      }
    ]
  }, true)
}

const fetchCustomerDistribution = async () => {
  loading.value = true
  try {
    const res = await post(GET_SALES_CUSTOMER_DISTRIBUTION_API.GET_SALES_CUSTOMER_DISTRIBUTION, {})

    if (isHandled(res)) return

    if (res?.code === 200) {
      renderPieChart(Array.isArray(res.data) ? res.data : [])
    } else {
      showApiError(res, 'custmat.salescustomerdistribution.getFailed')
    }
  } catch {
    showMessage(t('custmat.salescustomerdistribution.getFailed'))
  } finally {
    loading.value = false
  }
}

const handleResize = () => {
  pieChartInstance?.resize()
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
  router.push('/custmat/sales-mgmt/salesnumber')
}

onMounted(async () => {
  await nextTick()
  pieChartInstance = echarts.init(pieChartRef.value)
  window.addEventListener('resize', handleResize)
  fetchCustomerDistribution()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  pieChartInstance?.dispose()
  pieChartInstance = null
})
</script>

<style scoped>
.customer-distribution-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 16px;
  overflow: hidden;
}

.customer-distribution-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin-bottom: 12px;
}

.customer-distribution-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.customer-distribution-content {
  flex: 1;
  min-height: 0;
}

.customer-distribution-canvas {
  height: 100%;
  width: 100%;
}
</style>
