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

    <!-- 第二行：复杂K线图 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>{{ $t('dashboard.charts.kLineChart') }}</h3>
              <div style="display: flex; gap: 10px; align-items: center;">
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
import * as echarts from 'echarts'
import {
  ArrowUp,
  ArrowDown,
  Refresh,
} from '@element-plus/icons-vue'

const { t } = useI18n()

// 图表引用
const kLineChart = ref(null)
let kLineChartInstance = null
let pieChartInstances = []
let resizeHandlers = []

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

// 最近活动数据
const recentActivities = ref([
  {
    time: '2024-01-15 14:30:25',
    user: 'Zhang San',
    action: t('dashboard.activities.login'),
    status: 'success'
  },
  {
    time: '2024-01-15 14:25:18',
    user: 'Li Si',
    action: t('dashboard.activities.updateUser'),
    status: 'success'
  },
  {
    time: '2024-01-15 14:20:12',
    user: 'Wang Wu',
    action: t('dashboard.activities.deleteDept'),
    status: 'warning'
  },
  {
    time: '2024-01-15 14:15:08',
    user: 'Zhao Liu',
    action: t('dashboard.activities.backup'),
    status: 'error'
  },
  {
    time: '2024-01-15 14:10:03',
    user: 'Qian Qi',
    action: t('dashboard.activities.exportReport'),
    status: 'success'
  }
])

// 快捷操作数据
const quickActions = ref([
  {
    key: 'addUser',
    icon: 'Plus',
    title: 'dashboard.actions.addUser',
    description: 'dashboard.actions.addUserDesc',
    color: '#409EFF'
  },
  {
    key: 'systemSettings',
    icon: 'Setting',
    title: 'dashboard.actions.systemSettings',
    description: 'dashboard.actions.systemSettingsDesc',
    color: '#67C23A'
  },
  {
    key: 'generateReport',
    icon: 'Document',
    title: 'dashboard.actions.generateReport',
    description: 'dashboard.actions.generateReportDesc',
    color: '#E6A23C'
  },
  {
    key: 'notifications',
    icon: 'Bell',
    title: 'dashboard.actions.notifications',
    description: 'dashboard.actions.notificationsDesc',
    color: '#F56C6C'
  }
])

// 初始化K线图
const initKLineChart = () => {
  if (!kLineChart.value) {
    return
  }
  
  // 如果已存在图表实例，先销毁
  if (kLineChartInstance) {
    kLineChartInstance.dispose()
    kLineChartInstance = null
  }
  
  // 清理K线图相关的resize处理器
  // 移除第一个处理器（K线图的）
  if (resizeHandlers.length > 0) {
    window.removeEventListener('resize', resizeHandlers[0])
    resizeHandlers.shift()
  }
  
  const chart = echarts.init(kLineChart.value)
  kLineChartInstance = chart
  
  // 生成K线数据（根据周期动态调整）
  const generateKLineData = (period = 'day') => {
    const data = []
    const dates = []
    let basePrice = 12.0 // 起始价格
    let lastDayReturn = 0 // 前一日涨跌幅
    
    // 根据周期确定数据点数量和时间间隔
    let dataPoints, timeUnit, timeStep
    switch (period) {
      case 'day':
        dataPoints = 180 // 半年的日数据
        timeUnit = 'day'
        timeStep = 1
        break
      case 'week':
        dataPoints = 52 // 一年的周数据
        timeUnit = 'week'
        timeStep = 7
        break
      case 'year':
        dataPoints = 10 // 十年的年数据
        timeUnit = 'year'
        timeStep = 365
        break
      default:
        dataPoints = 180
        timeUnit = 'day'
        timeStep = 1
    }
    
    // 生成数据
    for (let i = 0; i < dataPoints; i++) {
      const date = new Date()
      if (timeUnit === 'day') {
        date.setDate(date.getDate() - (dataPoints - 1 - i))
        dates.push(date.toISOString().split('T')[0])
      } else if (timeUnit === 'week') {
        date.setDate(date.getDate() - (dataPoints - 1 - i) * 7)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        dates.push(weekStart.toISOString().split('T')[0])
      } else if (timeUnit === 'year') {
        date.setFullYear(date.getFullYear() - (dataPoints - 1 - i))
        dates.push(date.getFullYear().toString())
      }
      
      // 根据周期调整波动率
      let volatilityMultiplier = 1
      if (timeUnit === 'week') {
        volatilityMultiplier = 1.5 // 周数据波动更大
      } else if (timeUnit === 'year') {
        volatilityMultiplier = 3 // 年数据波动最大
      }
      
      // 生成开盘价（可能跳空）
      const gapRate = (Math.random() - 0.5) * 0.15 * volatilityMultiplier
      let open = basePrice * (1 + gapRate)
      
      let dailyReturn = 0
      let close, high, low
      
      // 根据周期调整涨跌幅概率和幅度
      const extremeProb = timeUnit === 'year' ? 0.2 : timeUnit === 'week' ? 0.15 : 0.1
      const largeProb = timeUnit === 'year' ? 0.15 : timeUnit === 'week' ? 0.12 : 0.08
      const mediumProb = timeUnit === 'year' ? 0.25 : timeUnit === 'week' ? 0.2 : 0.15
      
      // 极端大涨
      if (Math.random() < extremeProb) {
        dailyReturn = (0.15 + Math.random() * 0.1) * volatilityMultiplier
        close = open * (1 + dailyReturn)
        high = close * (1 + Math.random() * 0.03)
        low = open * (1 - Math.random() * 0.05)
      }
      // 大跌
      else if (Math.random() < largeProb) {
        dailyReturn = -(0.1 + Math.random() * 0.1) * volatilityMultiplier
        close = open * (1 + dailyReturn)
        low = close * (1 - Math.random() * 0.03)
        high = open * (1 + Math.random() * 0.05)
      }
      // 中等涨幅
      else if (Math.random() < mediumProb) {
        dailyReturn = (0.05 + Math.random() * 0.1) * volatilityMultiplier
        close = open * (1 + dailyReturn)
        high = Math.max(open, close) * (1 + Math.random() * 0.05)
        low = Math.min(open, close) * (1 - Math.random() * 0.03)
      }
      // 中等跌幅
      else if (Math.random() < mediumProb) {
        dailyReturn = -(0.05 + Math.random() * 0.1) * volatilityMultiplier
        close = open * (1 + dailyReturn)
        low = Math.min(open, close) * (1 - Math.random() * 0.05)
        high = Math.max(open, close) * (1 + Math.random() * 0.03)
      }
      // 反转效应
      else if (lastDayReturn > 0.1 * volatilityMultiplier && Math.random() < 0.6) {
        dailyReturn = -(0.02 + Math.random() * 0.08) * volatilityMultiplier
        close = open * (1 + dailyReturn)
        low = Math.min(open, close) * (1 - Math.random() * 0.03)
        high = Math.max(open, close) * (1 + Math.random() * 0.02)
      }
      else if (lastDayReturn < -0.1 * volatilityMultiplier && Math.random() < 0.4) {
        dailyReturn = (0.02 + Math.random() * 0.06) * volatilityMultiplier
        close = open * (1 + dailyReturn)
        high = Math.max(open, close) * (1 + Math.random() * 0.03)
        low = Math.min(open, close) * (1 - Math.random() * 0.02)
      }
      // 其余情况：随机波动
      else {
        dailyReturn = (Math.random() - 0.5) * 0.16 * volatilityMultiplier
        close = open * (1 + dailyReturn)
        
        const intraVolatility = (Math.random() * 0.08 + 0.02) * volatilityMultiplier
        high = Math.max(open, close) * (1 + Math.random() * intraVolatility)
        low = Math.min(open, close) * (1 - Math.random() * intraVolatility)
      }
      
      // 极端日内波动（根据周期调整概率）
      const shadowProb = timeUnit === 'year' ? 0.1 : timeUnit === 'week' ? 0.08 : 0.05
      if (Math.random() < shadowProb) {
        if (Math.random() > 0.5) {
          // 长上影线：冲高回落
          high = Math.max(open, close) * (1 + (0.1 + Math.random() * 0.15) * volatilityMultiplier)
          close = open * (1 + (Math.random() - 0.3) * 0.1 * volatilityMultiplier)
        } else {
          // 长下影线：探底回升
          low = Math.min(open, close) * (1 - (0.1 + Math.random() * 0.15) * volatilityMultiplier)
          close = open * (1 + (Math.random() - 0.3) * 0.1 * volatilityMultiplier)
        }
      }
      
      // 超级黑天鹅事件（根据周期调整概率和幅度）
      const blackSwanProb = timeUnit === 'year' ? 0.05 : timeUnit === 'week' ? 0.03 : 0.02
      if (Math.random() < blackSwanProb) {
        const superExtreme = (0.3 + Math.random() * 0.2) * volatilityMultiplier
        if (Math.random() > 0.5) {
          // 超级暴涨
          dailyReturn = superExtreme
          close = open * (1 + dailyReturn)
          high = close * (1 + Math.random() * 0.05)
          low = open * (1 - Math.random() * 0.1)
        } else {
          // 超级暴跌
          dailyReturn = -superExtreme
          close = open * (1 + dailyReturn)
          low = close * (1 - Math.random() * 0.05)
          high = open * (1 + Math.random() * 0.1)
        }
      }
      
      // 确保价格合理性
      open = Math.max(0.5, open)
      close = Math.max(0.5, close)
      high = Math.max(open, close, high, 0.5)
      low = Math.min(open, close, low)
      low = Math.max(0.5, low)
      
      // 确保高低价逻辑正确
      if (high < Math.max(open, close)) high = Math.max(open, close)
      if (low > Math.min(open, close)) low = Math.min(open, close)
      
      basePrice = close
      lastDayReturn = dailyReturn
      
      data.push([open.toFixed(2), close.toFixed(2), low.toFixed(2), high.toFixed(2)])
    }
    
    return { dates, data }
  }
  
  const { dates, data } = generateKLineData(kLineChartPeriod.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function (params) {
         const param = params[0]
         const data = param.data
         return `${param.name}<br/>
                 ${t('dashboard.charts.open')}: ${data[0]}<br/>
                 ${t('dashboard.charts.close')}: ${data[1]}<br/>
                 ${t('dashboard.charts.low')}: ${data[2]}<br/>
                 ${t('dashboard.charts.high')}: ${data[3]}`
       }
    },
    legend: {
      data: [t('dashboard.charts.kLine')],
      bottom: '0%',
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      scale: true,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      splitNumber: 20,
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: 0,
        end: 100
      }
    ],
    series: [
      {
        name: t('dashboard.charts.kLine'),
        type: 'candlestick',
        data: data,
        itemStyle: {
          color: '#ef232a',
          color0: '#14b143',
          borderColor: '#ef232a',
          borderColor0: '#14b143'
        },
        markPoint: {
          label: {
            formatter: function (param) {
              return param != null ? Math.round(param.value) + '' : ''
            }
          },
          data: [
            {
              name: t('dashboard.charts.highest'),
              type: 'max',
              valueDim: 'highest'
            },
            {
              name: t('dashboard.charts.lowest'),
              type: 'min',
              valueDim: 'lowest'
            }
          ],
          tooltip: {
            formatter: function (param) {
              return param.name + '<br>' + (param.data.coord || '')
            }
          }
        },
      }
    ]
  }
  
  chart.setOption(option)
  
  // 创建resize处理函数并保存引用
  const resizeHandler = () => {
    if (chart && !chart.isDisposed()) {
      chart.resize()
    }
  }
  window.addEventListener('resize', resizeHandler)
  resizeHandlers.push(resizeHandler)
}

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
    
    // 清理之前的resize处理器（只清理饼图相关的）
    // 注意：这里不清理K线图的resize处理器，因为它在initKLineChart中管理
    
    // 等待所有饼图DOM元素准备好
    const pieChartPromises = pieCharts.value.map((chart, index) => {
      return new Promise((resolve) => {
        const checkElement = () => {
          if (chart.ref) {
            resolve(index)
          } else {
            setTimeout(checkElement, 100)
          }
        }
        checkElement()
      })
    })
    
    await Promise.all(pieChartPromises)
    
    // 部门分布饼图
    if (pieCharts.value[0].ref) {
      const chart1 = echarts.init(pieCharts.value[0].ref)
      pieChartInstances.push(chart1)
      const option1 = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          bottom: '0%',
          left: 'center'
        },
        series: [
          {
            name: t('dashboard.charts.departmentDistribution'),
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '35%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 45, name: t('dashboard.departments.tech'), itemStyle: { color: '#409EFF' } },
              { value: 38, name: t('dashboard.departments.sales'), itemStyle: { color: '#67C23A' } },
              { value: 25, name: t('dashboard.departments.marketing'), itemStyle: { color: '#E6A23C' } },
              { value: 18, name: t('dashboard.departments.hr'), itemStyle: { color: '#F56C6C' } },
              { value: 22, name: t('dashboard.departments.finance'), itemStyle: { color: '#909399' } },
              { value: 31, name: t('dashboard.departments.operations'), itemStyle: { color: '#C0C4CC' } }
            ]
          }
        ]
      }
      chart1.setOption(option1)
      
      // 创建resize处理函数并保存引用
      const resizeHandler1 = () => {
        if (chart1 && !chart1.isDisposed()) {
          chart1.resize()
        }
      }
      window.addEventListener('resize', resizeHandler1)
      resizeHandlers.push(resizeHandler1)
    }

    // 项目状态饼图
    if (pieCharts.value[1].ref) {
      const chart2 = echarts.init(pieCharts.value[1].ref)
      pieChartInstances.push(chart2)
      const option2 = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          bottom: '0%',
          left: 'center'
        },
        series: [
          {
            name: t('dashboard.charts.projectStatus'),
            type: 'pie',
            radius: '65%',
            center: ['50%', '35%'],
            data: [
              { value: 35, name: t('dashboard.status.completed'), itemStyle: { color: '#67C23A' } },
              { value: 28, name: t('dashboard.status.processing'), itemStyle: { color: '#409EFF' } },
              { value: 15, name: t('dashboard.status.pending'), itemStyle: { color: '#E6A23C' } },
              { value: 8, name: t('dashboard.status.failed'), itemStyle: { color: '#F56C6C' } }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      chart2.setOption(option2)
      
      // 创建resize处理函数并保存引用
      const resizeHandler2 = () => {
        if (chart2 && !chart2.isDisposed()) {
          chart2.resize()
        }
      }
      window.addEventListener('resize', resizeHandler2)
      resizeHandlers.push(resizeHandler2)
    }

    // 资源使用饼图
    if (pieCharts.value[2].ref) {
      const chart3 = echarts.init(pieCharts.value[2].ref)
      pieChartInstances.push(chart3)
      const option3 = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}% ({d}%)'
        },
        legend: {
          bottom: '0%',
          left: 'center'
        },
        series: [
          {
            name: t('dashboard.charts.resourceUsage'),
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['50%', '35%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: [
              { value: 68, name: t('dashboard.stats.cpuUsage'), itemStyle: { color: '#409EFF' } },
              { value: 75, name: t('dashboard.stats.memoryUsage'), itemStyle: { color: '#67C23A' } },
              { value: 45, name: t('dashboard.stats.diskUsage'), itemStyle: { color: '#E6A23C' } },
              { value: 32, name: t('dashboard.stats.networkTraffic'), itemStyle: { color: '#F56C6C' } }
            ]
          }
        ]
      }
      chart3.setOption(option3)
      
      // 创建resize处理函数并保存引用
      const resizeHandler3 = () => {
        if (chart3 && !chart3.isDisposed()) {
          chart3.resize()
        }
      }
      window.addEventListener('resize', resizeHandler3)
      resizeHandlers.push(resizeHandler3)
    }
  } catch (error) {
    console.error('饼图初始化失败:', error)
  }
}

// 刷新K线图
const refreshKLineChart = () => {
  initKLineChart()
}

// 周期变化处理
const onPeriodChange = () => {
  initKLineChart()
}

// 等待DOM元素准备好的辅助函数
const waitForElement = (elementRef, maxAttempts = 20, interval = 200) => {
  return new Promise((resolve, reject) => {
    let attempts = 0
    
    const checkElement = () => {
      attempts++
      
      if (elementRef.value) {
        resolve(elementRef.value)
      } else if (attempts >= maxAttempts) {
        reject(new Error(`Element not found after ${maxAttempts} attempts`))
      } else {
        setTimeout(checkElement, interval)
      }
    }
    
    checkElement()
  })
}

// 组件挂载后初始化图表
onMounted(() => {
  nextTick(async () => {
    try {
      // 等待K线图DOM元素准备好
      await waitForElement(kLineChart)
      initKLineChart()
      
      // 初始化饼图
      await initPieCharts()
    } catch (error) {
      console.error('图表初始化失败:', error)
      // 如果等待超时，尝试最后一次初始化
      setTimeout(async () => {
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

// 组件卸载时清理图表实例
onUnmounted(() => {
  // 清理K线图实例
  if (kLineChartInstance && !kLineChartInstance.isDisposed()) {
    kLineChartInstance.dispose()
    kLineChartInstance = null
  }
  
  // 清理饼图实例
  pieChartInstances.forEach(chart => {
    if (chart && !chart.isDisposed()) {
      chart.dispose()
    }
  })
  pieChartInstances = []
  
  // 移除所有窗口resize事件监听器
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
  height: 300px;
  width: 100%;
}

.pie-chart-container {
  height: 280px;
  width: 100%;
}

.pie-charts-section {
  margin-top: 20px;
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

.table-section {
  margin-bottom: 0px;
}

.table-card {
  border-radius: 12px;
  border: none;
}

.quick-actions-card {
  border-radius: 12px;
  border: none;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-item:hover {
  background-color: #e9ecef;
  transform: translateX(5px);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  color: white;
}

.action-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.action-info p {
  margin: 0;
  font-size: 12px;
  color: #909399;
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