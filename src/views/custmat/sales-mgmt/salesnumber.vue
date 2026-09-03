<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('custmat.salesnumber.ariaFilterLabel')">
        <el-form-item :label="$t('custmat.salesnumber.partNumber')">
          <el-input v-model="filters.partNumber"
                    style="width: 170px"
                    clearable
                    :placeholder="$t('custmat.salesnumber.pleaseInputPartNumber')" />
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
          <el-button type="success" @click="handleViewCustomerDistribution">
            {{ $t('custmat.salesnumber.customerDistribution') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="salesNumberList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('custmat.salesnumber.index')" width="70" align="center" fixed />
          <el-table-column prop="partNumber" :label="$t('custmat.salesnumber.partNumber')" align="center" min-width="140" fixed>
            <template #default="scope">
              <el-popover trigger="click"
                          width="360"
                          placement="right"
                          @show="handleShowPartNumberDetail(scope.row.partNumber)"
                          @hide="handleHidePartNumberDetail">
                <template #reference>
                  <el-button link type="primary">{{ scope.row.partNumber }}</el-button>
                </template>
                <div v-loading="partNumberDetailLoading" class="part-number-detail">
                  <template v-if="partNumberDetail && partNumberDetailFor === scope.row.partNumber">
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailPartNumber') }}：{{ partNumberDetail.partNumber }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailPartName') }}：{{ partNumberDetail.partName }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailSpecification') }}：{{ partNumberDetail.specification }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailPartType') }}：{{ partNumberDetail.partTypeName }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailCategory') }}：{{ partNumberDetail.categoryName }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailModel') }}：{{ partNumberDetail.model }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailDrawingNumber') }}：{{ partNumberDetail.drawingNumber }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailVersion') }}：{{ partNumberDetail.version }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailUnit') }}：{{ partNumberDetail.unit }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailSourceType') }}：{{ partNumberDetail.sourceTypeName }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailManufacturer') }}：{{ partNumberDetail.manufacturer }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailManufacturerPartNumber') }}：{{ partNumberDetail.manufacturerPartNumber }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailLotControl') }}：{{ partNumberDetail.lotControl ? $t('custmat.salesnumber.lotControlYes') : $t('custmat.salesnumber.lotControlNo') }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailStatus') }}：{{ partNumberDetail.status ? $t('custmat.salesnumber.statusEnabled') : $t('custmat.salesnumber.statusDisabled') }}</div>
                    <div class="part-number-detail-row">{{ $t('custmat.salesnumber.detailRemark') }}：{{ partNumberDetail.remark }}</div>
                  </template>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="partNameCn" :label="$t('custmat.salesnumber.partNameCn')" align="left" min-width="140" />
          <el-table-column prop="partNameEn" :label="$t('custmat.salesnumber.partNameEn')" align="left" min-width="160" />
          <el-table-column prop="specification" :label="$t('custmat.salesnumber.specification')" align="left" min-width="160" />
          <el-table-column :label="$t('custmat.salesnumber.status')" align="center" min-width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status ? 'success' : 'info'">
                {{ scope.row.status ? $t('custmat.salesnumber.statusEnabled') : $t('custmat.salesnumber.statusDisabled') }}
              </el-tag>
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
import { GET_SALES_NUMBER_PAGE_API, GET_PART_NUMBER_DETAIL_API } from '@/config/api/custmat/sales-mgmt/salesnumber'

const { t } = useI18n()
const router = useRouter()

/** 料号详情接口按 form-urlencoded 提交 */
const FORM_URLENCODED = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

const salesNumberList = ref([])
const loading = ref(false)

// 料号详情提示框
const partNumberDetail = ref(null)
const partNumberDetailLoading = ref(false)
/** 当前已加载详情所属的料号，用于确保弹窗只展示本行的最新数据 */
const partNumberDetailFor = ref('')

const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

const filters = reactive({
  partNumber: ''
})

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 业务码失败提示：400 视为告警，其余视为错误 */
const showApiError = (res, fallbackKey) => {
  showMessage(res?.message || t(fallbackKey), Number(res?.code) === 400 ? 'warning' : 'error')
}

const fetchSalesNumberList = async () => {
  loading.value = true
  try {
    const res = await post(GET_SALES_NUMBER_PAGE_API.GET_SALES_NUMBER_PAGE, {
      partNumber: filters.partNumber,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    })

    if (isHandled(res)) {
      salesNumberList.value = []
      return
    }

    if (res?.code === 200) {
      salesNumberList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showApiError(res, 'custmat.salesnumber.getFailed')
      salesNumberList.value = []
    }
  } catch {
    showMessage(t('custmat.salesnumber.getFailed'))
    salesNumberList.value = []
  } finally {
    loading.value = false
  }
}

/**
 * 关闭时即清空详情归属。
 * popover 的 @show 是在弹窗已可见后才触发的，此时再清空旧数据要等下一个渲染周期才生效，
 * 会先用上一次的数据渲染一帧；改为关闭时清空，下次打开必定是干净的加载态。
 */
const handleHidePartNumberDetail = () => {
  partNumberDetail.value = null
  partNumberDetailFor.value = ''
}

// 料号详情提示框
const handleShowPartNumberDetail = async (partNumber) => {
  partNumberDetail.value = null
  partNumberDetailFor.value = ''
  partNumberDetailLoading.value = true
  try {
    const res = await post(
      GET_PART_NUMBER_DETAIL_API.GET_PART_NUMBER_DETAIL,
      new URLSearchParams({ partNumber: String(partNumber) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200 && res.data) {
      partNumberDetail.value = res.data
      partNumberDetailFor.value = partNumber
    } else {
      showApiError(res, 'custmat.salesnumber.getPartNumberDetailFailed')
    }
  } catch {
    showMessage(t('custmat.salesnumber.getPartNumberDetailFailed'))
  } finally {
    partNumberDetailLoading.value = false
  }
}

const handleSearch = () => {
  pagination.pageIndex = 1
  fetchSalesNumberList()
}

const handleReset = () => {
  Object.assign(filters, {
    partNumber: ''
  })
  handleSearch()
}

/** 以居中弹出窗口（非全屏新标签）方式打开负责客户分布图页面 */
const handleViewCustomerDistribution = () => {
  const resolved = router.resolve({ path: '/custmat/sales-mgmt/salescustomerdistribution' })
  const width = 900
  const height = 650
  const left = window.screenX + Math.max((window.outerWidth - width) / 2, 0)
  const top = window.screenY + Math.max((window.outerHeight - height) / 2, 0)
  window.open(
    resolved.href,
    'SalesCustomerDistribution',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  )
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchSalesNumberList()
}

const handlePageChange = () => {
  fetchSalesNumberList()
}

onMounted(() => {
  fetchSalesNumberList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.part-number-detail {
  /* 固定高度避免加载态切换到内容时弹窗重新定位闪烁，取值刚好容纳 15 行单行内容 */
  height: 470px;
  overflow-y: auto;
}

.part-number-detail-row {
  /* 左右留出间距，使分割线不顶到弹窗边缘 */
  margin: 0 8px;
  padding: 6px 0;
  font-size: 13px;
  line-height: 1.4;
  border-bottom: 1px solid var(--el-border-color);
  /* 每行只占一行，超出省略，保证整体高度稳定 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.part-number-detail-row:last-child {
  border-bottom: none;
}
</style>
