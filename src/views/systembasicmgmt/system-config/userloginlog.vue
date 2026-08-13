<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.userloginlog.ariaFilterLabel')">
        <el-form-item>
          <el-button :icon="Filter" @click="filterDialogVisible = true">
            {{ $t('systembasicmgmt.userloginlog.filterQuery') }}
          </el-button>
          <el-button :icon="RefreshLeft" :title="$t('systembasicmgmt.userloginlog.clearAll')" @click="handleClearFiltersAndSearch" />
        </el-form-item>
      </el-form>

      <el-dialog
        v-model="filterDialogVisible"
        :title="$t('systembasicmgmt.userloginlog.filterQuery')"
        width="700px"
        destroy-on-close
        append-to-body
      >
        <el-form :model="filters" :inline="true" label-width="90px" class="dialog-form filter-dialog">
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.userloginlog.filter.userNo')">
              <el-input v-model="filters.userNo"
                       style="width: 100%;"
                       :placeholder="$t('systembasicmgmt.userloginlog.pleaseInputUserNo')"
                       clearable />
            </el-form-item>
            <el-form-item :label="$t('systembasicmgmt.userloginlog.filter.ip')">
              <el-input v-model="filters.ip"
                       style="width: 100%;"
                       :placeholder="$t('systembasicmgmt.userloginlog.pleaseInputIp')"
                       clearable />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.userloginlog.filter.startTime')">
              <el-date-picker
                v-model="filters.startTime"
                type="datetime"
                style="width: 100%;"
                :placeholder="$t('systembasicmgmt.userloginlog.pleaseSelectStartTime')"
                format="YYYY/MM/DD HH:mm:ss"
                value-format="YYYY/MM/DD HH:mm:ss" />
            </el-form-item>
            <el-form-item :label="$t('systembasicmgmt.userloginlog.filter.endTime')">
              <el-date-picker
                v-model="filters.endTime"
                type="datetime"
                style="width: 100%;"
                :placeholder="$t('systembasicmgmt.userloginlog.pleaseSelectEndTime')"
                format="YYYY/MM/DD HH:mm:ss"
                value-format="YYYY/MM/DD HH:mm:ss" />
            </el-form-item>
          </div>
        </el-form>

        <template #footer>
          <div class="filter-dialog-footer">
            <el-button @click="handleClearFilters">
              {{ $t('systembasicmgmt.userloginlog.clearAll') }}
            </el-button>
            <el-button type="primary" @click="handleSearch">
              {{ $t('common.confirm') }}
            </el-button>
          </div>
        </template>
      </el-dialog>

      <div class="table-container">
        <el-table :data="userLoginLogList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.userloginlog.index')" width="70" align="center" fixed />
          <el-table-column prop="userNo" :label="$t('systembasicmgmt.userloginlog.userNo')" align="center" min-width="120" />
          <el-table-column prop="userName" :label="$t('systembasicmgmt.userloginlog.userName')" align="left" min-width="150" />
          <el-table-column prop="ip" :label="$t('systembasicmgmt.userloginlog.ip')" align="center" min-width="140" />
          <el-table-column :label="$t('systembasicmgmt.userloginlog.loginTypeName')" align="center" min-width="130">
            <template #default="scope">
              <el-tag :type="getLoginTypeTagType(scope.row.loginType)">
                {{ getLoginTypeName(scope.row.loginType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="loginDate"
                           :label="$t('systembasicmgmt.userloginlog.loginDate')"
                           align="center"
                           min-width="180"
                           :formatter="(row, col, val) => formatDateTime(val)" />
        </el-table>
      </div>

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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post } from '@/utils/request'
import { GET_USER_LOGIN_LOG_PAGES_API } from '@/config/api/systembasicmgmt/system-config/userloginlog'
import { Filter, RefreshLeft } from '@element-plus/icons-vue'

const { t } = useI18n()

let searchTimer = null

const LOGIN_TYPE_TAG_TYPES = {
  LoginSuccessful: 'success',
  IncorrectPassword: 'danger',
  AccountNotExist: 'warning',
  LoggedOut: 'info'
}

const userLoginLogList = ref([])
const loading = ref(false)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

const filterDialogVisible = ref(false)

const defaultFilters = () => ({
  userNo: '',
  ip: '',
  startTime: '',
  endTime: ''
})

const filters = reactive(defaultFilters())

const formatDateTime = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 后端返回的登录类型可能没有对应译文，此时直接展示原始值 */
const getLoginTypeName = (loginType) => {
  if (!loginType) return ''
  const key = `systembasicmgmt.userloginlog.loginType.${loginType}`
  const text = t(key)
  return text === key ? loginType : text
}

const getLoginTypeTagType = (loginType) => LOGIN_TYPE_TAG_TYPES[loginType] ?? 'info'

const fetchUserLoginLogPages = async () => {
  loading.value = true
  const res = await post(GET_USER_LOGIN_LOG_PAGES_API.GET_USER_LOGIN_LOG_PAGES, {
    userNo: filters.userNo,
    ip: filters.ip,
    startTime: filters.startTime,
    endTime: filters.endTime,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  })
  if (res?.code === 200) {
    userLoginLogList.value = res.data || []
    pagination.totalCount = res.totalCount || 0
  } else if (res) {
    ElMessage({ message: res.message, type: Number(res?.code) === 400 ? 'warning' : 'error', plain: true, showClose: true })
  }
  loading.value = false
}

const handleSearch = () => {
  filterDialogVisible.value = false
  pagination.pageIndex = 1
  fetchUserLoginLogPages()
}

const handleClearFilters = () => {
  Object.assign(filters, defaultFilters())
}

const handleClearFiltersAndSearch = () => {
  handleClearFilters()
  pagination.pageIndex = 1
  fetchUserLoginLogPages()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchUserLoginLogPages()
}

const handlePageChange = () => {
  fetchUserLoginLogPages()
}

onMounted(() => {
  fetchUserLoginLogPages()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.filter-dialog .form-row .el-form-item {
  flex: 0 0 calc(50% - 10px);
}

.filter-dialog .form-row .el-form-item:last-child {
  margin-right: 0;
}

.filter-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
