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
        <el-form-item :label="$t('custmat.salesnumber.salesUser')">
          <el-select v-model="filters.salesUserId"
                     style="width: 170px"
                     clearable
                     filterable
                     :placeholder="$t('custmat.salesnumber.pleaseSelectSalesUser')">
            <el-option v-for="item in salesUserOptions" :key="item.salesUserId" :label="item.userName" :value="item.salesUserId" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('custmat.salesnumber.userName')">
          <el-input v-model="filters.userName"
                    style="width: 170px"
                    clearable
                    :placeholder="$t('custmat.salesnumber.pleaseInputUserName')" />
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
          <el-button type="primary" @click="handleAdd">
            {{ $t('custmat.salesnumber.addSalesNumber') }}
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
          <el-table-column prop="partNumber" :label="$t('custmat.salesnumber.partNumber')" align="center" min-width="160">
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
          <el-table-column prop="partName" :label="$t('custmat.salesnumber.partName')" align="left" min-width="180" />
          <el-table-column prop="userNo" :label="$t('custmat.salesnumber.userNo')" align="left" min-width="120" />
          <el-table-column prop="userName" :label="$t('custmat.salesnumber.userName')" align="left" min-width="140" />
          <el-table-column :label="$t('custmat.salesnumber.operation')" width="180" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">
                {{ $t('common.delete') }}
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

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible"
               :title="isEdit ? $t('custmat.salesnumber.editSalesNumberTitle') : $t('custmat.salesnumber.addSalesNumberTitle')"
               width="820px"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <div v-loading="dialogLoading">
        <el-form ref="editFormRef"
                 :model="editForm"
                 :rules="formRules"
                 label-width="auto"
                 class="dialog-form"
                 role="form"
                 :aria-label="$t('custmat.salesnumber.ariaEditLabel')">
          <div class="dialog-form-row">
            <el-form-item :label="$t('custmat.salesnumber.partNumber')" prop="partNumberId">
              <el-select v-model="editForm.partNumberId"
                         filterable
                         remote
                         reserve-keyword
                         style="width:100%"
                         :remote-method="handleSearchPartNumber"
                         :loading="partNumberLoading"
                         :placeholder="$t('custmat.salesnumber.pleaseSelectPartNumber')">
                <el-option v-for="item in partNumberOptions" :key="item.partNumber" :label="item.partNumber" :value="item.partNumber" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('custmat.salesnumber.salesUser')" prop="salesUserId">
              <el-select v-model="editForm.salesUserId"
                         style="width:100%"
                         filterable
                         :placeholder="$t('custmat.salesnumber.pleaseSelectSalesUser')">
                <el-option v-for="item in salesUserOptions" :key="item.salesUserId" :label="item.userName" :value="item.salesUserId" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post, isHandled } from '@/utils/request'
import {
  GET_SALES_NUMBER_PAGE_API,
  GET_SALES_NUMBER_ENTITY_API,
  INSERT_SALES_NUMBER_API,
  UPDATE_SALES_NUMBER_API,
  DELETE_SALES_NUMBER_API,
  GET_SALES_USER_DROP_API,
  GET_COMPANY_PART_NUMBER_DROP_API,
  GET_PART_NUMBER_DETAIL_API
} from '@/config/api/custmat/sales-mgmt/salesnumber'

const { t } = useI18n()

const REMOTE_SEARCH_DEBOUNCE_MS = 300

/** 实体查询/删除接口按 form-urlencoded 提交 */
const FORM_URLENCODED = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

const salesNumberList = ref([])
const loading = ref(false)
const salesUserOptions = ref([])

const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

const filters = reactive({
  partNumber: '',
  salesUserId: '',
  userName: ''
})

// 新增/编辑对话框
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const editForm = reactive({
  partNumberId: '',
  originalPartNumberId: '',
  salesUserId: ''
})

const formRules = {
  partNumberId: [
    { required: true, message: () => t('custmat.salesnumber.partNumberRequired'), trigger: 'change' }
  ],
  salesUserId: [
    { required: true, message: () => t('custmat.salesnumber.salesUserRequired'), trigger: 'change' }
  ]
}

// 料号远程搜索下拉
const partNumberOptions = ref([])
const partNumberLoading = ref(false)
let partNumberTimer = null

// 料号详情提示框
const partNumberDetail = ref(null)
const partNumberDetailLoading = ref(false)
/** 当前已加载详情所属的料号，用于确保弹窗只展示本行的最新数据 */
const partNumberDetailFor = ref('')

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const resetEditForm = () => {
  Object.assign(editForm, {
    partNumberId: '',
    originalPartNumberId: '',
    salesUserId: ''
  })
  partNumberOptions.value = []
}

/** 业务人员下拉 */
const fetchSalesUserOptions = async () => {
  try {
    const res = await post(GET_SALES_USER_DROP_API.GET_SALES_USER_DROP, {})
    if (isHandled(res)) {
      salesUserOptions.value = []
      return
    }
    if (res?.code === 200) {
      salesUserOptions.value = res.data || []
    } else {
      salesUserOptions.value = []
      showMessage(res?.message || t('custmat.salesnumber.getSalesUserFailed'))
    }
  } catch {
    salesUserOptions.value = []
    showMessage(t('custmat.salesnumber.getSalesUserFailed'))
  }
}

const fetchSalesNumberList = async () => {
  loading.value = true
  try {
    const res = await post(GET_SALES_NUMBER_PAGE_API.GET_SALES_NUMBER_PAGE, {
      partNumber: filters.partNumber,
      salesUserId: filters.salesUserId,
      userName: filters.userName,
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
      showMessage(res?.message || t('custmat.salesnumber.getFailed'))
      salesNumberList.value = []
    }
  } catch {
    showMessage(t('custmat.salesnumber.getFailed'))
    salesNumberList.value = []
  } finally {
    loading.value = false
  }
}

// 公司料号远程搜索（防抖）
const handleSearchPartNumber = (keyword) => {
  if (partNumberTimer) clearTimeout(partNumberTimer)
  if (!keyword) {
    partNumberOptions.value = []
    return
  }
  partNumberTimer = setTimeout(async () => {
    partNumberLoading.value = true
    try {
      const res = await post(
        GET_COMPANY_PART_NUMBER_DROP_API.GET_COMPANY_PART_NUMBER_DROP,
        new URLSearchParams({ keyword }),
        FORM_URLENCODED
      )
      partNumberOptions.value = res?.code === 200 ? (res.data || []) : []
    } catch {
      partNumberOptions.value = []
    } finally {
      partNumberLoading.value = false
    }
  }, REMOTE_SEARCH_DEBOUNCE_MS)
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
      showMessage(res?.message || t('custmat.salesnumber.getPartNumberDetailFailed'))
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
    partNumber: '',
    salesUserId: '',
    userName: ''
  })
  handleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchSalesNumberList()
}

const handlePageChange = () => {
  fetchSalesNumberList()
}

const handleAdd = async () => {
  resetEditForm()
  isEdit.value = false
  dialogVisible.value = true
  dialogLoading.value = true

  if (salesUserOptions.value.length === 0) await fetchSalesUserOptions()
  // 新增时下拉框默认选中第一项
  if (!editForm.salesUserId && salesUserOptions.value.length) editForm.salesUserId = salesUserOptions.value[0].salesUserId

  await nextTick()
  editFormRef.value?.clearValidate()
  dialogLoading.value = false
}

const handleEdit = async (row) => {
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true

  try {
    if (salesUserOptions.value.length === 0) await fetchSalesUserOptions()

    const res = await post(
      GET_SALES_NUMBER_ENTITY_API.GET_SALES_NUMBER_ENTITY,
      new URLSearchParams({ partNumber: String(row.partNumber) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) {
      dialogVisible.value = false
      return
    }

    if (res?.code === 200 && res.data) {
      const data = Array.isArray(res.data) ? res.data[0] : res.data
      Object.assign(editForm, {
        partNumberId: data.partNumber,
        // 记录进入编辑时的原始料号，供修改时提交 originalPartNumberId 使用，不在界面上展示/编辑
        originalPartNumberId: data.partNumber,
        salesUserId: data.salesUserId
      })
      // 预置当前值，使远程搜索下拉能正常回显已选料号
      partNumberOptions.value = data.partNumber ? [{ partNumber: data.partNumber }] : []
    } else {
      showMessage(res?.message || t('custmat.salesnumber.getSalesNumberDetailFailed'))
      dialogVisible.value = false
    }
  } catch {
    showMessage(t('custmat.salesnumber.getSalesNumberDetailFailed'))
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
    nextTick(() => editFormRef.value?.clearValidate())
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('custmat.salesnumber.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  try {
    const res = await post(
      DELETE_SALES_NUMBER_API.DELETE_SALES_NUMBER,
      new URLSearchParams({ partNumberId: String(row.partNumber) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || t('custmat.salesnumber.deleteSalesNumberSuccess'), 'success')
      fetchSalesNumberList()
    } else {
      showMessage(res?.message || t('custmat.salesnumber.operationFailed'))
    }
  } catch {
    showMessage(t('custmat.salesnumber.operationFailed'))
  }
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const api = isEdit.value
      ? UPDATE_SALES_NUMBER_API.UPDATE_SALES_NUMBER
      : INSERT_SALES_NUMBER_API.INSERT_SALES_NUMBER
    const res = await post(api, {
      partNumber: editForm.partNumberId,
      // 新增时无“原料号”概念，直接沿用当前选择的料号；编辑时使用进入弹窗时记录的原始料号
      originalPartNumber: isEdit.value ? editForm.originalPartNumberId : editForm.partNumberId,
      salesUserId: editForm.salesUserId
    })

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || (isEdit.value ? t('custmat.salesnumber.editSalesNumberSuccess') : t('custmat.salesnumber.addSalesNumberSuccess')), 'success')
      dialogVisible.value = false
      handleSearch()
    } else {
      showMessage(res?.message || t('custmat.salesnumber.operationFailed'))
    }
  } catch {
    showMessage(t('custmat.salesnumber.operationFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetEditForm()
  dialogLoading.value = false
  editFormRef.value?.clearValidate()
}

onMounted(async () => {
  await fetchSalesUserOptions()
  fetchSalesNumberList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.dialog-form {
  padding: 4px 0 0;
}

.dialog-form-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.dialog-form-row .el-form-item {
  flex: 1;
  margin-bottom: 0;
}

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
