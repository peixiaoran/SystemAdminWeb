<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('custmat.forecastdetailweekly.ariaFilterLabel')">
        <el-form-item :label="$t('custmat.forecastdetailweekly.versionCode')">
          <el-input v-model="filters.versionCode"
                    style="width: 170px"
                    clearable
                    :placeholder="$t('custmat.forecastdetailweekly.pleaseInputVersionCode')" />
        </el-form-item>
        <el-form-item class="form-button-group">
          <el-button type="primary" @click="handleSearch" plain>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="foWeeklyDetailList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('custmat.forecastdetailweekly.index')" width="70" align="center" fixed />
          <el-table-column prop="versionCode" :label="$t('custmat.forecastdetailweekly.versionCode')" align="center" min-width="140" />
          <el-table-column prop="startDate" :label="$t('custmat.forecastdetailweekly.startDate')" align="center" min-width="120">
            <template #default="scope">{{ formatYmd(parseApiDate(scope.row.startDate)) }}</template>
          </el-table-column>
          <el-table-column prop="endDate" :label="$t('custmat.forecastdetailweekly.endDate')" align="center" min-width="120">
            <template #default="scope">{{ formatYmd(parseApiDate(scope.row.endDate)) }}</template>
          </el-table-column>
          <el-table-column :label="$t('custmat.forecastdetailweekly.yearMonth')" align="center" min-width="100">
            <template #default="scope">{{ formatYearMonth(scope.row.year, scope.row.month) }}</template>
          </el-table-column>
          <el-table-column prop="week" :label="$t('custmat.forecastdetailweekly.week')" align="center" min-width="90" />
          <el-table-column prop="statusName" :label="$t('custmat.forecastdetailweekly.statusName')" align="center" min-width="100" />
          <el-table-column :label="$t('custmat.forecastdetailweekly.operation')" width="100" fixed="right" align="center">
            <template #default="scope">
              <el-button v-if="!isPreparation(scope.row)" size="small" @click="handleView(scope.row)">
                {{ $t('common.view') }}
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { post, isHandled } from '@/utils/request'
import { GET_FORE_WEEKLY_DETAIL_PAGE_API } from '@/config/api/custmat/forecast-detail/foweeklydetail'

/** 预测版本状态码：编制中 */
const FORECAST_VERSION_STATUS = {
  PREPARATION: 'Preparation'
}

const { t } = useI18n()
const router = useRouter()

const foWeeklyDetailList = ref([])
const loading = ref(false)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

const filters = reactive({
  versionCode: ''
})

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 业务码失败提示：400 视为告警，其余视为错误 */
const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

/** 状态为编制中（Preparation）时不展示查看操作 */
const isPreparation = (row) => row.status === FORECAST_VERSION_STATUS.PREPARATION

/** isLatest 为 1（或字符串 "1"）时展示最新标识 */
const isLatestVersion = (val) => Number(val) === 1

const pad2 = (n) => String(n).padStart(2, '0')

const formatYmd = (d) => {
  if (!d || isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/** 合并年、月为“年-月”展示 */
const formatYearMonth = (year, month) => {
  if (year === null || year === undefined || year === '') return ''
  return `${year}-${pad2(month)}`
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

const buildQueryParams = () => ({
  versionCode: filters.versionCode,
  pageIndex: pagination.pageIndex,
  pageSize: pagination.pageSize,
  totalCount: pagination.totalCount
})

const fetchForeWeeklyDetailList = async () => {
  loading.value = true
  try {
    const res = await post(GET_FORE_WEEKLY_DETAIL_PAGE_API.GET_FORE_WEEKLY_DETAIL_PAGE, buildQueryParams())

    if (isHandled(res)) {
      foWeeklyDetailList.value = []
      return
    }

    if (res?.code === 200) {
      foWeeklyDetailList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showApiError(res, 'custmat.forecastdetailweekly.getFailed')
      foWeeklyDetailList.value = []
    }
  } catch {
    showMessage(t('custmat.forecastdetailweekly.getFailed'))
    foWeeklyDetailList.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.pageIndex = 1
  fetchForeWeeklyDetailList()
}

const handleReset = () => {
  Object.assign(filters, {
    versionCode: ''
  })
  handleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchForeWeeklyDetailList()
}

const handlePageChange = () => {
  fetchForeWeeklyDetailList()
}

/** 以新标签页方式全屏打开预测周明细查看页面，不加 noopener 以便必要时通过 window.opener 通知本页面；非最新版本携带 isLatest 标记，供查看页选择归档明细接口 */
const handleView = (row) => {
  if (!row?.versionId) return
  const resolved = router.resolve({
    path: '/custmat/forecast-detail/foweeklydetailview',
    query: { versionId: String(row.versionId), isLatest: isLatestVersion(row.isLatest) ? '1' : '0' }
  })
  window.open(resolved.href, '_blank')
}

onMounted(() => {
  fetchForeWeeklyDetailList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
