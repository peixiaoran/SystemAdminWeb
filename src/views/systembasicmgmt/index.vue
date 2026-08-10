<template>
  <div class="conventional-table-container">
    <!-- 第一行：四个统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :xs="12" :sm="6" v-for="(card, index) in statsCards" :key="index">
        <el-card class="stat-card" shadow="hover" :style="{ background: `linear-gradient(135deg, ${card.color}35, ${card.color}25)`, borderRadius: '12px' }">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: card.color }">
              <component :is="card.icon" :size="24" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-label">{{ $t(card.label) }}</div>
              <div class="stat-trend" :class="card.trend > 0 ? 'positive' : 'negative'">
                <el-icon><ArrowUp v-if="card.trend > 0" /><ArrowDown v-else /></el-icon>
                <span>{{ Math.abs(card.trend) }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行：渐变堆叠面积图 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>{{ $t('dashboard.charts.areaChart') }}</h3>
              <div class="card-header-actions">
                <el-select v-model="kLineChartPeriod" size="small" style="width: 120px" @change="onPeriodChange">
                  <el-option :label="$t('dashboard.period.day')" value="day" />
                  <el-option :label="$t('dashboard.period.week')" value="week" />
                  <el-option :label="$t('dashboard.period.year')" value="year" />
                </el-select>
                <el-button size="small" @click="refreshKLineChart">
                  <el-icon><Refresh /></el-icon>
                  {{ $t('common.refresh') }}
                </el-button>
              </div>
            </div>
          </template>
          <div :ref="el => kLineChart = el" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第三行：三个饼图 -->
    <el-row :gutter="20" class="charts-section pie-charts-row" align="top">
      <el-col :xs="24" :sm="8" v-for="(pieChart, index) in pieCharts" :key="index">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>{{ $t(pieChart.title) }}</h3>
            </div>
          </template>
          <div :ref="el => pieChart.ref = el" class="pie-chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import echarts from '@/utils/echarts'
import { ArrowUp, ArrowDown, Refresh } from '@element-plus/icons-vue'

const { t } = useI18n()

// 图表引用
const kLineChart = ref(null)
let kLineChartInstance = null
let pieChartInstances = []
let resizeHandlers = []
let retryTimer = null

// 响应式数据
const kLineChartPeriod = ref('day')

// 饼图配置
const pieCharts = ref([
  {
    title: 'dashboard.charts.departmentDistribution',
    ref: null
  },
  {
    title: 'dashboard.charts.projectStatus',
    ref: null
  },
  {
    title: 'dashboard.charts.resourceUsage',
    ref: null
  }
])

// 统计卡片数据
const statsCards = ref([
  {
    icon: 'UserFilled',
    value: '2,847',
    label: 'dashboard.stats.totalUsers',
    trend: 12.5,
    color: '#409EFF'
  },
  {
    icon: 'OfficeBuilding',
    value: '156',
    label: 'dashboard.stats.departments',
    trend: 8.2,
    color: '#67C23A'
  },
  {
    icon: 'DataAnalysis',
    value: '98.5%',
    label: 'dashboard.stats.systemHealth',
    trend: 2.1,
    color: '#E6A23C'
  },
  {
    icon: 'Monitor',
    value: '1,234',
    label: 'dashboard.stats.activeConnections',
    trend: -3.2,
    color: '#F56C6C'
  }
])

/** 轮询等待条件成立；超过最大次数后抛错，避免无限轮询 */
const waitFor = (predicate, maxAttempts = 20, interval = 200) => {
  return new Promise((resolve, reject) => {
    let attempts = 0
    const check = () => {
      attempts++
      if (predicate()) {
        resolve()
      } else if (attempts >= maxAttempts) {
        reject(new Error(`Element not found after ${maxAttempts} attempts`))
      } else {
        setTimeout(check, interval)
      }
    }
    check()
  })
}

const initKLineChart = () => {
  if (!kLineChart.value) return

  if (kLineChartInstance) {
    kLineChartInstance.dispose()
    kLineChartInstance = null
  }

  if (resizeHandlers.length > 0) {
    window.removeEventListener('resize', resizeHandlers[0])
    resizeHandlers.shift()
  }

  const chart = echarts.init(kLineChart.value)
  kLineChartInstance = chart

  const period = kLineChartPeriod.value
  const now = new Date()
  const dates = []

  let count
  if (period === 'day') {
    count = 30
    for (let i = 0; i < count; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - (count - 1 - i))
      dates.push(`${d.getMonth() + 1}/${d.getDate()}`)
    }
  } else if (period === 'week') {
    count = 12
    for (let i = 0; i < count; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - (count - 1 - i) * 7)
      dates.push(`${d.getFullYear()}-W${String(Math.ceil(d.getDate() / 7)).padStart(2, '0')}`)
    }
  } else {
    count = 12
    for (let i = 0; i < count; i++) {
      const d = new Date(now)
      d.setMonth(d.getMonth() - (count - 1 - i))
      dates.push(`${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}`)
    }
  }

  const genData = (base, range, trend, n) => {
    const arr = []
    let v = base
    for (let i = 0; i < n; i++) {
      v += (Math.random() - 0.48) * range + trend
      v = Math.max(base * 0.2, v)
      arr.push(Math.round(v))
    }
    return arr
  }

  const seriesConfig = [
    {
      name: t('dashboard.charts.userActivity'),
      data: genData(380, 90, 4, count),
      lineColor: '#80FFA5',
      gradTop: 'rgba(128, 255, 165, 0.8)',
      gradBottom: 'rgba(1, 191, 236, 0.05)'
    },
    {
      name: t('dashboard.charts.apiRequests'),
      data: genData(620, 140, 7, count),
      lineColor: '#00DDFF',
      gradTop: 'rgba(0, 221, 255, 0.8)',
      gradBottom: 'rgba(77, 119, 255, 0.05)'
    },
    {
      name: t('dashboard.charts.formSubmits'),
      data: genData(250, 70, 3, count),
      lineColor: '#FFBF00',
      gradTop: 'rgba(255, 191, 0, 0.8)',
      gradBottom: 'rgba(255, 80, 80, 0.05)'
    },
    {
      name: t('dashboard.charts.systemEvents'),
      data: genData(140, 45, 2, count),
      lineColor: '#FF0087',
      gradTop: 'rgba(255, 0, 135, 0.8)',
      gradBottom: 'rgba(51, 126, 255, 0.05)'
    }
  ]

  const option = {
    backgroundColor: 'transparent',
    color: seriesConfig.map(s => s.lineColor),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: { backgroundColor: '#6a7985' }
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#E4E7ED',
      borderWidth: 1,
      textStyle: { color: '#303133', fontSize: 13 }
    },
    legend: {
      data: seriesConfig.map(s => s.name),
      bottom: '0%',
      icon: 'roundRect',
      itemWidth: 16,
      itemHeight: 6,
      textStyle: { color: '#606266', fontSize: 12 }
    },
    grid: {
      left: '2%',
      right: '3%',
      bottom: '12%',
      top: '6%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#DCDFE6' } },
      axisTick: { show: false },
      axisLabel: { color: '#909399', fontSize: 11 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#909399', fontSize: 11 },
      splitLine: { lineStyle: { color: '#F2F6FC', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: seriesConfig.map(s => ({
      name: s.name,
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: { width: 2, color: s.lineColor },
      showSymbol: false,
      emphasis: { focus: 'series' },
      areaStyle: {
        opacity: 1,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: s.gradTop },
          { offset: 1, color: s.gradBottom }
        ])
      },
      data: s.data
    }))
  }

  chart.setOption(option)

  const resizeHandler = () => {
    if (chart && !chart.isDisposed()) chart.resize()
  }
  window.addEventListener('resize', resizeHandler)
  resizeHandlers.push(resizeHandler)
}

/** 三个饼图的 series 配置；tooltip / legend 部分统一由 buildPieOption 补齐 */
const buildPieSeries = () => [
  // 部门分布：环形图
  {
    name: t('dashboard.charts.departmentDistribution'),
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['50%', '35%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
    label: { show: false, position: 'center' },
    emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
    labelLine: { show: false },
    data: [
      { value: 45, name: t('dashboard.departments.tech'), itemStyle: { color: '#409EFF' } },
      { value: 38, name: t('dashboard.departments.sales'), itemStyle: { color: '#67C23A' } },
      { value: 25, name: t('dashboard.departments.marketing'), itemStyle: { color: '#E6A23C' } },
      { value: 18, name: t('dashboard.departments.hr'), itemStyle: { color: '#F56C6C' } },
      { value: 22, name: t('dashboard.departments.finance'), itemStyle: { color: '#909399' } },
      { value: 31, name: t('dashboard.departments.operations'), itemStyle: { color: '#C0C4CC' } }
    ]
  },
  // 项目状态：实心饼图
  {
    name: t('dashboard.charts.projectStatus'),
    type: 'pie',
    radius: '65%',
    center: ['50%', '35%'],
    emphasis: {
      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
    },
    data: [
      { value: 35, name: t('dashboard.status.completed'), itemStyle: { color: '#67C23A' } },
      { value: 28, name: t('dashboard.status.processing'), itemStyle: { color: '#409EFF' } },
      { value: 15, name: t('dashboard.status.pending'), itemStyle: { color: '#E6A23C' } },
      { value: 8, name: t('dashboard.status.failed'), itemStyle: { color: '#F56C6C' } }
    ]
  },
  // 资源使用：南丁格尔玫瑰图，tooltip 的数值本身就是百分比
  {
    name: t('dashboard.charts.resourceUsage'),
    type: 'pie',
    radius: ['30%', '70%'],
    center: ['50%', '35%'],
    roseType: 'area',
    itemStyle: { borderRadius: 8 },
    tooltipFormatter: '{a} <br/>{b}: {c}% ({d}%)',
    data: [
      { value: 68, name: t('dashboard.stats.cpuUsage'), itemStyle: { color: '#409EFF' } },
      { value: 75, name: t('dashboard.stats.memoryUsage'), itemStyle: { color: '#67C23A' } },
      { value: 45, name: t('dashboard.stats.diskUsage'), itemStyle: { color: '#E6A23C' } },
      { value: 32, name: t('dashboard.stats.networkTraffic'), itemStyle: { color: '#F56C6C' } }
    ]
  }
]

const buildPieOption = ({ tooltipFormatter, ...series }) => ({
  tooltip: {
    trigger: 'item',
    formatter: tooltipFormatter || '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    bottom: '0%',
    left: 'center'
  },
  series: [series]
})

// 初始化饼图
const initPieCharts = async () => {
  try {
    // 清理之前的饼图实例
    pieChartInstances.forEach(chart => {
      if (chart && !chart.isDisposed()) {
        chart.dispose()
      }
    })
    pieChartInstances = []

    // 注意：这里不清理面积图的 resize 处理器，它由 initKLineChart 自行管理

    // 等待所有饼图 DOM 元素挂载完成
    await Promise.all(
      pieCharts.value.map((chart) => waitFor(() => !!chart.ref))
    )

    buildPieSeries().forEach((seriesConfig, i) => {
      const el = pieCharts.value[i]?.ref
      if (!el) return

      const chart = echarts.init(el)
      pieChartInstances.push(chart)
      chart.setOption(buildPieOption(seriesConfig))

      const resizeHandler = () => {
        if (!chart.isDisposed()) chart.resize()
      }
      window.addEventListener('resize', resizeHandler)
      resizeHandlers.push(resizeHandler)
    })
  } catch (error) {
    console.error('饼图初始化失败:', error)
  }
}

const refreshKLineChart = () => initKLineChart()

// 周期变化处理
const onPeriodChange = () => initKLineChart()

// 组件挂载后初始化图表
onMounted(() => {
  nextTick(async () => {
    try {
      await waitFor(() => !!kLineChart.value)
      initKLineChart()
      await initPieCharts()
    } catch (error) {
      console.error('图表初始化失败:', error)
      // 等待超时，延迟后再尝试最后一次初始化
      retryTimer = setTimeout(async () => {
        try {
          if (kLineChart.value) {
            initKLineChart()
          }
          await initPieCharts()
        } catch (retryError) {
          console.error('图表重试初始化也失败:', retryError)
        }
      }, 2000)
    }
  })
})

// 组件卸载时清理图表实例与事件监听
onUnmounted(() => {
  if (retryTimer) {
    clearTimeout(retryTimer)
    retryTimer = null
  }

  if (kLineChartInstance && !kLineChartInstance.isDisposed()) {
    kLineChartInstance.dispose()
    kLineChartInstance = null
  }

  pieChartInstances.forEach(chart => {
    if (chart && !chart.isDisposed()) {
      chart.dispose()
    }
  })
  pieChartInstances = []

  resizeHandlers.forEach(handler => {
    window.removeEventListener('resize', handler)
  })
  resizeHandlers = []
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.stat-card {
  border-radius: 12px;
  border: none;
  overflow: hidden;
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  color: white;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 5px 0;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin: 0 0 8px 0;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.stat-trend.positive {
  color: #67C23A;
}

.stat-trend.negative {
  color: #F56C6C;
}

.stat-trend span {
  margin-left: 4px;
}

.chart-card {
  border-radius: 12px;
  border: none;
  min-height: 400px;
}

.chart-container {
  height: 360px;
  width: 100%;
}

.pie-chart-container {
  height: 280px;
  width: 100%;
}

.pie-charts-row {
  align-items: flex-start;
}

/* 确保饼状图容器从顶部开始排列 */
.charts-section {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.card-header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stat-content {
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .chart-container {
    height: 250px;
  }
}
</style>