<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('custmat.forecastdetailnumbertrend.ariaFilterLabel')">
        <el-form-item :label="$t('custmat.forecastdetailnumbertrend.partNumber')">
          <el-input v-model="filters.partNumber"
                    style="width: 170px"
                    clearable
                    :placeholder="$t('custmat.forecastdetailnumbertrend.pleaseInputPartNumber')" />
        </el-form-item>
        <el-form-item :label="$t('custmat.forecastdetailnumbertrend.salesUser')">
          <el-select v-model="filters.salesUserId"
                     style="width: 170px"
                     :placeholder="$t('custmat.forecastdetailnumbertrend.pleaseSelectSalesUser')"
                     @change="handleSearch">
            <el-option v-for="item in salesUserOptions"
                       :key="item.salesUserId"
                       :label="item.userName"
                       :value="item.salesUserId" />
          </el-select>
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
        <el-table :data="numberTrendList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('custmat.forecastdetailnumbertrend.index')" width="70" align="center" fixed />
          <el-table-column prop="partNumber" :label="$t('custmat.forecastdetailnumbertrend.partNumber')" align="center" min-width="140" />
          <el-table-column prop="partName" :label="$t('custmat.forecastdetailnumbertrend.partName')" align="center" min-width="160" />
          <el-table-column :label="$t('custmat.forecastdetailnumbertrend.operation')" width="120" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" type="primary" @click="handleViewTrend(scope.row)">
                {{ $t('custmat.forecastdetailnumbertrend.viewTrend') }}
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
import {
  GET_SALES_NUMBER_PAGE_API,
  GET_SALES_USER_DROP_API
} from '@/config/api/custmat/forecast-detail/numbertrend'

const { t } = useI18n()
const router = useRouter()

const numberTrendList = ref([])
const loading = ref(false)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

const filters = reactive({
  partNumber: '',
  salesUserId: ''
})

const salesUserOptions = ref([])

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 业务码失败提示：400 视为告警，其余视为错误 */
const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

const buildQueryParams = () => ({
  partNumber: filters.partNumber,
  salesUserId: filters.salesUserId,
  pageIndex: pagination.pageIndex,
  pageSize: pagination.pageSize,
  totalCount: pagination.totalCount
})

/** 业务人员下拉，默认选中第一个 */
const fetchSalesUserOptions = async () => {
  try {
    const res = await post(GET_SALES_USER_DROP_API.GET_SALES_USER_DROP, {})

    if (isHandled(res)) return

    if (res?.code === 200) {
      salesUserOptions.value = Array.isArray(res.data) ? res.data : []
      if (salesUserOptions.value.length) {
        filters.salesUserId = salesUserOptions.value[0].salesUserId
      }
    } else {
      showApiError(res, 'custmat.forecastdetailnumbertrend.getSalesUserFailed')
    }
  } catch {
    showMessage(t('custmat.forecastdetailnumbertrend.getSalesUserFailed'))
  }
}

const fetchNumberTrendList = async () => {
  loading.value = true
  try {
    const res = await post(GET_SALES_NUMBER_PAGE_API.GET_SALES_NUMBER_PAGE, buildQueryParams())

    if (isHandled(res)) {
      numberTrendList.value = []
      return
    }

    if (res?.code === 200) {
      numberTrendList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showApiError(res, 'custmat.forecastdetailnumbertrend.getFailed')
      numberTrendList.value = []
    }
  } catch {
    showMessage(t('custmat.forecastdetailnumbertrend.getFailed'))
    numberTrendList.value = []
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.pageIndex = 1
  fetchNumberTrendList()
}

const handleReset = () => {
  filters.partNumber = ''
  filters.salesUserId = salesUserOptions.value.length ? salesUserOptions.value[0].salesUserId : ''
  handleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchNumberTrendList()
}

const handlePageChange = () => {
  fetchNumberTrendList()
}

/** 以新标签页方式全屏打开料号版本趋势图页面 */
const handleViewTrend = (row) => {
  if (!row?.partNumber) return
  const resolved = router.resolve({
    path: '/custmat/forecast-detail/numbertrendchart',
    query: { partNumber: row.partNumber }
  })
  window.open(resolved.href, '_blank')
}

onMounted(async () => {
  await fetchSalesUserOptions()
  fetchNumberTrendList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
